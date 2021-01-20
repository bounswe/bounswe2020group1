#!/bin/bash

echo "Setting activity stream template"
BASE_TEMPLATE="/usr/local/lib/python3.9/site-packages/actstream/templates/actstream/base.html"
ACTOR_TEMPLATE="/usr/local/lib/python3.9/site-packages/actstream/templates/actstream/actor.html"
cat $ACTOR_TEMPLATE > $BASE_TEMPLATE
sed -i '1d' $BASE_TEMPLATE

#echo "Apply initial migrations"
#python manage.py migrate

echo "Start the server"
python manage.py runserver 0.0.0.0:8000
