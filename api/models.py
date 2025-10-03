from django.db import models

class Transaction(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    feature_count = models.IntegerField()
    prediction = models.IntegerField()  # 0 = Legit, 1 = Fraud

    def __str__(self):
        return f"Transaction at {self.created_at} - {'Fraud' if self.prediction else 'Legit'}"
