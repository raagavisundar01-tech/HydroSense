"""
HydroSense Machine Learning Training Pipeline
Trains:
1. IsolationForest model for water leak anomaly detection
2. RandomForestRegressor model for water demand prediction
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest, RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)

def generate_synthetic_leak_data(n_samples=2500):
    """
    Generates realistic sensor flow and consumption readings.
    Features: [consumption, normal_average, flow_rate, hour, ratio]
    """
    np.random.seed(42)
    # Normal hourly consumption (L/hr) varies by hour of day
    hours = np.random.randint(0, 24, n_samples)
    base_avg = 140.0 + 60.0 * np.sin((hours - 6) * np.pi / 12) + np.random.normal(0, 15, n_samples)
    base_avg = np.clip(base_avg, 60.0, 350.0)

    # 92% normal usage, 8% anomalous / leak usage
    is_anomaly = np.random.rand(n_samples) < 0.08

    consumption = np.zeros(n_samples)
    flow_rate = np.zeros(n_samples)

    for i in range(n_samples):
        if is_anomaly[i]:
            # Burst or steady leak
            multiplier = np.random.uniform(2.2, 4.5)
            consumption[i] = base_avg[i] * multiplier + np.random.normal(50, 20)
            flow_rate[i] = (consumption[i] / 10.0) + np.random.normal(0, 3)
        else:
            consumption[i] = base_avg[i] * np.random.uniform(0.85, 1.15) + np.random.normal(0, 8)
            flow_rate[i] = (consumption[i] / 12.0) + np.random.normal(0, 1.5)

    consumption = np.clip(consumption, 20.0, 1200.0)
    flow_rate = np.clip(flow_rate, 2.0, 120.0)
    ratio = consumption / np.maximum(base_avg, 1.0)

    df = pd.DataFrame({
        "consumption": consumption,
        "normal_average": base_avg,
        "flow_rate": flow_rate,
        "hour": hours,
        "ratio": ratio
    })
    return df

def train_leak_model():
    print("Training Leak Anomaly Detection Model (Isolation Forest)...")
    df = generate_synthetic_leak_data()
    X = df[["consumption", "normal_average", "flow_rate", "hour", "ratio"]]

    model = IsolationForest(
        n_estimators=150,
        contamination=0.08,
        random_state=42,
        max_samples="auto"
    )
    model.fit(X)

    model_path = os.path.join(MODELS_DIR, "leak_model.joblib")
    joblib.dump(model, model_path)
    print(f"Leak model successfully saved to {model_path}")
    return model

def generate_synthetic_demand_data(n_days=1000):
    """
    Generates historical daily consumption data for a campus / community.
    Features: [previous_consumption, day_of_week, month, occupancy, temperature]
    Target: daily_demand (Litres)
    """
    np.random.seed(42)
    day_of_week = np.random.randint(0, 7, n_days)
    month = np.random.randint(1, 13, n_days)
    occupancy = np.random.randint(450, 1200, n_days)
    temperature = 22.0 + 8.0 * np.sin((month - 4) * np.pi / 6) + np.random.normal(0, 4, n_days)

    # Base daily demand per occupant is approx 18-24 L/day for non-potable + amenities
    per_capita = 18.0 + 0.25 * np.maximum(temperature - 20, 0)
    # Weekday vs weekend pattern
    weekend_factor = np.where((day_of_week == 5) | (day_of_week == 6), 1.12, 0.96)

    daily_demand = occupancy * per_capita * weekend_factor + np.random.normal(0, 500, n_days)
    daily_demand = np.clip(daily_demand, 8000.0, 45000.0)

    # Previous consumption has high correlation with current demand
    previous_consumption = daily_demand * np.random.uniform(0.92, 1.08)

    df = pd.DataFrame({
        "previous_consumption": previous_consumption,
        "day_of_week": day_of_week,
        "month": month,
        "occupancy": occupancy,
        "temperature": temperature,
        "daily_demand": daily_demand
    })
    return df

def train_demand_model():
    print("Training Water Demand Forecasting Model (Random Forest)...")
    df = generate_synthetic_demand_data()
    X = df[["previous_consumption", "day_of_week", "month", "occupancy", "temperature"]]
    y = df["daily_demand"]

    regressor = RandomForestRegressor(
        n_estimators=120,
        max_depth=12,
        random_state=42
    )
    regressor.fit(X, y)

    model_path = os.path.join(MODELS_DIR, "demand_model.joblib")
    joblib.dump(regressor, model_path)
    print(f"Demand model successfully saved to {model_path}")
    return regressor

if __name__ == "__main__":
    train_leak_model()
    train_demand_model()
    print("All ML models trained and saved successfully.")
