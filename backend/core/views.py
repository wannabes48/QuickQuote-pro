import os
import logging
from django.http import HttpResponse
from django.db import connection

logger = logging.getLogger(__name__)

# Simple token-based auth to prevent abuse (optional — set KEEP_ALIVE_TOKEN in .env)
KEEP_ALIVE_TOKEN = os.environ.get('KEEP_ALIVE_TOKEN', '')


def keep_alive(request):
    """
    Lightweight endpoint that pings the database to keep Supabase active.
    Returns a minimal plain-text response to stay within cron-job.org limits.

    GET /api/health/keep-alive/
    """
    # Optional token check — only enforced if KEEP_ALIVE_TOKEN is set
    if KEEP_ALIVE_TOKEN:
        auth_header = request.headers.get('Authorization', '')
        if auth_header != f'Bearer {KEEP_ALIVE_TOKEN}':
            return HttpResponse('unauthorized', status=401, content_type='text/plain')

    try:
        # Direct lightweight DB ping — no management command overhead
        with connection.cursor() as cursor:
            cursor.execute(
                "CREATE TABLE IF NOT EXISTS core_heartbeat (id integer PRIMARY KEY, ts timestamp);"
            )
            cursor.execute(
                "INSERT INTO core_heartbeat (id, ts) VALUES (1, NOW()) "
                "ON CONFLICT (id) DO UPDATE SET ts = NOW();"
            )
        return HttpResponse('ok', content_type='text/plain')
    except Exception as e:
        logger.error(f'Keep-alive ping failed: {e}')
        return HttpResponse('error', status=500, content_type='text/plain')

