from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .predictor import predict

class FraudPredictView(APIView):
    def post(self, request):
        data = request.data.get("features")  # list of 30 features
        if not data or len(data) != 30:
            return Response({"error": "Invalid input"}, status=400)
        result = predict(data)
        return Response({"prediction": result})

from rest_framework import viewsets
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-created_at')
    serializer_class = TransactionSerializer


from rest_framework.decorators import api_view
from rest_framework.response import Response
import joblib
import os
import numpy as np

# Load the trained model once when the server starts
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'fraud_model.pkl')
model = joblib.load(MODEL_PATH)

@api_view(['POST'])
def predict(request):
    features = request.data.get('features')
    if not features:
        return Response({"error": "No features provided"}, status=400)

    # Convert features to numpy array and reshape
    features_array = np.array(features).reshape(1, -1)
    prediction = int(model.predict(features_array)[0])

    return Response({"prediction": prediction})



