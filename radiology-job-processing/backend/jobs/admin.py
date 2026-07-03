from django.contrib import admin
from .models import Job,Report



@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("id", "type", "priority", "status", "attempts", "created_at")
    list_filter = ("status", "priority", "type")
    
    
admin.site.register(Report)
