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
    user=User.objects.get(username=username)
    first_name = user.first_name
    last_name =  user.last_name
    user_type = 'admin'
    
    registered_user = RegisteredUser.objects.filter(user=User.objects.get(username=username)).first()
    vendor = Vendor.objects.filter(user=registered_user).first()
    customer = Customer.objects.filter(user=registered_user).first()
    if vendor is not None:
        user_type = 'vendor'
    if customer is not None:
        user_type = 'customer'

    return Response({'auth_token': token.key, 'first_name': first_name, 'last_name': last_name, 'user_type': user_type}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def signup(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    email = request.POST.get('email')
    first_name = request.POST.get('first_name')
    last_name = request.POST.get('last_name')
    is_vendor = request.POST.get('is_vendor')
    iban = request.POST.get('IBAN')
    latitude = request.POST.get('latitude')
    longitude = request.POST.get('longitude')
    city = request.POST.get('city')

    # Check if all fields are provided.
    if username and email and password and first_name and last_name:
        # Check if the username already exists.
        try:
            user = User.objects.get(username=username)
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            # Check if the email already exists.
            try:
                user = RegisteredUser.objects.get(email=email)
                return Response({'error': 'Email address already exists.'}, status=status.HTTP_400_BAD_REQUEST)

            # Create the user if the username or the email does not already exist.
            except RegisteredUser.DoesNotExist:
                if is_vendor:
                    # Check if the necessary fields for the vendor are provided.
                    if latitude and longitude and city and iban:
                        user = User.objects.create_user(username=username, email=email, first_name=first_name,
                                                        last_name=last_name, password=password)
                        registered_user = user.registereduser
                        registered_user.email = email
                        registered_user.save()
                        location = Location(latitude=latitude, longitude=longitude, city=city)
                        location.save()
                        vendor = Vendor(user=registered_user, iban=iban, rating=0, location=location)
                        vendor.save()
                    else:
                        return Response({'error': 'Missing fields for the vendor.'}, status=status.HTTP_400_BAD_REQUEST)
                # is_vendor returns false: create customer
                else:
                    user = User.objects.create_user(username=username, email=email, first_name=first_name,
                                                    last_name=last_name, password=password)
                    registered_user = user.registereduser
                    registered_user.email = email
                    registered_user.save()
                    customer = Customer(user=registered_user, money_spent=0)
                    customer.save()

                user = authenticate(request, username=username, password=password)
                token, _ = Token.objects.get_or_create(user=user)
                return Response({'auth_token': token.key}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'All fields should be filled.'}, status=status.HTTP_400_BAD_REQUEST)
