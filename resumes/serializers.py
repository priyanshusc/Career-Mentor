from rest_framework import serializers
from .models import Resume, ResumeEducation, ResumeExperience, ResumeSkill, ResumeProject,ProjectSuggestion, QuizQuestion, QuizAttempt

class ProjectSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectSuggestion
        fields = ['id', 'user', 'skill', 'job_goal', 'title', 'description', 'readme', 'created_at']
        read_only_fields = ['user', 'created_at']

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ['id', 'skill', 'question', 'options', 'answer', 'difficulty', 'explanation']

class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = ['id', 'user', 'quiz_question', 'selected_option', 'is_correct', 'timestamp']
        read_only_fields = ['user', 'is_correct', 'timestamp']
class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ["id", "file", "parsed_json", "ats_warnings", "uploaded_at"]
        read_only_fields = ["parsed_json", "ats_warnings", "uploaded_at"]


class ResumeEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeEducation
        fields = ['institution', 'degree', 'start_year', 'end_year']


class ResumeExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeExperience
        fields = ['role', 'organization', 'duration']


class ResumeSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeSkill
        fields = ['skill']


class ResumeProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeProject
        fields = ['title', 'description']
