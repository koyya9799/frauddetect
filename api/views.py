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
