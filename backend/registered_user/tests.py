from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.test import Client

from .models import Customer


class LoginTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='test', password='test', email='test@example.com',
                                             first_name="first_name", last_name="last_name")
        self.registered_user = self.user.registereduser
        self.registered_user.email = self.user.email
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
