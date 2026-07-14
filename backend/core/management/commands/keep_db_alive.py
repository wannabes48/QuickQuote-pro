"""
Management command to keep the Supabase database alive.

Performs a lightweight write operation (upsert a single heartbeat row)
to prevent Supabase from pausing the project due to inactivity.

Usage:
    python manage.py keep_db_alive

Designed to be called from:
  - A cron job (Render Cron Job, GitHub Actions, cron-job.org, etc.)
  - The /api/health/keep-alive/ endpoint
"""
import logging
from django.core.management.base import BaseCommand
from django.db import connection
from django.utils import timezone

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Pings the database with a lightweight write to prevent Supabase from pausing due to inactivity.'

    def handle(self, *args, **options):
        try:
            # Method 1: Use the DatabaseHeartbeat model (preferred)
            from core.models import DatabaseHeartbeat

            heartbeat, created = DatabaseHeartbeat.objects.update_or_create(
                id=1,
                defaults={'status': 'alive'}
            )
            action = 'Created' if created else 'Updated'
            self.stdout.write(
                self.style.SUCCESS(
                    f'[{timezone.now().isoformat()}] {action} heartbeat — DB is alive.'
                )
            )

        except Exception as model_err:
            # Method 2: Fallback — raw SQL ping if the model table doesn't exist yet
            logger.warning(f'Heartbeat model failed ({model_err}), falling back to raw SQL ping.')
            try:
                with connection.cursor() as cursor:
                    cursor.execute('SELECT 1;')
                    result = cursor.fetchone()
                    if result and result[0] == 1:
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'[{timezone.now().isoformat()}] Raw SQL ping successful — DB is alive.'
                            )
                        )
            except Exception as raw_err:
                self.stderr.write(
                    self.style.ERROR(
                        f'[{timezone.now().isoformat()}] Database ping FAILED: {raw_err}'
                    )
                )
                raise
