"""Tests for shopping cart functionalities"""
import datetime
import random
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from product.models import Product, Category
from registered_user.models import Vendor, Location, Customer

class OrderViewTests(TestCase):
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
        vendors = [{
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
            }]
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
        for vendor in vendors:
            user = User.objects.create_user(username=vendor['username'
                    ], password=vendor['username'],
                    first_name=vendor['name'])
            user.registereduser.email = vendor['email']
            user.save()
            (x_cord, y_cord) = (random.uniform(36, 42), random.uniform(26, 45))
            location = Location.objects.create(latitude=x_cord, longitude=y_cord)
            vend = Vendor.objects.create(location=location,
                    user=user.registereduser, is_verified=True,
                    iban=(vendor['iban'])[:26], rating=-1)
            vend.save()
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
        self.user.save()
        self.customer = Customer.objects.create(user=self.user.registereduser, money_spent=0)
        self.customer.save()
        self.token = Token.objects.create(user=self.user)

    def test_create_orders(self):
        """Test case for creating orders"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        product = Product.objects.all()[0]
        product_id = product.id
        response = self.client.post('/shoppingcart/add',
            {'quantity': 15, 'product_id': product_id})
        self.assertEqual(response.status_code, 200)
        response2 = self.client.post('/order/create_orders/')
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(len(response2.json()), 1)

        response = self.client.post('/shoppingcart/add',
            {'quantity': 5, 'product_id': product_id})
        response2 = self.client.post('/order/create_orders/')
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(len(response2.json()), 0)


    def test_get_set_cancel_orders(self):
        """Test case for getting products in the cart"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        product_ids = []
        for i in range(2):
            product = Product.objects.all()[i]
            product_ids.append(product.id)
            response = self.client.post('/shoppingcart/add', {'quantity': i + 1, 'product_id': product.id})
            response2 = self.client.post('/order/create_orders/')
        
        response = self.client.get('/order/get_orders/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        order_id_1 = response.json()[0][0]['id']
        order_id_2 = response.json()[1][0]['id']

        response = self.client.post('/order/cancel_order/', {"order_id": order_id_1})
        self.assertEqual(response.status_code, 200)
        
        response = self.client.post('/order/set_delivered/', {"order_id": order_id_2})
        self.assertEqual(response.status_code, 200)
