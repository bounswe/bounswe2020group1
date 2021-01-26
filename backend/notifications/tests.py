"""Tests for notification and alert logic"""
"""Tests for shopping cart functionalities"""
import datetime
import random
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from product.models import Product, Category
from registered_user.models import Vendor, Location, Customer

class NotificationsViewTest(TestCase):
    """Tests for order endpoints"""
    def setUp(self):
        """Setting up test cases"""
        self.client = APIClient()
        customer = {
            'email': 'dummy_cart@dummy.com',
            'username': 'dummy_cart',
            'dateJoined': datetime.datetime(2020,10,19,11,15,24,339437,),
            'name': 'Brilliant',
            'surname': 'Cartson',
            'totalAmountOfMoneySpent': 0,
            }
        vendor = {
            'email': 'sellers@armut.com',
            'username': 'armut',
            'dateJoined': datetime.datetime(2020,11,19,11,15,24,339437,),
            'name': 'Armut',
            'surname': None,
            'totalAmountOfMoneySpent': 0,
            'is_verified': True,
            'location': 'Kadikoy, Istanbul, Turkey',
            'iban': 'TR370006271333541288459635',
            'rating ': None,
            }
        categories = ['Electronics']
        products = [
            {
                'name': 'Armut iPhone 11',
                'description': 'Armut iPhone 11 64GB Smart Phone',
                'photo_url': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/\
                    iphone11-black-select-2019_GEO_EMEA?wid=940&hei=1112&fmt=png-alpha&qlt=80&.\
                    v=1567021766023',
                'vendor': 1,
                'category': 'Electronics',
                'rating': None,
                'numOfRaters': 0,
                'stock': 10,
                'price': 7999.99,
                'dateAdded': datetime.datetime(2020,11,19,11,15,24,339457,),
                'is_verified': True,
                },
            {
                'name': 'Armut iPad 8. Generation',
                'description': 'Armut iPad 8. Generation 32 GB 10.2 WiFi Cellular Tablet',
                'photo_url': 'https://productimages.hepsiburada.net/s/43/1100/10761074442290.jpg',
                'vendor': 1,
                'category': 'Electronics',
                'rating': None,
                'numOfRaters': 0,
                'stock': 10,
                'price': 4299.0,
                'dateAdded': datetime.datetime(2020,11,19,11,18,0,796903,),
                'is_verified': True,
                },
            {
                'name': 'Armut MacBook Air',
                'description': '- Armut MacBook Air Intel Core i5 5350U 8GB 128GB SSD MacOS \
                    Sierra 13.3 inch Laptop Computer',
                'photo_url': 'https://productimages.hepsiburada.net/s/32/550/10352483860530.jpg',
                'vendor': 1,
                'category': 'Electronics',
                'rating': None,
                'numOfRaters': 0,
                'stock': 10,
                'price': 7485.02,
                'dateAdded': datetime.datetime(2020,11,19,11,21,17,74807,),
                'is_verified': True,
                },
            ]
        self.vendors = []
        user = User.objects.create_user(username=vendor['username'
                ], password=vendor['username'],
                first_name=vendor['name'])
        user.registereduser.email = vendor['email']
        user.registereduser.is_verified = True
        user.save()
        (x_cord, y_cord) = (random.uniform(36, 42), random.uniform(26, 45))
        location = Location.objects.create(latitude=x_cord, longitude=y_cord)
        vend = Vendor.objects.create(location=location,
                user=user.registereduser, is_verified=True,
                iban=(vendor['iban'])[:26], rating=-1)
        vend.save()
        self.vendor = vend
        self.vendor_token = Token.objects.create(user=user)

        for cat in categories:
            category = Category.objects.create(name=cat)
            category.save()
        vendor_names = ['Armut']
        for product in products:
            vendor = Vendor.objects.get(user__user__first_name=vendor_names[product['vendor'] - 1])
            category = Category.objects.get(name=product['category'])
            prod = Product.objects.create(
                vendor=vendor,
                category=category,
                name=product['name'],
                description=product['description'],
                rating=-1,
                stock=product['stock'],
                price=product['price'],
                date_added=product['dateAdded'],
                is_verified=product['is_verified']
                )
            prod.save()
        self.user = User.objects.create_user(username=customer['username'],
        			password=customer['username'],
                    first_name=customer['name'])
        self.user.registereduser.email = customer['email']
        self.user.registereduser.is_verified = True
        self.user.save()
        self.customer = Customer.objects.create(user=self.user.registereduser, money_spent=0)
        self.customer.save()
        self.token = Token.objects.create(user=self.user)

    def test_create_alerts(self):
        """Test case for creating and getting alerts"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        product = Product.objects.all()[0]
        product_id = product.id
        response = self.client.post('/notifications/create_alert',
            {'type': 1, 'product_id': product_id, 'value': 2000})
        self.assertEqual(response.status_code, 200)
        response2 = self.client.post('/notifications/create_alert',
            {'type': 2, 'product_id': product_id})
        self.assertEqual(response2.status_code, 200)
        response3 = self.client.post('/notifications/create_alert',
            {'type': 3, 'product_id': product_id, 'value': 1000})
        self.assertEqual(response3.status_code, 200)
 
        response4 = self.client.get('/notifications/get_alerts')
        self.assertEqual(response4.status_code, 200)
        self.assertEqual(len(response4.json()), 3)

    def test_delete_alerts(self):
        """Test case for creating and getting alerts"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        product = Product.objects.all()[0]
        product_id = product.id
        response = self.client.post('/notifications/create_alert',
            {'type': 1, 'product_id': product_id, 'value': 2000})
        self.assertEqual(response.status_code, 200)
        response2 = self.client.post('/notifications/create_alert',
            {'type': 2, 'product_id': product_id})
        self.assertEqual(response2.status_code, 200)
        response3 = self.client.post('/notifications/create_alert',
            {'type': 3, 'product_id': product_id, 'value': 1000})
        self.assertEqual(response3.status_code, 200)
    
        response4 = self.client.post('/notifications/delete_alert',
            {'id': response.json()})
        self.assertEqual(response4.status_code, 200)

        response5 = self.client.post('/notifications/delete_alert',
            {'id': response2.json()})
        self.assertEqual(response5.status_code, 200)

        response6 = self.client.post('/notifications/delete_alert',
            {'id': response3.json()})
        self.assertEqual(response6.status_code, 200)

        response7 = self.client.get('/notifications/get_alerts')
        self.assertEqual(response7.status_code, 200)
        self.assertEqual(len(response7.json()), 0)
    
    def test_product_notifications(self):
        """Test case for notifications"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        product = Product.objects.all()[0]
        product_id = product.id
        response = self.client.post('/notifications/create_alert',
            {'type': 1, 'product_id': product_id, 'value': 1000})
        self.assertEqual(response.status_code, 200)
        response2 = self.client.post('/notifications/create_alert',
            {'type': 2, 'product_id': product_id})
        self.assertEqual(response2.status_code, 200)
        response3 = self.client.post('/notifications/create_alert',
            {'type': 3, 'product_id': product_id, 'value': 1000})
        self.assertEqual(response3.status_code, 200)
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.vendor_token}')
        product = Product.objects.all()[0]
        response = self.client.post('/product/edit/',
            {'id': product.id, 
             'category': 'Electronics',
             'name': 'Apple dummy prod',
             'description': 'Apple dummy prod desc',
             'stock': 1500,
             'price': 800,
             'brand': "Apple"})
        self.assertEqual(response.status_code, 200)
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        response4 = self.client.get('/notifications/get_notifications')
        self.assertEqual(response4.status_code, 200)
        self.assertEqual(len(response4.json()), 3)
        self.assertEqual((response4.json()[0]['new_value'] >= 1000), True)
        self.assertEqual(response4.json()[0]['type'], 5)
        self.assertEqual((response4.json()[1]['new_value'] <= 1000), True)
        self.assertEqual(response4.json()[1]['type'], 3)
        self.assertEqual((response4.json()[2]['new_value'] != 7999.99), True)
        self.assertEqual(response4.json()[2]['type'], 4)


    def test_set_read(self):
        """Test case for notifications"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        product = Product.objects.all()[0]
        product_id = product.id
        response = self.client.post('/notifications/create_alert',
            {'type': 1, 'product_id': product_id, 'value': 1000})
        self.assertEqual(response.status_code, 200)
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.vendor_token}')
        product = Product.objects.all()[0]
        response = self.client.post('/product/edit/',
            {'id': product.id, 
             'category': 'Electronics',
             'name': 'Apple dummy prod',
             'description': 'Apple dummy prod desc',
             'stock': 1500,
             'price': 800,
             'brand': "Apple"})
        self.assertEqual(response.status_code, 200)
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        response2 = self.client.get('/notifications/get_notifications')
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(len(response2.json()), 1)
        self.assertEqual(response2.json()[0]['read'], False)
       
        product = Product.objects.all()[0]
        response3 = self.client.post('/notifications/set_read',
            {'id': response2.json()[0]['id']})
        self.assertEqual(response3.status_code, 200) 

        response4 = self.client.get('/notifications/get_notifications')
        self.assertEqual(response4.status_code, 200)
        self.assertEqual(len(response4.json()), 1)
        self.assertEqual(response4.json()[0]['read'], True)