#!/usr/bin/env bash

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

gunicorn sdkvism.wsgi:application --bind 0.0.0.0:10000
