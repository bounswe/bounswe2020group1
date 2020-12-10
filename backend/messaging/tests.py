"""Tests for messaging functionalities"""
import datetime
import random
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from product.models import Product, Category
from order.models import Order
from registered_user.models import Vendor, Location, Customer
from messaging.models import (
    MessageFlowAdmin,
    MessageFlowCustomer,
    MessageHistoryAdmin,
    MessageHistoryCustomer
)

class ShoppingListViewTests(TestCase):
    """Tests for shoppinglist endpoints"""
    def setUp(self):
        """Setting up test cases"""
        self.client = APIClient()
        customer_info = {
            'email': 'dummy@dummy.com',
            'username': 'dummy',
            'dateJoined': datetime.datetime(2020,10,19,11,15,24,339437,),
            'name': 'Dummy',
            'surname': 'Dummyson',
            'totalAmountOfMoneySpent': 0,
            }
        vendor_info = {
            'email': 'sellers@apple.com',
            'username': 'apple',
            'dateJoined': datetime.datetime(2020,11,19,11,15,24,339437,),
            'name': 'Apple',
            'surname': None,
            'totalAmountOfMoneySpent': 0,
            'is_verified': True,
            'location': 'Zincirlikuyu, Istanbul, Turkey',
            'iban': 'TR730006271333541288459635',
            'rating ': None,
            }
        product = {
                'name': 'Apple iPhone 11',
                'description': 'Apple iPhone 11 64GB Smart Phone',
                'vendor': 1,
                'category': 'Electronics',
                'rating': None,
                'numOfRaters': 0,
                'stock': 1000,
                'price': 7999.99,
                'dateAdded': datetime.datetime(2020,11,19,11,15,24,339457,),
                }
        # CREATING VENDOR
        user = User.objects.create_user(
                username=vendor_info['username'],
                password=vendor_info['username'],
                first_name=vendor_info['name']
            )
        user.registereduser.email = vendor_info['email']
        user.save()
        (x_cord, y_cord) = (random.uniform(36, 42), random.uniform(26, 45))
        location = Location.objects.create(latitude=x_cord, longitude=y_cord)
        self.vendor = Vendor.objects.create(
                location=location,
                user=user.registereduser,
                is_verified=True,
                iban=vendor_info['iban'],
                rating=-1
            )
        self.vendor.save()
        # CREATING PRODUCT
        category = Category.objects.create(name="Electronics")
        category.save()
        prod = Product.objects.create(
                vendor=self.vendor,
                category=category,
                name=product['name'],
                description=product['description'],
                rating=-1,
                stock=product['stock'],
                price=product['price'],
                date_added=product['dateAdded'],
            )
        prod.save()
        self.product = prod
        # CREATING CUSTOMER
        user = User.objects.create_user(
                username=customer_info['username'],
                password=customer_info['username'],
                first_name=customer_info['name']
            )
        user.registereduser.email = customer_info['email']
        user.save()
        self.customer = Customer.objects.create(user=user.registereduser, money_spent=0)
        self.customer.save()
        # CREATING TOKENS
        self.customer_token = Token.objects.create(user=self.customer.user.user)
        self.vendor_token = Token.objects.create(user=self.vendor.user.user)
        self.admin = User.objects.create_user(
                    username="admin",
                    password="admin",
                    first_name="Admin",
                    last_name="Adminson",
                    is_superuser=True
                )
        self.admin.save()
        self.admin_token = Token.objects.create(user=self.admin)
        order = Order.objects.create(
            customer=self.customer,
            vendor=self.vendor,
            product=self.product,
            status="delivered",
            #cargoID="cargoID",
            #orderDate=orderDate,
            estimatedArrivalDate=datetime.datetime(2021, 6, 1),
            arrivalDate=datetime.datetime(2021, 6, 1)
        )
        order.save()
    def test_create_flow_customer(self):
        """Test case for customer creating a flow"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.customer_token}')
        response = self.client.post('/message/startflow/customer/', {'vendor_name': 'Apple'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MessageFlowCustomer.objects.latest("customer").customer, self.customer)
        self.assertEqual(MessageFlowCustomer.objects.latest("customer").vendor, self.vendor)

    def test_create_flow_vendor(self):
        """Test case for vendor creating flow list"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.vendor_token}')
        response = self.client.post('/message/startflow/vendor/',
                {
                    "context": "product",
                    "object_id": self.product.id,
                }
            )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MessageFlowAdmin.objects.latest("vendor").vendor, self.vendor)
        self.assertEqual(MessageFlowAdmin.objects.latest("vendor").admin, self.admin)
        self.assertEqual(MessageFlowAdmin.objects.latest("vendor").product, self.product)

    def test_get_flow_vendor(self):
        """Test case for vendor getting flow lists"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.vendor_token}')
        response = self.client.post('/message/startflow/vendor/',
                {
                    "context": "product",
                    "object_id": self.product.id,
                }
            )
        response = self.client.get('/message/flow/vendor/').json()
        self.assertIn("customer_flows", response)
        self.assertIn("admin_flows", response)
        self.assertEqual(len(response["customer_flows"]), 0)
        self.assertEqual(len(response["admin_flows"]), 1)

    def test_get_flow_customer(self):
        """Test case for customer getting flow list"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.customer_token}')
        response = self.client.post('/message/startflow/customer/', {"vendor_name": "Apple"})
        response = self.client.get('/message/flow/customer/').json()
        self.assertEqual(len(response), 1)

    def test_get_flow_admin(self):
        """Test case for admin getting flow list"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.vendor_token}')
        response = self.client.post('/message/startflow/vendor/',
                {
                    "context": "product",
                    "object_id": self.product.id,
                }
            )
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        response = self.client.get('/message/flow/admin/').json()
        self.assertEqual(len(response), 1)

    def test_send_message_admin(self):
        """Test case for admin sending a message """
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.vendor_token}')
        response = self.client.post('/message/startflow/vendor/',
                {
                    "context": "product",
                    "object_id": self.product.id,
                }
            )
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        response = self.client.post('/message/send/admin/tovendor/',
                {
                    "flow_id": MessageFlowAdmin.objects.latest("vendor").id,
                    "message": "This is a test message"
                }
            )
        response = self.client.get('/message/chat/ofadmin/',
                {"flow_id": MessageFlowAdmin.objects.latest("vendor").id,}
            ).json()
        self.assertEqual(len(response), 1)
        self.assertEqual(response[0]["message"], "This is a test message")
        self.assertEqual(response[0]["sender"], "self")

    def test_send_message_vendor(self):
        """Test case for vendor sending messages"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.customer_token}')
        response = self.client.post('/message/startflow/customer/', {'vendor_name': 'Apple'})

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.vendor_token}')
        response = self.client.post('/message/startflow/vendor/',
                {
                    "context": "product",
                    "object_id": self.product.id,
                }
            )
        response = self.client.post('/message/send/vendor/toadmin/',
                {
                    "flow_id": MessageFlowAdmin.objects.latest("vendor").id,
                    "message": "This is a test message"
                }
            )
        response = self.client.post('/message/send/vendor/tocustomer/',
                {
                    "flow_id": MessageFlowCustomer.objects.latest("vendor").id,
                    "message": "This is a test message"
                }
            )
        response = self.client.get('/message/chat/ofvendor/wadmin/',
                {"flow_id": MessageFlowAdmin.objects.latest("vendor").id,}
            ).json()
        self.assertEqual(len(response), 1)
        self.assertEqual(response[0]["message"], "This is a test message")
        self.assertEqual(response[0]["sender"], "self")
        response = self.client.get('/message/chat/ofvendor/wcustomer/',
                {"flow_id": MessageFlowCustomer.objects.latest("vendor").id,}
            ).json()
        self.assertEqual(len(response), 1)
        self.assertEqual(response[0]["message"], "This is a test message")
        self.assertEqual(response[0]["sender"], "self")

    def test_send_message_customer(self):
        """Test case for customer sending message"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.customer_token}')
        response = self.client.post('/message/startflow/customer/', {'vendor_name': 'Apple'})
        response = self.client.post('/message/send/customer/tovendor/',
                {
                    "flow_id": MessageFlowCustomer.objects.latest("customer").id,
                    "message": "This is a test message"
                }
            )
        response = self.client.get('/message/chat/ofcustomer/',
                {"flow_id": MessageFlowCustomer.objects.latest("vendor").id,}
            ).json()
        self.assertEqual(len(response), 1)
        self.assertEqual(response[0]["message"], "This is a test message")
        self.assertEqual(response[0]["sender"], "self")
