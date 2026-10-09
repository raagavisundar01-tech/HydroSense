import os
import joblib
import numpy as np
from datetime import datetime
from flask import Flask, request, jsonify

app = Flask(__name__)

# Basic CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
LEAK_MODEL_PATH = os.path.join(MODELS_DIR, "leak_model.joblib")
DEMAND_MODEL_PATH = os.path.join(MODELS_DIR, "demand_model.joblib")

leak_model = None
demand_model = None

def load_models():
    global leak_model, demand_model
    try:
        if os.path.exists(LEAK_MODEL_PATH):
            leak_model = joblib.load(LEAK_MODEL_PATH)
            print("Loaded leak detection IsolationForest model.")
    except Exception as e:
        print(f"Error loading leak model: {e}")

    try:
        if os.path.exists(DEMAND_MODEL_PATH):
            demand_model = joblib.load(DEMAND_MODEL_PATH)
            print("Loaded water demand RandomForest model.")
    except Exception as e:
        print(f"Error loading demand model: {e}")

load_models()

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "service": "HydroSense AI/ML Microservice (Flask + Scikit-Learn)",
        "leak_model_loaded": leak_model is not None,
        "demand_model_loaded": demand_model is not None,
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route("/predict/leak", methods=["POST"])
def predict_leak():
    req = request.get_json(force=True) or {}
    consumption = float(req.get("consumption", 480))
    normal_average = float(req.get("normal_average", 145))
    flow_rate = float(req.get("flow_rate", consumption / 10.0))
    hour = int(req.get("hour", datetime.now().hour))
    building = req.get("building", "Block C")
    zone = req.get("zone", "East Zone")

    ratio = consumption / max(normal_average, 1.0)
    features = np.array([[consumption, normal_average, flow_rate, hour, ratio]])

    if leak_model is not None:
        try:
            pred = leak_model.predict(features)[0]
            score = float(leak_model.decision_function(features)[0])
            is_anomaly = bool(pred == -1 or ratio > 1.6)
            leak_prob = float(np.clip(0.5 - (score * 2.2), 0.05, 0.99))
            if ratio > 2.0:
                leak_prob = max(leak_prob, min(0.85 + (ratio - 2.0) * 0.05, 0.98))
        except Exception:
            is_anomaly = ratio > 1.5
            leak_prob = min(max((ratio - 1.0) / 1.5, 0.1), 0.95)
            score = -0.15 if is_anomaly else 0.15
    else:
        is_anomaly = ratio > 1.5
        leak_prob = min(max((ratio - 1.0) / 1.5, 0.1), 0.95)
        score = -0.15 if is_anomaly else 0.15

    if not is_anomaly and ratio < 1.3:
        severity = "NORMAL"
        recommended_action = "Consumption within normal operational variance. Routine monitoring active."
    elif ratio < 1.8 and leak_prob < 0.65:
        severity = "MEDIUM"
        recommended_action = f"Check for elevated fixture usage or minor valve leakage in {building}."
    elif ratio < 2.5 and leak_prob < 0.85:
        severity = "HIGH"
        recommended_action = f"Possible leakage detected in {building} – {zone}. Maintenance inspection recommended immediately."
    else:
        severity = "CRITICAL"
        recommended_action = f"Major pipeline leakage or overflow detected in {building}. Shut off zone valve and dispatch emergency crew!"

    return jsonify({
        "anomaly": is_anomaly,
        "anomaly_score": round(score, 4),
        "leak_probability": round(leak_prob, 2),
        "severity": severity,
        "ratio": round(ratio, 2),
        "current_usage": round(consumption, 1),
        "normal_usage": round(normal_average, 1),
        "recommended_action": recommended_action,
        "building": building,
        "zone": zone,
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route("/predict/demand", methods=["POST"])
def predict_demand():
    req = request.get_json(force=True) or {}
    now = datetime.now()
    prev_consumption = float(req.get("previous_consumption", 17500))
    day_of_week = int(req.get("day_of_week", now.weekday()))
    month = int(req.get("month", now.month))
    occupancy = int(req.get("occupancy", 820))
    temp = float(req.get("temperature", 31.0))
    current_storage = float(req.get("current_storage", 14200.0))
    storage_capacity = float(req.get("storage_capacity", 25000.0))

    features = np.array([[prev_consumption, day_of_week, month, occupancy, temp]])

    if demand_model is not None:
        try:
            pred_demand = float(demand_model.predict(features)[0])
        except Exception:
            pred_demand = float(occupancy * 21.5 * (1.1 if day_of_week in [5,6] else 0.98))
    else:
        pred_demand = float(occupancy * 21.5 * (1.1 if day_of_week in [5,6] else 0.98))

    expected_shortage = max(0.0, pred_demand - current_storage)
    remaining_ratio = current_storage / max(pred_demand, 1.0)
    days_remaining = round(remaining_ratio, 1)

    if expected_shortage > 3000 or remaining_ratio < 0.8:
        risk_level = "HIGH"
        rec = f"Increase water storage by approximately {int(expected_shortage + 1000):,} L immediately to reduce shortage risk."
    elif expected_shortage > 0 or remaining_ratio < 1.1:
        risk_level = "MODERATE"
        rec = "Storage buffer is tight. Consider scheduling municipal or borehole refill to maintain safety threshold."
    else:
        risk_level = "LOW"
        rec = "Storage capacity is sufficient for predicted 24-48h consumption."

    day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    daily_forecasts = []
    for d in range(7):
        target_day = (day_of_week + d + 1) % 7
        mult = 1.12 if target_day in [5, 6] else 0.97
        daily_val = round(pred_demand * mult + np.random.uniform(-400, 400), 0)
        daily_forecasts.append({
            "day": day_names[target_day],
            "day_index": target_day,
            "predicted_demand": daily_val,
            "storage_buffer": round(storage_capacity - daily_val, 0)
        })

    return jsonify({
        "predicted_demand": round(pred_demand, 0),
        "current_available": round(current_storage, 0),
        "storage_capacity": round(storage_capacity, 0),
        "expected_shortage": round(expected_shortage, 0),
        "risk_level": risk_level,
        "days_remaining": days_remaining,
        "recommendation": rec,
        "daily_forecast": daily_forecasts,
        "timestamp": datetime.utcnow().isoformat()
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
