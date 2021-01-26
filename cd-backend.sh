#!/bin/bash

cd bounswe2020group1/

# STOP CONTAINERS FOR BACKEND 
sudo docker-compose down

# PULL THE LATEST VERSION
git pull

# CHECKOUT TO BACKEND
git checkout backend

# BUILD THE CONTAINERS
sudo docker-compose build

# RUN THE CONTAINERS
sudo docker-compose up -d
