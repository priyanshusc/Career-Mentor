import requests
import re
import logging
import os
import json
from django.conf import settings
from rest_framework import generics, permissions, status, parsers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404
from dotenv import load_dotenv

from .models import ProjectSuggestion, QuizQuestion, QuizAttempt
from .serializers import (
    ProjectSuggestionSerializer, QuizQuestionSerializer, QuizAttemptSerializer,
    ResumeSerializer, ResumeEducationSerializer, ResumeExperienceSerializer,
    ResumeSkillSerializer, ResumeProjectSerializer
)
from resumes.models import Resume, ResumeEducation, ResumeExperience, ResumeSkill, ResumeProject
from .utils.resume_extractor import structured_resume
from .utils.text_parser import extract_text_and_ats

import spacy
from nltk.corpus import stopwords
import difflib
import os
import re
import logging
from dotenv import load_dotenv

# ------------------- LOAD ENV VARIABLES -------------------
load_dotenv()
logger = logging.getLogger(__name__)

# ------------------- STOPWORDS CONFIG -------------------
def load_stopwords(filepath):
    """Safely load custom stopwords file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return set(line.strip().lower() for line in f if line.strip())
    except FileNotFoundError:
        logger.warning(f"Stopwords file not found at {filepath}, using defaults.")
        return set()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STOPWORDS_PATH = os.path.join(BASE_DIR, 'resumes', 'utils', 'stopwords.txt')
STOPWORDS = load_stopwords(STOPWORDS_PATH)

# --- Load spaCy safely ---
try:
    nlp = spacy.load("en_core_web_sm")
except Exception as e:
    nlp = None
    logger.warning(f"spaCy not available: {e}. Some text parsing limited.")

# --- Load NLTK stopwords safely ---
try:
    BASE_STOPWORDS = set(stopwords.words("english"))
except Exception as e:
    BASE_STOPWORDS = set()
    logger.warning(f"Could not load NLTK stopwords: {e}")

# --- Merge stopwords ---
STOPWORDS |= BASE_STOPWORDS | {
    "responsibilities", "requirements", "preferred", "must", "should", "build", "learn",
    "responsibility", "requirement", "training", "experience", "proficiency",
    "understanding", "familiarity", "capability", "role", "team", "environment",
    "skills", "ability", "knowledge", "exposure", "plus", "good"
}

# ⚠️ Removed "algorithm" because it's a real skill, not a stopword

# ------------------- MASTER SKILL LIST -------------------
SKILL_MASTER_PATH = os.path.join(BASE_DIR, 'resumes', 'utils', 'skills_master.txt')
try:
    with open(SKILL_MASTER_PATH, 'r', encoding='utf-8') as f:
        SKILL_MASTER_SET = {line.strip().lower() for line in f if line.strip()}
    logger.info(f"Loaded {len(SKILL_MASTER_SET)} master skills.")
except FileNotFoundError:
    SKILL_MASTER_SET = set()
    logger.warning("Skill master file not found — skill matching disabled.")

# ------------------- NORMALIZATION -------------------
def normalize_skill(skill):
    """
    Normalize skill text to improve matching.
    Keeps same logic as before but fixes casing, dots, and spacing.
    """
    if not skill:
        return ""

    skill_clean = skill.strip().lower().replace("-", " ").replace("_", " ")

    # Fix cases for specific known patterns
    if "c++" in skill_clean or "cplusplus" in skill_clean or "c plus plus" in skill_clean:
        return "c++"

    if any(x in skill_clean for x in ["js", "java script", "javascript"]):
        return "javascript"

    # Remove unwanted punctuation but keep '+'
    skill_clean = re.sub(r"[^\w\s\+]", "", skill_clean).strip()

    replacements = {
        "rest apis": "rest",
        "rest api": "rest",
        "python": "python",
        "django": "django",
        "reactjs": "reactjs",
        "react js": "reactjs",
        "flask": "flask",
        "aws": "aws",
        "machine learning": "machine learning",
        "cloud computing": "cloud",
        "sql": "sql",
        "nosql": "nosql",
        "mongodb": "mongodb",
        "mysql": "mysql",
        "c": "c",
        "java": "java",
        "html": "html",
        "css": "css",
    }

    for key, value in replacements.items():
        if key in skill_clean:
            return value

    return skill_clean.strip()

# ------------------- MISTRAL API -------------------
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"

def _get_mistral_api_key():
    key = os.getenv("MISTRAL_API_KEY") or getattr(settings, "MISTRAL_API_KEY", None)
    if key:
        key = key.strip().strip('"').strip("'")
    return key


def generate_roadmap_from_mistral(missing_skills):
    if not missing_skills:
        return ""

    prompt = (
        "You are a senior career mentor. The user is missing these skills: "
        f"{', '.join(missing_skills)}.\n\n"
        "Generate a clean Markdown roadmap for each skill:\n\n"
        "### Skill: <Skill Name>\n"
        "**Overview:** <1-line summary>\n"
        "**Key Topics:**\n1. <topic1>\n2. <topic2>\n3. <topic3>\n"
        "**Top Resources:**\n- <resource>\n- <resource>\n"
        "**Certification:** <certification>\n**Time Estimate:** <duration>\n"
    )

    api_key = _get_mistral_api_key()
    if not api_key:
        return "⚠️ Missing Mistral API key in .env or settings."

    try:
        resp = requests.post(
            MISTRAL_API_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "mistral-large-latest",
                "messages": [
                    {"role": "system", "content": "You are a helpful tech mentor."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.6,
            },
            timeout=60,
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]
    except Exception as e:
        logger.error(f"Mistral API error: {e}")
        return "⚠️ Error generating roadmap."

# ------------------- ROADMAP VIEW -------------------
class RoadmapView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        missing_skills = request.data.get("missing_skills", [])
        roadmap = generate_roadmap_from_mistral(missing_skills)
        return Response({"roadmap": roadmap})

# ------------------- RESUME UPLOAD -------------------
class ResumeUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    @transaction.atomic
    def post(self, request):
        serializer = ResumeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        resume = serializer.save(user=request.user)
        try:
            parsed_json, warnings = extract_text_and_ats(resume.file.path)
            structured_data = structured_resume(parsed_json)
        except Exception as e:
            resume.delete()
            return Response({"detail": f"Parsing error: {str(e)}"}, status=500)

        resume.parsed_json = structured_data
        resume.ats_warnings = warnings
        resume.save()

        resume.education.all().delete()
        resume.experience.all().delete()
        resume.skills.all().delete()

        for edu in structured_data.get("education", []):
            ResumeEducation.objects.create(resume=resume, **edu)
        for exp in structured_data.get("experience", []):
            ResumeExperience.objects.create(resume=resume, **exp)
        for skill in structured_data.get("skills", []):
            ResumeSkill.objects.create(resume=resume, skill=normalize_skill(skill))

        return Response(ResumeSerializer(resume).data, status=201)

# ------------------- RESUME DETAILS -------------------
class ResumeEducationListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ResumeEducationSerializer
    def get_queryset(self):
        return ResumeEducation.objects.filter(resume__id=self.kwargs['pk'])

class ResumeExperienceListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ResumeExperienceSerializer
    def get_queryset(self):
        return ResumeExperience.objects.filter(resume__id=self.kwargs['pk'])

class ResumeSkillListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ResumeSkillSerializer
    def get_queryset(self):
        return ResumeSkill.objects.filter(resume__id=self.kwargs['pk'])

class ResumeProjectListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ResumeProjectSerializer
    def get_queryset(self):
        return ResumeProject.objects.filter(resume__id=self.kwargs['pk'])

class ResumeStructuredDataView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, pk):
        resume = get_object_or_404(Resume, pk=pk)
        return Response(resume.parsed_json)

# ------------------- ATS SCORE WITH ROADMAP -------------------
class ATSScoreWithRoadmapView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk=None):
        resume_id = pk or request.data.get("resume_id")
        job_description = request.data.get("job_description", "")

        if not job_description:
            return Response({"error": "Job description is required"}, status=400)

        try:
            resume = Resume.objects.get(id=resume_id, user=request.user)
        except Resume.DoesNotExist:
            return Response({"error": "Resume not found"}, status=404)

        parsed_data = resume.parsed_json or {}
        if isinstance(parsed_data, str):
            try:
                parsed_data = json.loads(parsed_data)
            except json.JSONDecodeError:
                parsed_data = {}

        resume_skills = {normalize_skill(s) for s in parsed_data.get("skills", [])}
        job_skills = self._extract_skills_from_text(job_description)

        matched_skills = resume_skills & job_skills
        missing_skills = list(job_skills - resume_skills)
        score = round((len(matched_skills) / len(job_skills) * 100), 2) if job_skills else 0

        roadmap = generate_roadmap_from_mistral(missing_skills) if missing_skills else "✅ You match all required skills!"

        return Response({
            "score": score,
            "matched_skills": sorted(list(matched_skills)),
            "matching_skills": sorted(list(matched_skills)),
            "missing_skills": sorted(list(missing_skills)),
            "roadmap": roadmap
        })

    def _extract_skills_from_text(self, text):
        if not text:
            return set()
        found = set()
        text_lower = text.lower()
        for skill in SKILL_MASTER_SET:
            if skill in text_lower:
                found.add(normalize_skill(skill))
        return found

# ------------------- PROJECT SUGGESTIONS -------------------
def generate_project_suggestion(skill, job_goal=""):
    norm = normalize_skill(skill)
    google_api_key = "AIzaSyD2vMkJQ5_CGRBa3hw6Gzo1OISeNPN95VA"

    prompt = f"""
You are a software mentor.
Suggest a **mini project** for learning **{skill}** for a **{job_goal}** role.
Format:
### Project: <Title>
**Goal:** <Summary>
**Tech Stack:** - <tech>
**Features:** 1. <feature>
**Steps:** 1. <step>
**Time Estimate:** <duration>
"""

    # Use Google Gemini API only
    return _generate_google_project_suggestion(skill, job_goal, google_api_key, prompt)

def _generate_google_project_suggestion(skill, job_goal, api_key, prompt):
    """
    Call Google Generative Language (Gemini) to generate a project suggestion.
    Falls back to the static generator if no API key is provided or on any error.
    Returns (title, description, readme_text).
    """
    if not api_key:
        logger.warning("Google API key not provided, falling back to static project suggestion.")
        return _generate_static_project_suggestion(skill, job_goal)

    try:
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        params = {"key": api_key}
        resp = requests.post(url, headers=headers, params=params, json=payload, timeout=60)
        resp.raise_for_status()
        data = resp.json()
        # Parse Gemini response (defensive parsing)
        text = ""
        try:
            text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "") or ""
        except Exception:
            text = json.dumps(data)

        title_line = next((l for l in text.split("\n") if "project:" in l.lower()), None)
        title = title_line.replace("### Project:", "").strip() if title_line else f"{skill.title()} Project"
        desc = f"A mini project to practice {skill} for {job_goal or 'career growth'} (Google Gemini)."
        return title, desc, text
    except Exception as e:
        logger.error(f"Google Gemini project suggestion error: {e}")
        return _generate_static_project_suggestion(skill, job_goal)

def _generate_static_project_suggestion(skill, job_goal=""):
    templates = {
        "reactjs": ("Portfolio App", "React", "1-2 weeks"),
        "django": ("Job Board App", "Django", "1-3 weeks"),
        "python": ("CLI Utility", "Python", "1 week"),
        "aws": ("Deploy on AWS", "AWS", "1-2 weeks"),
        "sql": ("Data Dashboard", "SQL", "1 week"),
    }
    s = skill.lower()
    if s in templates:
        title, stack, time = templates[s]
        desc = f"A project to strengthen your {skill} skills for {job_goal}."
        readme = f"# {title}\n**Goal:** {desc}\n**Tech:** {stack}\n**Duration:** {time}"
        return title, desc, readme
    title = f"{skill.title()} Practice Project"
    desc = f"Build a mini project to apply your {skill} knowledge for {job_goal}."
    return title, desc, f"# {title}\n**Goal:** {desc}\n**Duration:** 1-2 weeks"

class ProjectSuggestionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        missing_skills = request.data.get("missing_skills", [])
        job_goal = request.data.get("job_goal", "")
        user = request.user
        projects = []
        for skill in missing_skills:
            title, desc, readme = generate_project_suggestion(skill, job_goal)
            project, _ = ProjectSuggestion.objects.get_or_create(
                user=user, skill=skill, job_goal=job_goal,
                defaults={"title": title, "description": desc, "readme": readme}
            )
            projects.append(project)
        return Response({"project_suggestions": ProjectSuggestionSerializer(projects, many=True).data})

# ------------------- QUIZ -------------------
class QuizListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        skill = request.query_params.get("skill")
        if not skill:
            return Response({"error": "Skill is required"}, status=400)
        questions = QuizQuestion.objects.filter(skill__icontains=skill)
        if not questions.exists():
            return Response({"questions": [], "message": f"No quiz questions for {skill}"})
        return Response({"questions": QuizQuestionSerializer(questions, many=True).data})

class QuizAttemptView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        qid = request.data.get("quiz_question_id")
        option = request.data.get("selected_option")
        if not qid or not option:
            return Response({"error": "Missing quiz_question_id or selected_option"}, status=400)
        try:
            q = QuizQuestion.objects.get(id=qid)
        except QuizQuestion.DoesNotExist:
            return Response({"error": "Question not found"}, status=404)
        correct = option.lower() == q.answer.lower()
        QuizAttempt.objects.create(user=request.user, quiz_question=q, selected_option=option, is_correct=correct)
        return Response({"correct": correct, "explanation": q.explanation, "correct_answer": q.answer})
