import requests
import random
import string

from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import send_mail

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status

from registered_user.models import get_vendor_from_request, get_customer_from_request

from .models import RegisteredUser, Vendor, Customer, Location, VerificationCode
from tursu.settings import EMAIL_HOST_USER


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.POST.get('email')
    password = request.POST.get('password')
    verification_code = request.POST.get('verification_code', None)

    if (not username) or (not password):
        return Response({'error': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)

    if not user:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    first_name = user.first_name
    last_name =  user.last_name
    user_type = 'admin'
    
    registered_user = RegisteredUser.objects.filter(user=user).first()
    if not registered_user.is_verified:
        verification = VerificationCode.objects.filter(registered_user=registered_user,
                                                          verification_code=verification_code).first()
        if verification is not None:
            registered_user.is_verified = True
            registered_user.save()
        if not registered_user.is_verified:
            return Response({'error': 'Not Verified'}, status=status.HTTP_401_UNAUTHORIZED)

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
                        vendor = Vendor(user=registered_user, iban=iban, rating=0, location=location, is_verified=True)
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
                
                resend_verification(email)
                return Response({}, status=status.HTTP_200_OK)

    else:
        return Response({'error': 'All fields should be filled.'}, status=status.HTTP_400_BAD_REQUEST)


@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def edit_profile(request):
    """Edits user with given parameters when POST request is made."""
    customer = get_customer_from_request(request)
    vendor = get_vendor_from_request(request)
    if vendor is not None:
        if 'iban' in request.POST:
            vendor.iban = request.POST["iban"]
        if 'first_name' in request.POST:
            vendor.user.user.first_name = request.POST["first_name"]
        if 'password' in request.POST:
            vendor.user.user.set_password(request.POST["password"])
        vendor.user.user.save()
        vendor.user.save()
        vendor.save()
    
    elif customer is not None:
        if 'first_name' in request.POST:
            customer.user.user.first_name = request.POST["first_name"]
        if 'last_name' in request.POST:
            customer.user.user.last_name = request.POST["last_name"]
        if 'password' in request.POST:
            customer.user.user.set_password(request.POST["password"])
        customer.user.user.save()
        customer.user.save()
        customer.save()
    
    else: 
        return Response("Authentication failed", status=401)
        

    return Response({}, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def google_login(request):
    id_token = request.POST.get('tokenId')
    response = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}")
    if response.status_code != 200:
        return Response({'error': 'Invalid Token'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        response = response.json()
        email = response.get("email")
    except:
        return Response({'error': 'Invalid Token'}, status=status.HTTP_401_UNAUTHORIZED)

    user = User.objects.filter(email=email).first()
    if not user:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    first_name = user.first_name
    last_name =  user.last_name
    user_type = 'admin'
    
    registered_user = RegisteredUser.objects.filter(user=user).first()
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
def google_signup(request):
    id_token = request.POST.get('tokenId')
    response = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}")
    if response.status_code != 200:
        return Response({'error': 'Invalid Token'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        response = response.json()
        email = response["email"]
        username = email
        password = response["sub"]+response["iat"]+response["exp"]
        first_name = response["given_name"]
        last_name = response["family_name"]
    except:
        return Response({'error': 'Invalid Token'}, status=status.HTTP_401_UNAUTHORIZED)
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
            return Response({'error': 'The account with given info already exists.'}, status=status.HTTP_400_BAD_REQUEST)

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
                        registered_user.is_verified = True
                        registered_user.save()
                        location = Location(latitude=latitude, longitude=longitude, city=city)
                        location.save()
                        vendor = Vendor(user=registered_user, iban=iban, rating=0, location=location)
                        vendor.save()
                        user_type = "vendor"
                    else:
                        return Response({'error': 'Missing fields for the vendor.'}, status=status.HTTP_400_BAD_REQUEST)
                # is_vendor returns false: create customer
                else:
                    user = User.objects.create_user(username=username, email=email, first_name=first_name,
                                                    last_name=last_name, password=password)
                    registered_user = user.registereduser
                    registered_user.email = email
                    registered_user.is_verified = True
                    registered_user.save()
                    customer = Customer(user=registered_user, money_spent=0)
                    customer.save()
                    user_type ="customer"

                user = authenticate(request, username=username, password=password)
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                        'auth_token': token.key,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'user_type': user_type},
                        status=status.HTTP_200_OK)
    else:
        return Response({'error': 'All fields should be filled.'}, status=status.HTTP_400_BAD_REQUEST)


def get_random_string(length):
    return ''.join((random.choice(string.ascii_letters + string.digits) for i in range(length)))


@api_view(["POST"])
@permission_classes((AllowAny,))
def resend_verification_code(request):
    email = request.POST.get('email', None)
    if email is None:
        return Response({'error': 'Missing email parameter'}, status=status.HTTP_400_BAD_REQUEST)
    if resend_verification(email) == True:
        return Response({}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid Email'}, status=status.HTTP_400_BAD_REQUEST)


def resend_verification(email):
    if email is None:
        return False
    registered_user = RegisteredUser.objects.filter(email=email).first()
    if registered_user is not None:
        code = get_random_string(10)
        message =  "To complete your registration please enter your verification code: " + code
        send_mail("Your Verification Code - Tursu", 
            message, EMAIL_HOST_USER, [email], fail_silently = False)
        verification_code = VerificationCode.objects.create(registered_user=registered_user, verification_code=code)
        verification_code.save()
        return True
    return False