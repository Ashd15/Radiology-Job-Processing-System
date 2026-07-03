


import hashlib
import time

from celery import shared_task

from .models import Job
from . import services

# Demo-only delay so the "Queued" state is visible on the dashboard before
# processing starts. Remove or shorten this in production.
QUEUE_VISIBILITY_DELAY_SECONDS = 2

PROCESSING_STEPS = [
    ("Reading Study", 10),
    ("Validating Study", 10),
]

# Hardcoded finding categories an AI triage pass typically screens for
# on a brain MRI. This mirrors real PACS auto-triage tools (e.g. flagging
# studies with suspected acute findings for priority radiologist review).
TRIAGE_FINDINGS = [
    "Intracranial hemorrhage",
    "Acute infarct (large vessel)",
    "Mass effect / midline shift",
    "Hydrocephalus",
]


def _run_processing_steps():
    for step_name, duration in PROCESSING_STEPS:
        print(f"Processing: {step_name}")
        time.sleep(duration)


def _run_ai_triage_analysis(job):
    """
    Real work for the 'Generating Report' step: a deterministic pseudo
    AI-triage pass over the study. Uses a hash of the study data to derive
    a reproducible triage score and finding flags -- no external ML deps,
    stdlib only, no rebuild needed.

    Mirrors how real radiology AI triage tools (Aidoc, Viz.ai, etc.) flag
    studies with suspected critical findings for priority review, ahead of
    the normal reading queue.
    """
    print("Processing: Generating Report")
    print("Running AI triage analysis...")

    study_id = (job.payload or {}).get("study_id", "N/A")
    patient = (job.payload or {}).get("patient", "Unknown Patient")

    # Deterministic pseudo-score derived from study data (stand-in for a
    # real model inference call). Same input always yields same output.
    seed = f"{job.id}:{study_id}:{patient}".encode()
    digest = hashlib.sha256(seed).hexdigest()
    triage_score = int(digest[:4], 16) % 100  # 0-99

    # Deterministically "flag" 0-2 findings based on the hash, purely as
    # a stand-in for a model's positive/negative screening output.
    flagged = []
    for i, finding in enumerate(TRIAGE_FINDINGS):
        bucket = int(digest[4 + i * 2: 6 + i * 2], 16) % 100
        if bucket < 12:  # ~12% chance per finding, for demo variety
            flagged.append(finding)

    if triage_score >= 80 or flagged:
        priority_flag = "URGENT REVIEW"
    elif triage_score >= 50:
        priority_flag = "Routine — review soon"
    else:
        priority_flag = "Routine"

    print(f"  Study: {study_id} | Patient: {patient}")
    print(f"  Triage score: {triage_score}/100")
    print(f"  Flagged findings: {flagged if flagged else 'None detected'}")
    print(f"  Queue priority recommendation: {priority_flag}")

    return {
        "triage_score": triage_score,
        "flagged_findings": flagged,
        "priority_flag": priority_flag,
    }


@shared_task(bind=True, max_retries=1, default_retry_delay=1)
def process_job(self, job_id):
    """
    Processes a radiology job end to end:

        Queued
           ↓
      Processing
        ↓      ↓
   Completed  Failed

    If payload.simulate_failure = True,
    the task retries once and then marks the job as failed.
    """

    # Fetch Job
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        print(f"Job {job_id} not found.")
        return

    # Show "Queued" state for demo purposes
    time.sleep(QUEUE_VISIBILITY_DELAY_SECONDS)

    # Mark Processing
    services.mark_processing(job_id)
    services.increment_attempts(job_id)

    try:
        simulate_failure = (
            bool(job.payload.get("simulate_failure"))
            if job.payload
            else False
        )

        # Simulated steps
        _run_processing_steps()

        if simulate_failure:
            raise RuntimeError("Simulated processing failure.")

        # Real work replacing the old fake sleep / file write
        triage_result = _run_ai_triage_analysis(job)

        # Success
        services.mark_completed(job_id)
        print(
            f"Job {job_id} completed successfully. "
            f"Triage: {triage_result['priority_flag']} "
            f"(score {triage_result['triage_score']})"
        )

    except Exception as exc:

        print(
            f"Job {job_id} failed. "
            f"Retry {self.request.retries}/{self.max_retries}"
        )

        if self.request.retries < self.max_retries:
            raise self.retry(exc=exc)

        services.mark_failed(job_id, str(exc))
        print(f"Job {job_id} marked as FAILED.")
        return