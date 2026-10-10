# HydroSense - Database Architecture & Data Models

This directory contains the database initialization scripts, schemas, sample datasets, seed data, and migration utilities for **HydroSense – AI-Powered Smart Water Management Platform**.

## Data Collections & Models

1. **users**: Residents, Maintenance Staff, Administrators with hashed credentials, roles, assigned zones/buildings.
2. **complaints**: Resident water issue reports with automated priority, categories, status tracking, coordinates, and assignment.
3. **waterConsumption**: Time-series hourly and daily meter readings across zones, buildings, and residential meters.
4. **leakAlerts**: AI-detected water anomalies with leak probabilities, severity levels, normal baseline comparison, and inspection logs.
5. **demandPredictions**: ML forecasted future consumption across 24h, 7-day, and 30-day windows with shortage risk calculations.
6. **waterAvailability**: Storage capacities, tank levels, available percentages, and estimated days of remaining water.
7. **maintenanceTasks**: Task dispatching for staff, status progression, work notes, and resolution proofs.
8. **notifications**: In-app alerts, broadcast notices, and water mascot notifications.
9. **buildings & zones**: Campus infrastructure details, water meters, and geo-locations for map visualization.

## Files
- `schemas.js`: Mongoose model schemas for the collections.
- `seedData.js`: Comprehensive, realistic demo dataset representing 3 buildings, 4 zones, multiple residents, maintenance staff, past consumption, leak alerts, and complaints.
- `initDb.js`: Script to initialize or reset MongoDB collections.
