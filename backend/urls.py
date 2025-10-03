from django.contrib import admin
from django.urls import path, include
from frontend import views as frontend_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),       # API endpoints
    path('', frontend_views.home, name='home'),   # Homepage
]
