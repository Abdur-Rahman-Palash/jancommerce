@echo off
cd /d "C:\Users\USER\Desktop\jancommerce"
call venv\Scripts\activate
set DJANGO_SETTINGS_MODULE=config.settings.dev
python manage.py runserver
pause
