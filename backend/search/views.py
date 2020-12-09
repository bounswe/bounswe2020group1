""" Search endpoint and helper functions """
import string
import requests
from django.http import HttpResponse, JsonResponse
from django.db.models import Q
import nltk
from nltk.corpus import stopwords
from nltk import word_tokenize
from product.models import Product, Image
from registered_user.models import Vendor
from filter_sort.utils import product_filter, product_sort

nltk.download("punkt")
nltk.download("stopwords")

class SearchHelper:
    """ Helper class for search functionalities """

    @staticmethod
    def get_semantically_similar_words(words):
        """ Returns semantically similar keywords for given words """
        query = "+".join(words)
        url = f"https://api.datamuse.com/words?ml={query}"
        response = requests.get(url).json()
        nouns_in_response = [word for word in response if "tags" in word and word["tags"] == ["n"]]
        keywords = [word["word"] for word in nouns_in_response[:10]]
        return keywords

    @staticmethod
    def keyword_extractor(query):
        """ Keyword extractor function with stopword and punctuation removal """
        stop = set(stopwords.words('english') + list(string.punctuation))
        words = word_tokenize(query)
        keywords = [word for word in words if len(word)>1 and word not in stop]
        try:
            keywords += SearchHelper.get_semantically_similar_words(keywords)
        except (ConnectionError, KeyError):
            pass
        return keywords

    @staticmethod
    def product_search(search_string):
        """ Searching function to search products with a string """
        keywords = SearchHelper.keyword_extractor(search_string)
        if len(keywords) == 0:
            data = Product.objects.none()
        else:
            query = Q()
            for word in keywords:
                query |= Q(name__icontains=word) | \
                        Q(description__icontains=word) | \
                        Q(category__name__icontains=word) | \
                        Q(vendor__user__user__first_name__icontains=word)
            data = Product.objects.filter(query)
        return data

    @staticmethod
    def prepare_products(data):
        """ Function to prepare the response for product search """
        products = []
        static_url = "http://3.232.20.250/static/images/" # TODO Move this to conf
        for product in data:
            images = Image.objects.filter(product=product)
            if len(images) > 0:
                photo_url = f"{static_url}{images[0].photo}"
            else:
                photo_url = ""
            product_info ={"id": product.pk,
                           "name": product.name,
                           "photo_url": photo_url,
                           "vendor_name": product.vendor.user.user.first_name,
                           "category": product.category.name,
                           "rating": product.rating,
                           "stock": product.stock,
                           "price": product.price
                        }
            products.append(product_info)
        return products

    @staticmethod
    def vendor_search(search_string):
        """ Searching function to search vendors with a string """
        keywords = SearchHelper.keyword_extractor(search_string)
        if len(keywords) == 0:
            data = Vendor.objects.none()
        query = Q()
        for word in keywords:
            query |= Q(user__user__first_name__icontains=word)
        data = Vendor.objects.filter(query)
        vendors = []
        for vendor in data:
            if vendor.location:
                location = f"Latitude: {vendor.location.latitude}, " \
                           f"Longitude: {vendor.location.longitude}"
            else:
                location = ""
            vendor_info ={"name": vendor.user.user.first_name,
                          "username": vendor.user.user.username,
                          "location": location,
                          "is_verified": vendor.is_verified,
                          "rating": vendor.rating
                        }
            vendors.append(vendor_info)
        return vendors


def index(request):
    """Returns searched products when GET request is made.

    GET parameters:
        search_string -- the search string to be used for querying
        search_type -- "vendor" if searching for vendors, "product" if searching for products
    Response format: JSON
    Response: List[dict]: List of product dictionaries with product information including
        - id
        - name
        - photo_url
        - vendor_name
        - category
        - rating
        - stock
        - price
    """
    try:
        search_string = request.GET["search_string"]
    except KeyError:
        return JsonResponse([], safe=False)
    try:
        search_type = request.GET["search_type"]
    except KeyError:
        return HttpResponse('Select search_type as vendor or product to search',status=400)
    if search_type == "product":
        searched_products = SearchHelper.product_search(search_string)
        filtered_products = product_filter(request, searched_products)
        sorted_products = product_sort(request, filtered_products)
        products =  SearchHelper.prepare_products(sorted_products)
        return JsonResponse(products, safe=False)
    elif search_type == "vendor":
        vendors = SearchHelper.vendor_search(search_string)
        return JsonResponse(vendors, safe=False)
    else:
        return HttpResponse('Select search_type as vendor or product to search',status=400)
