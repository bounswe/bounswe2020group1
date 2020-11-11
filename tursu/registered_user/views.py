from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User

from .models import RegisteredUser


# Test view
def index(request):
    return HttpResponse("Hello, world. You're at the users index.")