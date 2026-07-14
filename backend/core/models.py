from django.db import models


class DatabaseHeartbeat(models.Model):
    """
    Lightweight model used to periodically ping the database,
    preventing Supabase from pausing due to inactivity.
    """
    pinged_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, default='alive')

    class Meta:
        db_table = 'core_database_heartbeat'
        verbose_name = 'Database Heartbeat'
        verbose_name_plural = 'Database Heartbeats'

    def __str__(self):
        return f"Heartbeat @ {self.pinged_at} — {self.status}"
