from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
]


from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),   # 👈 This must be here
    path('', include('frontend.urls')),  # For your dashboard
]
