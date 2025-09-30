from django.urls import path
from .views import FraudPredictView

urlpatterns = [
    path('predict/', FraudPredictView.as_view(), name='predict'),
]
