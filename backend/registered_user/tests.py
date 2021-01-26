from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.test import Client

from .models import Customer, Vendor, Location


class LoginTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='test', password='test', email='test@example.com',
                                             first_name="first_name", last_name="last_name")
        self.registered_user = self.user.registereduser
        self.registered_user.email = self.user.email
        self.registered_user.is_verified = True
        self.customer = Customer(user=self.registered_user, money_spent=0)
        self.customer.save()
        self.user.save()

    def tearDown(self):
        self.customer.delete()
        self.registered_user.delete()
        self.user.delete()

    def test_correct_username(self):
        user = authenticate(username='test', password='test')
        self.assertTrue((user is not None) and user.is_authenticated)

    def test_correct_email(self):
        user = authenticate(username='test@example.com', password='test')
        self.assertTrue((user is not None) and user.is_authenticated)

    def test_wrong_username(self):
        user = authenticate(username='wrong', password='test')
        self.assertFalse(user is not None and user.is_authenticated)

    def test_wrong_email(self):
        user = authenticate(username='wrong@example.com', password='test')
        self.assertFalse(user is not None and user.is_authenticated)

    def test_wrong_password(self):
        user = authenticate(username='test', password='wrong')
        self.assertFalse(user is not None and user.is_authenticated)


class LoginViewTest(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(username='test', password='test', email='test@example.com',
                                                         first_name="first_name", last_name="last_name")
        self.registered_user = self.user.registereduser
        self.registered_user.email = self.user.email
        self.registered_user.is_verified = True
        self.customer = Customer(user=self.registered_user, money_spent=0)
        self.customer.save()
        self.user.save()

    def tearDown(self):
        self.customer.delete()
        self.registered_user.delete()
        self.user.delete()

    def test_correct_username(self):
        response = self.client.post('/user/login', {'email': 'test', 'password': 'test'})
        user = authenticate(username='test', password='test')
        self.assertTrue(response.data['auth_token'])

    def test_correct_email(self):
        response = self.client.post('/user/login', {'email': 'test@example.com', 'password': 'test'})
        user = authenticate(username='test@example.com', password='test')
        self.assertTrue(response.data['auth_token'])

    def test_wrong_username(self):
        response = self.client.post('/user/login', {'email': 'wrong', 'password': 'test'})
        user = authenticate(username='wrong', password='test')
        self.assertTrue(response.status_code == 401)
        self.assertTrue(response.data['error'])

    def test_wrong_email(self):
        response = self.client.post('/user/login', {'email': 'wrong@example.com', 'password': 'test'})
        user = authenticate(username='wrong@example.com', password='test')
        self.assertTrue(response.status_code == 401)
        self.assertTrue(response.data['error'])

    def test_wrong_password(self):
        response = self.client.post('/user/login', {'email': 'test', 'password': 'wrong'})
        user = authenticate(username='test', password='wrong')
        self.assertTrue(response.status_code == 401)
        self.assertTrue(response.data['error'])

    def test_empty_username(self):
        response = self.client.post('/user/login', {'email': '', 'password': 'test'})
        self.assertTrue(response.status_code == 400)
        self.assertTrue(response.data['error'])

    def test_empty_password(self):
        response = self.client.post('/user/login', {'email': 'test', 'password': ''})
        self.assertTrue(response.status_code == 400)
        self.assertTrue(response.data['error'])


class SignupTest(TestCase):
    def setUp(self):
        self.username = "test"
        self.email = "test@tursu.com"
        self.password = "test"
        self.first_name = "Test_name"
        self.last_name = "Test_surname"
        self.iban = "test_IBAN"
        self.latitude = "0"
        self.longitude = "0"
        self.city = "test_city"
        self.user = None
        self.registered_user = None
        self.customer = None
        self.vendor = None
        self.location = None

    def tearDown(self):
        if self.customer:
            self.customer.delete()
            self.registered_user.delete()
            self.user.delete()
        elif self.vendor:
            self.vendor.delete()
            self.location.delete()
            self.registered_user.delete()
            self.user.delete()

    def create_customer(self, first_name):
        if self.username and self.email and self.password and first_name and self.last_name:
            self.user = User.objects.create_user(username=self.username, password=self.password, email=self.email,
                                             first_name=first_name, last_name=self.last_name)
            self.registered_user = self.user.registereduser
            self.registered_user.email = self.email
            self.registered_user.is_verified = True
            self.registered_user.save()
            self.customer = Customer(user=self.registered_user, money_spent=0)
            self.customer.save()

    def test_customer_all_fields_provided(self):
        self.create_customer(first_name=self.first_name)

        self.assertTrue(self.customer is not None)
        self.assertTrue(self.registered_user is not None)
        self.assertTrue(self.user is not None)

    def test_customer_missing_field(self):
        self.create_customer(first_name="")

        self.assertFalse(self.customer is not None)
        self.assertFalse(self.registered_user is not None)
        self.assertFalse(self.user is not None)

    def create_vendor(self, first_name, city):
        if self.username and self.email and self.password and first_name and \
                self.last_name and self.latitude and self.longitude and city:
            self.user = User.objects.create_user(username=self.username, email=self.email, first_name=first_name,
                                             last_name=self.last_name, password=self.password)
            self.registered_user = self.user.registereduser
            self.registered_user.email = self.email
            self.registered_user.is_verified = True
            self.registered_user.save()

            self.location = Location(latitude=self.latitude, longitude=self.longitude, city=self.city)
            self.location.save()
            self.vendor = Vendor(user=self.registered_user, iban=self.iban, rating=0, location=self.location)
            self.vendor.save()

    def test_vendor_all_fields_provided(self):
        self.create_vendor(first_name=self.first_name, city=self.city)

        self.assertTrue(self.vendor)
        self.assertTrue(self.vendor is not None)
        self.assertTrue(self.registered_user is not None)
        self.assertTrue(self.user is not None)

    def test_vendor_missing_first_name(self):
        self.create_vendor(first_name="", city=self.city)

        self.assertFalse(self.vendor is not None)
        self.assertFalse(self.registered_user is not None)
        self.assertFalse(self.user is not None)

    def test_vendor_missing_city(self):
        self.create_vendor(first_name=self.first_name, city="")

        self.assertFalse(self.vendor is not None)
        self.assertFalse(self.location is not None)
        self.assertFalse(self.registered_user is not None)
        self.assertFalse(self.user is not None)