#!/bin/bash

echo "Apply initial migrations"
python manage.py migrate

echo "Start the server"
python manage.py runserver 0.0.0.0:8000