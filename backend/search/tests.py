""" Tests for /search/ endpoint """
import datetime
import random
from django.test import TestCase, Client
from django.contrib.auth.models import User
from product.models import Product, Category
from registered_user.models import Vendor, Location


class SearchTestCase(TestCase):
    """ Test cases for /search/ endpoint """

    def setUp(self):
        self.client = Client()
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
            'is_verified': True,
            'location': 'Gayrettepe, Istanbul, Turkey',
            'iban': 'TR150006226682173255839867',
            'rating ': None,
            }]
        categories = ['Home', 'Electronics']
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
            {
                'name': 'Apple Watch SE',
                'description': '- Apple Watch SE 44mm GPS Space Gray Aluminum Case and Dark \
                    Sports Strap',
                'photo_url': 'https://productimages.hepsiburada.net/s/44/1100/10807143333938.jpg',
                'vendor': 1,
                'category': 'Electronics',
                'rating': None,
                'numOfRaters': 0,
                'stock': 1000,
                'price': 2949.0,
                'dateAdded': datetime.datetime(2020,11,19,11,23,30,189892,),
                },
            {
                'name': 'Apple Airpods 2. Generation',
                'description': 'Apple AirPods 2. Generation Bluetooth Headphones'
                    ,
                'photo_url': 'https://productimages.hepsiburada.net/s/28/550/10236494053426.jpg/'
                    ,
                'vendor': 1,
                'category': 'Electronics',
                'rating': None,
                'numOfRaters': 0,
                'stock': 1000,
                'price': 1159.9,
                'dateAdded': datetime.datetime(2020,11,19,11,25,17,811068,),
                },
            {
                'name': 'Samsung Galaxy S20 Plus',
                'description': 'Samsung Galaxy S20 Plus 128 GB with Samsung Turkey Guarantee'
                    ,
                'photo_url': 'https://productimages.hepsiburada.net/s/35/1100/10486446129202.jpg/'
                    ,
                'vendor': 2,
                'category': 'Electronics',
                'rating': None,
                'numOfRaters': 0,
                'stock': 1000,
                'price': 7955.0,
                'dateAdded': datetime.datetime(2020,11,19,11,27,40,119574,),
                },
            {
                'name': 'Samsung 4K Ultra HD Smart LED TV',
                'description': 'Samsung  UE50TU7000UXTK  127 Screen Digital Receiver included \
                    4K Ultra HD Smart LED TV'
                    ,
                'photo_url': 'https://productimages.hepsiburada.net/s/44/550/10803535183922.jpg/'
                    ,
                'vendor': 2,
                'category': 'Electronics',
                'rating': None,
                'numOfRaters': 0,
                'stock': 1000,
                'price': 4942.22,
                'dateAdded': datetime.datetime(2020,11,19,11,29,56,436334,),
                },
            {
                'name': 'Samsung Galaxy Tab',
                'description': 'Wi-Fi802.11 a/b/g/n\xc4\xb0\xc5\x9fletim Sistemi Taban\xc4\xb1 \
                    Android Ekran Modeli Ram Kapasitesi 2 GB Ekran Boyutu 10,1\
                     in\xc3\xa7Kamera\xc3\x87ift KameraMax Ekran \
                    \xc3\x87\xc3\xb6z\xc3\xbcn\xc3\xbcrl\xc3\xbc\xc4\x9f\xc3\xbc1920 x 1200Mobil \
                    Ba\xc4\x9flant\xc4\xb1YokT\xc3\xbcm \xc3\xb6zellikler',
                'photo_url': 'https://productimages.hepsiburada.net/s/29/550/10265261047858.jpg/',
                'vendor': 2,
                'category': 'Electronics',
                'rating': None,
                'numOfRaters': 0,
                'stock': 1000,
                'price': 1696.0,
                'dateAdded': datetime.datetime(2020,11,19,11,33,0,69357,),
                },
            {
                'name': 'Samsung Laundry Washing Machine',
                'description': 'Samsung WW90J5 A+++ 1400 Cycle 9 kg Laundry Washing Machine',
                'photo_url': 'https://productimages.hepsiburada.net/s/19/1100/9860566581298.jpg/',
                'vendor': 2,
                'category': 'Home',
                'rating': None,
                'numOfRaters': 0,
                'stock': 1000,
                'price': 3149.0,
                'dateAdded': datetime.datetime(2020,11,19,11,35,33,841876,),
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
        vendor_names = ['Apple', 'Samsung']
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
                is_verified=True,
                )
            prod.save()

    def test_searching_product_with_vendor_name(self):
        """Searching a product based on vendor name"""

        vendor_name = 'Apple'
        response = self.client.get('/search/',
                              {'search_string': vendor_name,
                              'search_type': 'product'}).json()
        company_products = \
            Product.objects.filter(vendor__user__user__first_name=vendor_name)
        response_products = set(product['name'] for product in response)
        for product in company_products:
            self.assertIn(product.name, response_products)

    def test_searching_product_with_category(self):
        """Searching a product based on category"""

        category = 'Electronics'
        response = self.client.get('/search/', {'search_string': category,
                              'search_type': 'product'}).json()
        company_products = \
            Product.objects.filter(category__name=category)
        response_products = set(product['name'] for product in response)
        for product in company_products:
            self.assertIn(product.name, response_products)

    def test_searching_product_with_string(self):
        """Searching a product based on a string"""

        string = 'apple samsung'
        response = self.client.get('/search/', {'search_string': string,
                              'search_type': 'product'}).json()
        company_products = Product.objects.all()
        response_products = set(product['name'] for product in response)
        for product in company_products:
            self.assertIn(product.name, response_products)

    def test_searching_product_with_vendor_name_case_insensitive(self):
        """Searching a product based on vendor name given case insensitive"""

        vendor_name = 'aPpLe'
        response = self.client.get('/search/',
                              {'search_string': vendor_name,
                              'search_type': 'product'}).json()
        company_products = \
            Product.objects.filter(vendor__user__user__first_name=vendor_name)
        response_products = set(product['name'] for product in response)
        for product in company_products:
            self.assertIn(product.name, response_products)

    def test_searching_product_with_category_case_insensitive(self):
        """Searching a product based on category given case insensitive"""

        category = 'eLeCTRonics'
        response = self.client.get('/search/', {'search_string': category,
                              'search_type': 'product'}).json()
        company_products = \
            Product.objects.filter(category__name=category)
        response_products = set(product['name'] for product in response)
        for product in company_products:
            self.assertIn(product.name, response_products)

    def test_searching_nonexisting_product(self):
        """Searching a product based on a nonexisting string"""

        string = '_t_h_i_s_p_r_o_d_u_c_t_d_o_e_s_n_o_t_e_x_i_s_t'
        response = self.client.get('/search/', {'search_string': string,
                              'search_type': 'product'}).json()
        self.assertEqual(len(response), 0)

    def test_searching_vendor(self):
        """Searching a vendor"""

        string = 'Apple'
        response = self.client.get('/search/', {'search_string': string,
                              'search_type': 'vendor'}).json()
        vendor_names = set(vendor['name'] for vendor in response)
        self.assertIn("Apple", vendor_names)

    def test_searching_vendor_case_insensitive(self):
        """Searching a vendor with case insensitive query"""

        string = 'aPpLe'
        response = self.client.get('/search/', {'search_string': string,
                              'search_type': 'vendor'}).json()
        vendor_names = set(vendor['name'] for vendor in response)
        self.assertIn("Apple", vendor_names)

    def test_searching_multiple_vendors(self):
        """Searching a vendor with case insensitive query"""

        string = 'aPpLe saMSuNg'
        response = self.client.get('/search/', {'search_string': string,
                              'search_type': 'vendor'}).json()
        vendor_names = set(vendor['name'] for vendor in response)
        self.assertIn("Apple", vendor_names)
        self.assertIn("Samsung", vendor_names)

    def test_searching_nonexisting_vendors(self):
        """Searching a nonexisting vendor"""

        string = '_t_h_i_s_v_e_n_d_o_r_d_o_e_s_n_o_t_e_x_i_s_t'
        response = self.client.get('/search/', {'search_string': string,
                              'search_type': 'vendor'}).json()
        self.assertEqual(len(response), 0)

