from django.http import JsonResponse
from product.models import Product


def index(request):
    """Returns all products.

    GET parameters:
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
    product_data = Product.objects.all()
    products = []
    for product in product_data:
        product_info = {"id": product.pk,
                    "name": product.name,
                    "photo_url": "",    #TODO ADD PHOTO URL
                    "vendor_name": product.vendor.bio,
                    "category": product.category.name,
                    "rating": product.rating,
                    "stock": product.stock,
                    "price": product.price
                }
        products.append(product_info)

    return JsonResponse(products, safe=False)