#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

try:
    django.setup()
    print("✅ Django setup successful!")
    
    # Try to import the store app
    from store import views
    print("✅ Store app imported successfully!")
    
    # Try to import URL patterns
    from store.urls import urlpatterns
    print("✅ URL patterns loaded successfully!")
    
    print("\n🚀 JanCommerce is ready to run!")
    print("📋 To start the server, run:")
    print("   python manage.py runserver")
    print("🌐 Then visit: http://127.0.0.1:8000")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n🔧 Trying alternative approach...")
    
    # Try to run Django's built-in server directly
    from django.core.management import execute_from_command_line
    execute_from_command_line(['manage.py', 'runserver', '--settings=config.settings.dev'])
