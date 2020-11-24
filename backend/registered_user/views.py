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

from .models import RegisteredUser, Vendor, Customer, Location


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.POST.get('email')
    password = request.POST.get('password')

    if (not username) or (not password):
        return Response({'error': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)

    if not user:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({'auth_token': token.key}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def signup(request):
    username = request.POSTget('username')
    password = request.get('password')
    email = request.get('email')
    first_name = request.get('first_name')
    last_name = request.get('last_name')
    is_vendor = request.get('is_vendor')
    iban = request.get('IBAN')
    latitude = 41.0082 #dummy for now
    longitude = 28.9784 #dummy for now

    try:
        user = User.objects.get(username=username)
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        try:
            user = RegisteredUser.objects.get(email=email)
            return Response({'error': 'Email address already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        except RegisteredUser.DoesNotExist:
            user = User.objects.create_user(username=username, email=email, first_name=first_name, last_name=last_name,
                                            password=password)
            registered_user = user.registereduser
            registered_user.email = email
            registered_user.save()
            if is_vendor=='True':
                location = Location(latitude=latitude, longitude=longitude)
                location.save()
                vendor = Vendor(user=registered_user, iban=iban, rating=0, location=location)
                vendor.save()
            elif is_vendor=='False':
                customer = Customer(user=registered_user, money_spent=0)
                customer.save()

            token, _ = Token.objects.get_or_create(user=user)
            return Response({'auth_token': token.key}, status=status.HTTP_200_OK)