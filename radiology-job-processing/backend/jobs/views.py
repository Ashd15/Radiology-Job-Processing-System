from rest_framework import status as http_status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Job,Report
from .serializers import JobSerializer, JobCreateSerializer, ReportCreateSerializer
from .tasks import process_job

# Celery priority: higher number = processed sooner (Redis broker transport
# supports priority 0-9 via CELERY_TASK_QUEUE_MAX_PRIORITY).
PRIORITY_MAP = {"urgent": 0, "standard": 5}



def _create_job(request):
    is_bulk = isinstance(request.data, list)

    serializer = JobCreateSerializer(
        data=request.data,
        many=is_bulk
    )

    if not serializer.is_valid():
        if is_bulk:
            return Response(serializer.errors, status=http_status.HTTP_400_BAD_REQUEST)

        first_field = next(iter(serializer.errors))
        first_error = serializer.errors[first_field][0]
        return Response(
            {"error": str(first_error)},
            status=http_status.HTTP_400_BAD_REQUEST,
        )

    if is_bulk:
        jobs = serializer.save()

        response = []

        for job in jobs:
            celery_priority = PRIORITY_MAP.get(job.priority, 5)

            process_job.apply_async(
                args=[job.id],
                priority=celery_priority
            )

            response.append({
                "job_id": job.id,
                "status": job.status,
                "priority": job.priority,
            })

        return Response(
            {
                "message": f"{len(jobs)} jobs created successfully.",
                "jobs": response,
            },
            status=http_status.HTTP_201_CREATED,
        )

    # Single job
    job = serializer.save(status="queued")

    celery_priority = PRIORITY_MAP.get(job.priority, 5)

    process_job.apply_async(
        args=[job.id],
        priority=celery_priority
    )

    return Response(
        {
            "job_id": job.id,
            "status": job.status,
            "priority": job.priority,
        },
        status=http_status.HTTP_201_CREATED,
    )


def _list_jobs(request):
    jobs = Job.objects.all()
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)


@api_view(["GET", "POST"])
def jobs_collection(request):
    if request.method == "GET":
        return _list_jobs(request)
    return _create_job(request)


@api_view(["GET"])
def job_status(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"error": "Job not found."}, status=http_status.HTTP_404_NOT_FOUND)

    return Response({"job_id": job.id, "status": job.status})




@api_view(["POST"])
def report_collection(request):
    serializer = ReportCreateSerializer(data=request.data)
    if not serializer.is_valid():
        first_field = next(iter(serializer.errors))
        first_error = serializer.errors[first_field][0]
        return Response({"error": str(first_error)}, status=http_status.HTTP_400_BAD_REQUEST)
    report = serializer.save()
    return Response(
        {"report_id": report.id, "content": report.content},
        status=http_status.HTTP_201_CREATED,
    )


