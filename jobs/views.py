from rest_framework import generics, permissions
from .models import JobDescription
from .serializers import JobDescriptionSerializer

class JobDescriptionListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = JobDescription.objects.all()
    serializer_class = JobDescriptionSerializer

class JobDescriptionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = JobDescription.objects.all()
    serializer_class = JobDescriptionSerializer