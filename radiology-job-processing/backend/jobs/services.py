from .models import Job


def mark_processing(job_id):
    Job.objects.filter(id=job_id).update(status="processing")


def mark_completed(job_id):
    Job.objects.filter(id=job_id).update(status="completed", error_message=None)


def mark_failed(job_id, error_message):
    Job.objects.filter(id=job_id).update(status="failed", error_message=error_message)


def increment_attempts(job_id):
    job = Job.objects.get(id=job_id)
    job.attempts += 1
    job.save(update_fields=["attempts"])
    return job.attempts
