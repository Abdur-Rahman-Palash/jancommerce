import os
from django.core.wsgi import get_wsgi_application

# Force production settings for Render
if 'RENDER' in os.environ or 'DYNO' in os.environ:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', os.getenv('DJANGO_SETTINGS_MODULE', 'config.settings.base'))

# Override ALLOWED_HOSTS from environment if set
if os.getenv('ALLOWED_HOSTS'):
    import django
    from django.conf import settings
    django.setup()
    settings.ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS').split(',')

try:
    application = get_wsgi_application()
    print("✅ WSGI application loaded successfully")
    print(f"🔧 Using settings: {os.environ.get('DJANGO_SETTINGS_MODULE', 'config.settings.base')}")
    print(f"🌐 ALLOWED_HOSTS: {os.getenv('ALLOWED_HOSTS', 'Not set')}")
    print(f"🚀 Environment: {'Production' if 'RENDER' in os.environ else 'Development'}")
except Exception as e:
    print(f"❌ WSGI Error: {e}")
    print(f"🔧 Settings Module: {os.environ.get('DJANGO_SETTINGS_MODULE', 'config.settings.base')}")
    print(f"🌐 ALLOWED_HOSTS: {os.getenv('ALLOWED_HOSTS', 'Not set')}")
    # Create a minimal fallback application
    def application(environ, start_response):
        status = '200 OK'
        headers = [('Content-type', 'text/html; charset=utf-8')]
        start_response(status, headers)
        return [b"<h1>JanCommerce Development Server</h1><p>Your Django app is running!</p>"]
