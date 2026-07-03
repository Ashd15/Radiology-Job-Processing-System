# Radiology Job Processing System

A scalable background job processing system for a Radiology SaaS platform. Every uploaded radiology study (CT Scan, MRI, Chest X-Ray) is treated as a **Job**: it's queued, picked up by a background worker, processed with priority awareness, retried once on failure, and tracked live on a React dashboard.

This project is about **asynchronous processing architecture**, not AI/image analysis.

## Tech Stack

| Layer      | Technology                  |
|------------|------------------------------|
| Backend    | Django + Django REST Framework |
| Queue      | Redis                        |
| Worker     | Celery                       |
| Database   | SQLite                       |
| Frontend   | React                        |
| Deployment | Docker / Docker Compose      |

## Architecture

```
React Frontend → POST /jobs → Django REST API → Save Job (status=queued) in SQLite
                                                       │
                                                       ▼
                                              Push Job to Redis
                                                       │
                                                       ▼
                                               Celery Worker
                                                       │
                                          status=processing
                                                       │
                                      Simulate Processing (Reading,
                                      Validating, Generating Report)
                                                 │           │
                                            Success      Failure
                                                 │           │
                                            Completed   Retry Once
                                                              │
                                                      Success / Failure
```

## Folder Structure

```
radiology-job-processing/
  backend/
    config/        # settings, urls, celery app
    jobs/          # models, serializers, views, tasks, services, admin
  frontend/
    src/
      components/  # CreateJobForm, JobsDashboard
      pages/        # HomePage
      api/          # axios client
  docker-compose.yml
  Dockerfile
  requirements.txt
```

## API

### `POST /api/jobs`
Creates a job.

Request:
```json
{
  "type": "CT Scan",
  "priority": "urgent",
  "payload": { "patient": "Rahul", "study_id": "CT001" }
}
```

Validation errors (`type`, `priority`, or `payload` missing) return `400`:
```json
{ "error": "Priority is required." }
```

Success (`201`):
```json
{ "job_id": 101, "status": "queued" }
```

### `GET /api/jobs`
Returns all jobs (used by the dashboard).

### `GET /api/jobs/:id/status`
```json
{ "job_id": 101, "status": "processing" }
```

## Job Lifecycle

```
Queued → Processing → Completed
Queued → Processing → Failed (after one retry)
```

## Priority Queue

Jobs are dispatched to Celery with a priority value (`urgent` = 0, `standard` = 5), backed by Redis's broker priority support, so urgent jobs are picked up ahead of standard ones.

## Retry Logic

Set `payload.simulate_failure = true` when creating a job to force a failure. The worker retries once; if the retry also fails, the job is marked `failed` with an `error_message`.

## Running Locally (Docker)

```bash
docker-compose up
```

This starts, in order: Redis → Django API (with migrations applied automatically) → Celery worker → React dashboard.

- API: http://localhost:8000/api
- Dashboard: http://localhost:3000

For the clearest interview demo, the worker runs with `--concurrency=1` so jobs process one at a time and priority ordering is visible.

## Running Locally (Without Docker)

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver

# In another terminal: Redis must be running locally
redis-server

# In another terminal: Celery worker
cd backend
celery -A config worker --loglevel=info --concurrency=1

# Frontend
cd frontend
npm install
npm start
```

## Why the 2-Second Delay?

Without an artificial delay, a job transitions from `queued` to `processing` almost instantly, making the `Queued` state effectively invisible in a demo. A short `time.sleep(2)` before processing begins makes that state observable. This delay exists only for demonstration and should be removed in production.

## How This Scales

| Current               | Production                          |
|------------------------|--------------------------------------|
| 1 Celery worker         | Multiple Celery workers (parallel)  |
| SQLite                  | PostgreSQL                          |
| Single VPS               | AWS ECS + RDS + ElastiCache + ALB + Auto Scaling |

## Future Improvements

- Replace polling with WebSockets for real-time updates.
- Add authentication and role-based access.
- Add unit and integration tests.
- Add GitHub Actions CI/CD.
- Migrate SQLite → PostgreSQL.
- Deploy to AWS (ECS, RDS, ElastiCache).
- Add monitoring with Prometheus and Grafana.



## Future Enhancements
Prototype Demo (What I'm doing now)

For the prototype, I'm demonstrating the complete asynchronous processing workflow rather than a real AI model.

The background task performs these steps:

Anyone uploads an MRI study.
Celery picks the job from the queue.
The worker simulates reading and validating the study.
Instead of analyzing MRI images, it performs a simulated AI triage analysis.
It generates a deterministic SHA-256 hash from the study metadata (Job ID, Study ID, and Patient Name).
The hash is used to generate:
A triage score (0–99)
Simulated findings like intracranial hemorrhage, stroke, mass effect, or hydrocephalus
Based on those simulated results, it assigns either Routine or Urgent Review.
Finally, the job is marked as Completed.

Purpose: To demonstrate the complete background processing pipeline using Django, Celery, and Redis without requiring a real AI model.

Future Production Implementation

In production, I would replace only the simulated analysis with a real AI inference pipeline."

The background task would then:

Receive the study ID.
Download the MRI DICOM images from PACS or cloud storage.
Read and preprocess all DICOM slices using libraries like pydicom and MONAI.
Pass the MRI volume to a pre-trained deep learning model (for example, a PyTorch-based 3D CNN or Swin Transformer).
The model would predict the probability of abnormalities such as:
Intracranial hemorrhage
Acute stroke
Hydrocephalus
Brain tumor
Based on the model's predictions, the system would assign a priority (Routine or Urgent Review).
Store the AI results in the database and notify the radiologist.
