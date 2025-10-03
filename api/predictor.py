import joblib
import numpy as np
import os

# Load the model from the correct path
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'fraud_model.pkl')
MODEL_PATH = os.path.abspath(MODEL_PATH)  # make sure it's absolute

model = joblib.load(MODEL_PATH)

def predict(features):
    """
    Takes a list of 30 numeric features and returns 0 (Legit) or 1 (Fraud)
    """
    X = np.array(features).reshape(1, -1)
    prediction = model.predict(X)[0]
    return int(prediction)
