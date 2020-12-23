"""Utility functions for the system"""
import string
import random
from collections import Counter
from django.db.models import Count
from nltk.corpus import stopwords
from nltk import word_tokenize
from order.models import Order
from product.models import Product, Image
from search.views import SearchHelper


def keyword_extractor(query):
    """ Keyword extractor function with stopword and punctuation removal """
    stop = set(stopwords.words('english') + list(string.punctuation))
    words = word_tokenize(query)
    keywords = [word for word in words if len(word)>1 and word not in stop]
    return keywords

def recommend_based_on_orders(customer):
    """Recommends products based on customers previous purchases"""
    orders = Order.objects.filter(customer=customer)
    products = [order.product for order in orders]
    keywords = []
    for product in products:
        keywords += keyword_extractor(product.name)
        keywords += keyword_extractor(product.description)
    word_count = Counter(keywords)
    most_freq = [word[0] for word in word_count.most_common(5)]
    query = " ".join(most_freq)
    recommended = SearchHelper.product_search(query)
    products = set(products)
    recommendation = []
    for product in recommended:
        if product not in products:
            recommendation.append(product.name)
    sample_size = min(10, len(recommendation))
    return random.sample(recommendation, k=sample_size)

def get_all_verified_products():
    products = Product.objects.filter(is_verified=True)
    return products

def bestseller_products():
    """Returns top 10 most ordered products"""
    products = get_all_verified_products()
    bestseller = products.annotate(num_orders=Count('order')).order_by('-num_orders')[:10]
    return bestseller

def top_rated_products():
    """Returns top 10 products with highest rating"""
    products = get_all_verified_products()
    top_rated = products.order_by('-rating')[:10]
    return top_rated

def newest_arrival_products():
    """Returns 10 products added most recently products"""
    products = get_all_verified_products()
    top10 = products.order_by('-date_added')[:10]
    return top10

def product_list_serializer(product_data):
    """Serializes the products for card views"""
    products = []
    static_url = "http://3.232.20.250/static/images/"
    for product in product_data:
        images = Image.objects.filter(product=product)
        if(len(images) > 0):
            photo_url = f"{static_url}{images[0].photo}"
        else:
            photo_url = ""
        product_info = {"id": product.pk,
                       "name": product.name,
                       "photo_url": photo_url,  
                       "vendor_name": product.vendor.user.user.first_name,
                       "category": product.category.name,
                       "rating": product.rating,
                       "stock": product.stock,
                       "price": product.price,
                       "brand": product.brand,
                    }
        products.append(product_info)
    return products
