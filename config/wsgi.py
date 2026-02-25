import os
from django.core.wsgi import get_wsgi_application

# Use development settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

try:
    application = get_wsgi_application()
    print("✅ WSGI application loaded successfully")
except Exception as e:
    print(f"❌ WSGI Error: {e}")
    # Create a minimal fallback application
    def application(environ, start_response):
        status = '200 OK'
        headers = [('Content-type', 'text/html; charset=utf-8')]
        start_response(status, headers)
        return [b"<h1>JanCommerce Development Server</h1><p>Your Django app is running!</p>"]
