import os
import logging
from django.http import JsonResponse
from django.utils import timezone
from django.core.management import call_command

logger = logging.getLogger(__name__)

# Simple token-based auth to prevent abuse (optional — set KEEP_ALIVE_TOKEN in .env)
KEEP_ALIVE_TOKEN = os.environ.get('KEEP_ALIVE_TOKEN', '')


def keep_alive(request):
    """
    Lightweight endpoint that pings the database to keep Supabase active.

    Can be called by external cron services like:
      - cron-job.org (free, up to every 1 minute)
      - UptimeRobot (free, every 5 minutes)
      - GitHub Actions scheduled workflow
      - Render Cron Job

    GET /api/health/keep-alive/
    Optional header: Authorization: Bearer <KEEP_ALIVE_TOKEN>
    """
    # Optional token check — only enforced if KEEP_ALIVE_TOKEN is set
    if KEEP_ALIVE_TOKEN:
        auth_header = request.headers.get('Authorization', '')
        expected = f'Bearer {KEEP_ALIVE_TOKEN}'
        if auth_header != expected:
            return JsonResponse(
                {'status': 'error', 'message': 'Unauthorized'},
                status=401,
            )

    try:
        call_command('keep_db_alive')
        return JsonResponse({
            'status': 'ok',
            'message': 'Database is alive',
            'timestamp': timezone.now().isoformat(),
        })
    except Exception as e:
        logger.error(f'Keep-alive ping failed: {e}')
        return JsonResponse(
            {'status': 'error', 'message': str(e)},
            status=500,
        )
