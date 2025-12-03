from django.urls import path
from .views import JobDescriptionListCreateView, JobDescriptionRetrieveUpdateDestroyView

urlpatterns = [
    path('', JobDescriptionListCreateView.as_view(), name='jobdesc-list-create'),
    path('<int:pk>/', JobDescriptionRetrieveUpdateDestroyView.as_view(), name='jobdesc-detail'),
    
]
