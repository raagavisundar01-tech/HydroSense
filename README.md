# HydroSense – AI-Powered Smart Water Management Platform

> **Tagline:** Smarter Water. Better Future.

HydroSense is an intelligent water management platform designed to help residential communities, campuses, and municipal organizations monitor water usage, identify leaks early via Machine Learning, predict future water demand, and efficiently manage water-related complaints.

---

## 🏗️ System Architecture

```text
                                HydroSense Platform
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ↓                                ↓                                ↓
  Frontend (React)                Backend (Node.js)               ML Service (Python)
  • Vite + Tailwind CSS           • Express REST APIs             • Flask Microservice
  • Recharts & Leaflet Maps       • JWT Auth & RBAC               • Isolation Forest (Leaks)
  • Droppy Water Mascot           • Water Telemetry & CRUD        • Random Forest (Demand)
        │                                │                                │
        └────────────────────────────────┴────────────────────────────────┘
                                         │
                                Database (MongoDB)
                                • Real Mongo or Zero-Config
                                  In-Memory Hybrid Store
```

---

## 📁 Project Structure

```text
HydroSense/
├── frontend/                     # React.js + Vite + Tailwind CSS + Leaflet UI
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, WaterMascotNotification (Droppy)
│   │   ├── context/              # AuthContext with 1-Click Role Switcher
│   │   └── pages/                # Dashboards (Resident, Staff, Admin) & feature modules
│   └── package.json
├── backend/                      # Node.js + Express.js API Server
│   ├── src/
│   │   ├── config/               # Database connector (MongoDB + zero-config fallback)
│   │   ├── models/               # Data Access Layer & repositories
│   │   ├── routes/               # Auth, Complaints, Water, AI, Admin, Notifications
│   │   └── services/             # AI service bridging Python ML service
│   └── package.json
├── ml-service/                   # Python Machine Learning Microservice
│   ├── app.py                    # Flask API (/predict/leak, /predict/demand)
│   ├── train_models.py           # Isolation Forest & Random Forest model training
│   ├── models/                   # leak_model.joblib & demand_model.joblib
│   └── requirements.txt
└── database/                     # Schemas and seed data
    ├── schemas.js                # Mongoose model schemas
    ├── seedData.js               # Comprehensive campus dataset
    └── README.md
```

---

## 🚀 Quick Start Guide

### 1. Python ML Service (Port 8000)
```bash
cd ml-service
python train_models.py    # Trains Isolation Forest & Random Forest models
python app.py             # Starts Flask ML service on http://127.0.0.1:8000
```

### 2. Backend API Server (Port 5000)
```bash
cd backend
npm install
npm start                 # Starts Express API on http://localhost:5000
```
*Note: If MongoDB is not installed locally, the backend automatically activates its embedded In-Memory Data Store seeded with realistic campus water data.*

### 3. Frontend Web Application (Port 3000)
```bash
cd frontend
npm install
npm run dev               # Starts Vite React dev server on http://localhost:3000
```

---

## 👥 Demo User Credentials

HydroSense includes 1-click login buttons on the login page for rapid evaluation:

| Role | Name | Email | Password |
|---|---|---|---|
| **Administrator** | Dr. Neha Verma | `admin@hydrosense.io` | `admin123` |
| **Maintenance Staff** | Rajesh Kumar | `staff@hydrosense.io` | `staff123` |
| **Resident** | Aditya Sharma | `resident@hydrosense.io` | `resident123` |

---

## 💧 Key Modules

1. **AI Leak Detection:** Isolation Forest anomaly model analyzes sensor flow rate and baseline consumption (e.g. 480 L/hr vs 145 L/hr normal = 91% leak probability).
2. **AI Water Demand Prediction:** Random Forest model projects 24-hour and 7-day water requirements based on occupancy, season, and temperature.
3. **Animated Droppy Water Mascot:** Cute animated cartoon water droplet mascot pops up with alerts, sound chimes, and conservation tips.
4. **Smart Complaint Lifecycle:** Automated priority assignment (Critical, High, Medium, Low), staff dispatching, and resolution verification.
5. **Geospatial Campus Map:** Leaflet + OpenStreetMap interactive pins displaying campus buildings, zone statuses, and pipe incidents.
6. **Reports & CSV Audits:** Instant CSV downloads for water consumption audits and maintenance turnaround logs.
