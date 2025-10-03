from django.urls import path
from .views import FraudPredictView

urlpatterns = [
    path('predict/', FraudPredictView.as_view(), name='predict'),
]

from django.urls import path, include
from rest_framework import routers
from .views import TransactionViewSet, predict

router = routers.DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
    path('predict/', predict, name='predict'),   # 👈 THIS LINE IS IMPORTANT
]
