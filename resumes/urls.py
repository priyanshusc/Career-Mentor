from django.urls import path
from .views import (
    ResumeUploadView,
    ResumeEducationListView,
    ResumeExperienceListView,
    ResumeSkillListView,
    ResumeProjectListView,
    ResumeStructuredDataView,
    ATSScoreWithRoadmapView,
    RoadmapView,
    ProjectSuggestionView,
    QuizListView,
    QuizAttemptView,
)

urlpatterns = [
    path("upload/", ResumeUploadView.as_view(), name="resume-upload"),

    # CORRECTED PATHS: Removed the 'resume/' prefix from all of these
    path("<int:pk>/education/", ResumeEducationListView.as_view(), name="resume-education"),
    path("<int:pk>/experience/", ResumeExperienceListView.as_view(), name="resume-experience"),
    path("<int:pk>/skills/", ResumeSkillListView.as_view(), name="resume-skills"),
    path("<int:pk>/projects/", ResumeProjectListView.as_view(), name="resume-projects"),
    path("<int:pk>/structured/", ResumeStructuredDataView.as_view(), name="resume-structured"),
    path("<int:pk>/ats-score-roadmap/", ATSScoreWithRoadmapView.as_view(), name="ats-score-roadmap"),

    path("api/roadmap/", RoadmapView.as_view(), name="roadmap"),
    path("project-suggest/", ProjectSuggestionView.as_view(), name="project-suggest"),
    
    # Quiz endpoints
    path("quizzes/list/", QuizListView.as_view(), name="quiz-list"),
    path("quizzes/attempt/", QuizAttemptView.as_view(), name="quiz-attempt"),
]