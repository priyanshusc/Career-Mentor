from django.contrib import admin
from django.urls import path, include
from users.views import signup
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to AI Career Mentor 🚀")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
   
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # path('signup/', signup, name='signup'),
    path("", home),
    
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    # Resumes module
    path("resume/", include("resumes.urls")),

    path('job-descriptions/', include('jobs.urls')),  # Jobs module
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)