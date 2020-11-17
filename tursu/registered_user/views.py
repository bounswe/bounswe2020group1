from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status

from .models import RegisteredUser


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.POST['username']
    password = request.POST['password']

    if (not username) or (not password):
        return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)

    if not user:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def signup(request):
    username = request.POST['username']
    password = request.POST['password']
    email = request.POST['email']
    first_name = request.POST['first_name']
    last_name = request.POST['last_name']
    is_vendor = request.POST['is_vendor']

    try:
        user = User.objects.get(username=username)
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        try:
            user = RegisteredUser.objects.get(email=email)
            return Response({'error': 'Email address already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        except RegisteredUser.DoesNotExist:
            user = User.objects.create_user(username=username, first_name=first_name, last_name=last_name,
                                            password=password)
            registered_user = user.registereduser
            registered_user.email = email
            registered_user.is_vendor = is_vendor
            registered_user.save()

            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
