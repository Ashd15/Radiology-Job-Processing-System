from django.urls import path
from . import views

urlpatterns = [
    path("jobs", views.jobs_collection, name="jobs-collection"),
    path("jobs/<int:job_id>/status", views.job_status, name="job-status"),
    path("reports", views.report_collection, name="report-collection"),
]
