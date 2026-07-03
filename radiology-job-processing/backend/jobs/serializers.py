from rest_framework import serializers
from .models import Job,Report


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            "id",
            "type",
            "priority",
            "payload",
            "status",
            "attempts",
            "error_message",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "status", "attempts", "error_message", "created_at", "updated_at"]


class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ["type", "priority", "payload"]

    def validate_type(self, value):
        if not value:
            raise serializers.ValidationError("Type is required.")
        return value

    def validate_priority(self, value):
        if not value:
            raise serializers.ValidationError("Priority is required.")
        if value not in ("urgent", "standard"):
            raise serializers.ValidationError("Priority must be 'urgent' or 'standard'.")
        return value

    def validate_payload(self, value):
        if value is None:
            raise serializers.ValidationError("Payload is required.")
        return value




class ReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["content"]