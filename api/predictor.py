import joblib

model = joblib.load("../models/fraud_model.pkl")

def predict(input_data):
    prediction = model.predict([input_data])
    return int(prediction[0])  # 0 = legit, 1 = fraud
