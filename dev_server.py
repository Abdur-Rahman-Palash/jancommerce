#!/usr/bin/env python
import os
import sys
import django
from django.http import HttpResponse
from django.core.wsgi import get_wsgi_application
from django.core.management import execute_from_command_line

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

# Create a simple development server
from django.conf import settings
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok", "message": "JanCommerce is running!"})

def home_view(request):
    return HttpResponse("""
    <html>
        <head><title>JanCommerce - Development Server</title></head>
        <body style="font-family: Arial, sans-serif; padding: 50px;">
            <h1>🚀 JanCommerce Development Server</h1>
            <p>Your Django project is running successfully!</p>
            <p><a href="/admin/">Admin Panel</a></p>
            <p><a href="/products/">Products</a></p>
        </body>
    </html>
    """)

# Simple URL patterns for testing
urlpatterns = [
    path('', home_view),
    path('health/', health_check),
    path('admin/', include('django.contrib.admin.urls')),
    path('', include('store.urls')),
]

if __name__ == '__main__':
    import socketserver
    from http.server import SimpleHTTPRequestHandler
    from wsgiref.simple_server import make_server
    
    print("🚀 Starting JanCommerce Development Server...")
    print("📍 Server running at: http://127.0.0.1:8000")
    print("🎯 Admin Panel: http://127.0.0.1:8000/admin/")
    print("🛍️  Products: http://127.0.0.1:8000/products/")
    print("⏹️  Press Ctrl+C to stop the server")
    
    try:
        httpd = make_server('127.0.0.1', 8000, get_wsgi_application())
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped successfully")
