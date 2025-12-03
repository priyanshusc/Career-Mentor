# jobs/models.py
from django.db import models

class JobDescription(models.Model):
    title = models.CharField(max_length=255)
    required_skills = models.JSONField()
    keywords = models.JSONField(blank=True, null=True)
    min_experience_years = models.IntegerField(default=0)

    def __str__(self):
        return self.title
