from django.db import models
from django.conf import settings


class Resume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)  # User owning this resume
    file = models.FileField(upload_to="resumes/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    parsed_json = models.JSONField(null=True, blank=True)  # Raw plus structured JSON data after parsing
    ats_warnings = models.TextField(blank=True, null=True)  # Warnings about ATS compatibility


class ParsedResume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    file = models.FileField(upload_to="resumes/")  # Original file
    extracted_text = models.TextField(blank=True, null=True)  # Parsed text
    created_at = models.DateTimeField(auto_now_add=True)


class ResumeSkill(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="skills")
    skill = models.CharField(max_length=100)

    def __str__(self):
        return self.skill


class ResumeEducation(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="education")
    institution = models.CharField(max_length=255,null=True, blank=True)
    degree = models.CharField(max_length=255, blank=True, null=True)
    start_year = models.CharField(max_length=10, blank=True, null=True)
    end_year = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f"{self.degree} at {self.institution}"


class ResumeExperience(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="experience")
    role = models.CharField(max_length=255)
    organization = models.CharField(max_length=255, blank=True, null=True)
    duration = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.role} at {self.organization}"


class ResumeProject(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title
class ProjectSuggestion(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    skill = models.CharField(max_length=100)
    job_goal = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    readme = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.skill})"

class QuizQuestion(models.Model):
    skill = models.CharField(max_length=100)
    question = models.TextField()
    options = models.JSONField()  # example: {"a": "option 1", "b": "option 2", ...}
    answer = models.CharField(max_length=5)  # key of the correct option, e.g., 'a'
    difficulty = models.CharField(max_length=20, default='Easy')
    explanation = models.TextField(blank=True)

    def __str__(self):
        return self.question

class QuizAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quiz_question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE)
    selected_option = models.CharField(max_length=5)
    is_correct = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)