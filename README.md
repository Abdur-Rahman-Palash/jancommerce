# JanCommerce

A modern Django 5 SaaS ecommerce scaffold using clean architecture.

## Features

- Django 5 project structure with clean architecture
- Single `store` app with componentized templates and static assets
- Tailwind CSS powered UI with premium typography and animations
- Dummy product list defined in view (no database) for quick prototyping
- Modular components (header, footer, cards, filters, etc.)
- Production-ready settings layout (base/dev/prod) and static file organization
- SEO-friendly meta tags, preload, and minimal JS bundle

## Setup

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Folder Structure

```
jancommerce/
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── dev.py
│   │   └── prod.py
│   ├── asgi.py
│   ├── urls.py
│   └── wsgi.py
├── store/
│   ├── data/
│   │   └── products.json
│   ├── services/
│   ├── templates/store/
│   ├── urls.py
│   ├── views.py
│   └── ...
├── templates/
│   └── base.html
├── manage.py
└── requirements.txt
```
