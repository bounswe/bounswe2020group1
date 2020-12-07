"""Tests for shopping list functionalities"""
import datetime
import random
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from product.models import Product, Category
from registered_user.models import Vendor, Location, Customer
from shopping_list.models import ProductLists, ListedProducts

class ShoppingListViewTests(TestCase):
    """Tests for shoppinglist endpoints"""
    def setUp(self):
        """Setting up test cases"""
        self.client = APIClient()
        customer = {
            'email': 'dummy@dummy.com',
            'username': 'dummy',
            'dateJoined': datetime.datetime(2020,10,19,11,15,24,339437,),
            'name': 'Dummy',
            'surname': 'Dummyson',
            'totalAmountOfMoneySpent': 0,
            }
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
            }]
        categories = ['Electronics']
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
                },
            {
                'name': 'Apple iPad 8. Generation',
                'description': 'Apple iPad 8. Generation 32 GB 10.2 WiFi Cellular Tablet',
                'photo_url': 'https://productimages.hepsiburada.net/s/43/1100/10761074442290.jpg',
                'vendor': 1,
                'category': 'Electronics',
                'rating': None,
                'numOfRaters': 0,
                'stock': 1000,
                'price': 4299.0,
                'dateAdded': datetime.datetime(2020,11,19,11,18,0,796903,),
                },
            {
                'name': 'Apple MacBook Air',
                'description': '- Apple MacBook Air Intel Core i5 5350U 8GB 128GB SSD MacOS \
                    Sierra 13.3 inch Laptop Computer',
                'photo_url': 'https://productimages.hepsiburada.net/s/32/550/10352483860530.jpg',
                'vendor': 1,
                'category': 'Electronics',
                'rating': None,
                'numOfRaters': 0,
                'stock': 1000,
                'price': 7485.02,
                'dateAdded': datetime.datetime(2020,11,19,11,21,17,74807,),
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
        vendor_names = ['Apple']
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

    def test_create_list(self):
        """Test case for creating a shopping list"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        response = self.client.post('/shoppinglist/createlist/', {'list_name': 'mylist'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(ProductLists.objects.latest("name").name, 'mylist')
        self.assertEqual(ProductLists.objects.latest("name").customer, self.customer)

    def test_delete_list(self):
        """Test case for deleting a shopping list"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        name = "mylist"
        ProductLists.objects.create(customer=self.customer,name=name).save()
        response = self.client.post('/shoppinglist/deletelist/', {'list_name': name})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(ProductLists.objects.filter(name=name,customer=self.customer)), 0)

    def test_add_product_to_list(self):
        """Test case for adding product to a list"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        name = "mylist"
        product = Product.objects.all()[0]
        product_id = product.id
        product_list = ProductLists.objects.create(customer=self.customer,name=name)
        product_list.save()
        response = self.client.post('/shoppinglist/addtolist/',
            {'list_name': name, 'product_id': product_id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(ListedProducts.objects.get(product_list=product_list).product, product)

    def test_delete_product_from_list(self):
        """Test case for deleting a product from list"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        name = "mylist"
        product = Product.objects.all()[0]
        product_id = product.id
        product_list = ProductLists.objects.create(customer=self.customer,name=name)
        product_list.save()
        ListedProducts.objects.create(product_list=product_list, product=product)
        response = self.client.post('/shoppinglist/deletefromlist/',
            {'list_name': name, 'product_id': product_id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(ListedProducts.objects.filter(product_list=product_list,
                                                           product=product)), 0)

    def test_get_lists(self):
        """Test case for getting lists of customer"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        name1 = "mylist1"
        product_list1 = ProductLists.objects.create(customer=self.customer,name=name1)
        product_list1.save()
        name2 = "mylist2"
        product_list2 = ProductLists.objects.create(customer=self.customer,name=name2)
        product_list2.save()
        response = self.client.get('/shoppinglist/getlists/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0],name1)
        self.assertEqual(response.json()[1],name2)

    def test_get_products_from_list(self):
        """Test case for getting products in a list"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        name = "mylist"
        product_list = ProductLists.objects.create(customer=self.customer,name=name)
        product_list.save()
        product_ids = []
        for i in range(2):
            product = Product.objects.all()[i]
            product_ids.append(product.id)
            ListedProducts.objects.create(product_list=product_list, product=product)
        response = self.client.post('/shoppinglist/products/',{'list_name': name})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["id"], product_ids[0])
        self.assertEqual(response.json()[1]["id"], product_ids[1])

    def test_missing_params(self):
        """Test case for missing parameter handling"""
        product_id = Product.objects.all()[0].id
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        response = self.client.post('/shoppinglist/products/')
        self.assertEqual(response.status_code, 400)
        response = self.client.post('/shoppinglist/deletefromlist/',
            {'list_name': "mylist"})
        self.assertEqual(response.status_code, 400)
        response = self.client.post('/shoppinglist/deletefromlist/',
            {'product_id': product_id})
        self.assertEqual(response.status_code, 400)
        response = self.client.post('/shoppinglist/addtolist/',
            {'list_name': "mylist"})
        self.assertEqual(response.status_code, 400)
        response = self.client.post('/shoppinglist/addtolist/',
            {'product_id': product_id})
        self.assertEqual(response.status_code, 400)
        response = self.client.post('/shoppinglist/createlist/')
        self.assertEqual(response.status_code, 400)
