from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from .models import ProjectSuggestion


class ProjectSuggestionTests(APITestCase):
	def setUp(self):
		User = get_user_model()
		self.user = User.objects.create_user(username="testuser", password="password123")
		self.client = APIClient()
		# Force authenticate to avoid dealing with JWT in tests
		self.client.force_authenticate(user=self.user)

	def test_create_suggestions_and_dedup(self):
		url = "/resume/project-suggest/"
		data = {"missing_skills": ["react", "django"], "job_goal": "Software Engineer"}
		resp = self.client.post(url, data, format="json")
		self.assertEqual(resp.status_code, 201)
		self.assertIn("project_suggestions", resp.data)
		self.assertEqual(len(resp.data["project_suggestions"]), 2)

		# Post same data again -- should not create duplicates
		resp2 = self.client.post(url, data, format="json")
		self.assertEqual(resp2.status_code, 201)
		count = ProjectSuggestion.objects.filter(user=self.user, job_goal="Software Engineer").count()
		self.assertEqual(count, 2)
