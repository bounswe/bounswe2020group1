"""Tests for product functionalities"""
import datetime
import random
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from product.models import Product, Category
from registered_user.models import Vendor, Location

class AddProductViewTest(TestCase):
    """Tests for product/add endpoint"""
    def setUp(self):
        """Setting up test cases"""
        self.client = APIClient()
        vendors = [{
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
            }, {
            'email': 'sellers@samsung.com',
            'username': 'samsung',
            'dateJoined': datetime.datetime(2020,11,19,11,15,24,339443,),
            'name': 'Samsung',
            'surname': None,
            'totalAmountOfMoneySpent': 0,
            'is_verified': False,
            'location': 'Gayrettepe, Istanbul, Turkey',
            'iban': 'TR150006226682173255839867',
            'rating ': None,
            }]
        vendor = vendors[0]
        self.user1 = User.objects.create_user(username=vendor['username'],
                password=vendor['username'],
                first_name=vendor['name'])
        self.user1.registereduser.email = vendor['email']
        self.user1.save()
        (x_cord, y_cord) = (random.uniform(36, 42), random.uniform(26, 45))
        self.location1 = Location.objects.create(latitude=x_cord, longitude=y_cord)
        self.vend1 = Vendor.objects.create(location=self.location1,
                user=self.user1.registereduser, is_verified=vendor["is_verified"],
                iban=(vendor['iban'])[:26], rating=-1)
        self.vend1.save()
        vendor = vendors[1]
        self.user2 = User.objects.create_user(username=vendor['username'
                ], password=vendor['username'],
                first_name=vendor['name'])
        self.user2.registereduser.email = vendor['email']
        self.user2.save()
        (x_cord, y_cord) = (random.uniform(36, 42), random.uniform(26, 45))
        self.location2 = Location.objects.create(latitude=x_cord, longitude=y_cord)
        self.vend2 = Vendor.objects.create(location=self.location2,
                user=self.user2.registereduser, is_verified=vendor["is_verified"],
                iban=(vendor['iban'])[:26], rating=-1)
        self.vend2.save()
        category = Category.objects.create(name="Electronics")
        category.save()
        self.token1 = Token.objects.create(user=self.user1)
        self.token2 = Token.objects.create(user=self.user2)

    def tearDown(self):
        """Deleting"""
        self.vend1.delete()
        self.user1.delete()
        self.location1.delete()
        self.vend2.delete()
        self.user2.delete()
        self.location2.delete()

    def test_add_product_verified_vendor(self):
        """Test case for verified vendor adding a valid product"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1}')
        response = self.client.post('/product/add/',
            {'category': 'Electronics',
             'name': 'Apple dummy prod',
             'description': 'Apple dummy prod desc',
             'stock': 1000,
             'price': 1000,
             'brand': "Apple "})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Product.objects.latest("name").name, 'Apple dummy prod')

    def test_add_product_non_verified_vendor(self):
        """Test case for nonverified vendor trying to add a product"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token2}')
        response = self.client.post('/product/add/',
            {'category': 'Electronics',
             'name': 'Samsung dummy prod',
             'description': 'Samsung dummy prod desc',
             'stock': 1000,
             'price': 1000,
             'brand': "Apple "})
        self.assertEqual(response.status_code, 401)

    def test_add_product_nonexisting_category(self):
        """Test case for verified vendor adding a product with invalid category"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1}')
        response = self.client.post('/product/add/',
            {'category': 'nonexistingcategory',
             'name': 'Apple dummy prod',
             'description': 'Apple dummy prod desc',
             'stock': 1000,
             'price': 1000,
             'brand': "Apple "})
        self.assertEqual(response.status_code, 400)

    def test_add_product_invalid_stock(self):
        """Test case for verified vendor adding a product with invalid stock"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1}')
        response = self.client.post('/product/add/',
            {'category': 'Electronics',
             'name': 'Apple dummy prod',
             'description': 'Apple dummy prod desc',
             'stock': "abcdefg",
             'price': 1000,
             'brand': "Apple "})
        self.assertEqual(response.status_code, 400)

    def test_add_product_invalid_price(self):
        """Test case for verified vendor adding a product with invalid price"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1}')
        response = self.client.post('/product/add/',
            {'category': 'nonexistingcategory',
             'name': 'Apple dummy prod',
             'description': 'Apple dummy prod desc',
             'stock': 1000,
             'price': "abcdefg",
             'brand': "Apple "})
        self.assertEqual(response.status_code, 400)

class EditDeleteProductViewsTest(TestCase):
    """Tests for product/edit and product/delete endpoints"""
    def setUp(self):
        """Setting up test cases"""
        self.client = APIClient()
        vendors = [{
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
            }, {
            'email': 'sellers@samsung.com',
            'username': 'samsung',
            'dateJoined': datetime.datetime(2020,11,19,11,15,24,339443,),
            'name': 'Samsung',
            'surname': None,
            'totalAmountOfMoneySpent': 0,
            'is_verified': False,
            'location': 'Gayrettepe, Istanbul, Turkey',
            'iban': 'TR150006226682173255839867',
            'rating ': None,
            }]
        vendor = vendors[0]
        self.user1 = User.objects.create_user(username=vendor['username'],
                password=vendor['username'],
                first_name=vendor['name'])
        self.user1.registereduser.email = vendor['email']
        self.user1.save()
        (x_cord, y_cord) = (random.uniform(36, 42), random.uniform(26, 45))
        self.location1 = Location.objects.create(latitude=x_cord, longitude=y_cord)
        self.vend1 = Vendor.objects.create(location=self.location1,
                user=self.user1.registereduser, is_verified=vendor["is_verified"],
                iban=(vendor['iban'])[:26], rating=-1)
        self.vend1.save()
        vendor = vendors[1]
        self.user2 = User.objects.create_user(username=vendor['username'
                ], password=vendor['username'],
                first_name=vendor['name'])
        self.user2.registereduser.email = vendor['email']
        self.user2.save()
        (x_cord, y_cord) = (random.uniform(36, 42), random.uniform(26, 45))
        self.location2 = Location.objects.create(latitude=x_cord, longitude=y_cord)
        self.vend2 = Vendor.objects.create(location=self.location2,
                user=self.user2.registereduser, is_verified=vendor["is_verified"],
                iban=(vendor['iban'])[:26], rating=-1)
        self.vend2.save()
        category = Category.objects.create(name="Electronics")
        category.save()
        self.token1 = Token.objects.create(user=self.user1)
        self.token2 = Token.objects.create(user=self.user2)
        products = [
            {
                'name': 'Apple iPhone 11',
                'description': 'Apple iPhone 11 64GB Smart Phone',
                'photo_url': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/\
                    iphone11-black-select-2019_GEO_EMEA?wid=940&hei=1112&fmt=png-alpha&qlt=80&.\
                    v=1567021766023',
                'vendor': 1,
                'category': 'Electronics',
                'rating': None,
                'numOfRaters': 0,
                'stock': 1000,
                'price': 7999.99,
                'dateAdded': datetime.datetime(2020,11,19,11,15,24,339457,),
                }
            ]
        vendor_names = ['Apple']
        for product in products:
            category = Category.objects.get(name=product['category'])
            self.product = Product.objects.create(
                    vendor=self.vend1,
                    category=category,
                    name=product['name'],
                    description=product['description'],
                    rating=-1,
                    stock=product['stock'],
                    price=product['price'],
                    date_added=product['dateAdded'],
                )
            self.product.save()

    def test_edit_product_verified_vendor(self):
        """Test case for verified vendor adding a valid product"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1}')
        product = Product.objects.all()[0]
        response = self.client.post('/product/edit/',
            {'id': product.id, 
             'category': 'Electronics',
             'name': 'Apple dummy prod',
             'description': 'Apple dummy prod desc',
             'stock': 1000,
             'price': 1000,
             'brand': "Apple"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Product.objects.latest("name").name, 'Apple dummy prod')
        self.assertEqual(Product.objects.latest("name").description, 'Apple dummy prod desc')
        self.assertEqual(Product.objects.latest("name").stock, 1000)
        self.assertEqual(Product.objects.latest("name").price, 1000)
        self.assertEqual(Product.objects.latest("name").brand, "Apple")

    def test_edit_product_non_verified_vendor(self):
        """Test case for nonverified vendor trying to edit a product"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token2}')
        product = Product.objects.all()[0]
        response = self.client.post('/product/edit/',
            {'id': product.id,
             'category': 'Electronics',
             'name': 'Samsung dummy prod',
             'description': 'Samsung dummy prod desc',
             'stock': 1000,
             'price': 1000,
             'brand': "Apple"})
        self.assertEqual(response.status_code, 401)

    def test_edit_product_invalid_product_id(self):
        """Test case for editing with an invalid product id"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1}')
        response = self.client.post('/product/edit/',
            {'id': -1,
             'brand': "Apple"})
        self.assertEqual(response.status_code, 400)

    def test_delete_product_invalid_product_id(self):
        """Test case for deleting with an invalid product id"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1}')
        response = self.client.delete('/product/delete/',{'id': -1})
        self.assertEqual(response.status_code, 400)

    def test_delete_product_valid_product_id(self):
        """Test case for deleting with a valid product id"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1}')
        product = Product.objects.all()[0]
        response = self.client.delete('/product/delete/',{'id': product.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(Product.objects.all()),0)
