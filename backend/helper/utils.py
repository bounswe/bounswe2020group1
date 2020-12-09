"""Utility functions for the system"""
import string
import random
from collections import Counter
from django.db.models import Count
from nltk.corpus import stopwords
from nltk import word_tokenize
from order.models import Order
from product.models import Product
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

def top_products():
    """Returns top 10 most ordered products"""
    products = Product.objects.all()
    top10 = products.annotate(num_orders=Count('order')).order_by('-num_orders')[:10]
    return top10
