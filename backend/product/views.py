"""Views related to product"""
from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django import forms
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from product.models import Product, Category, Image
from registered_user.models import get_vendor_from_request



def category(request):
    """Returns filtered products by category when GET request is made.

    GET parameters:
        name -- name of the categry
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
        category_name = request.GET["name"]
    except:
        return JsonResponse([], safe=False)

    product_data = []
    if category_name == "":
        product_data = Product.objects.all()
    else:
        category_data = Category.objects.filter(Q(name=category_name))
        if len(category_data) == 1 and category_data[0].name == category_name:
            category_id = category_data[0].id
            product_data = Product.objects.filter(category=category_id)

    products = []
    static_url = "http://3.232.20.250/static/" # TODO Move this to conf
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
                       "price": product.price
                    }
        products.append(product_info)

    return JsonResponse(products, safe=False)

class ImageUploadForm(forms.Form):
    """Image upload form."""
    photo = forms.ImageField()

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def add_product(request):
    """Adds product with given parameters when POST request is made."""
    vendor = get_vendor_from_request(request)
    if(vendor is None):
        return HttpResponse("Vendor authentication failed", status=401)
    try:
        category = Category.objects.get(name=request.POST["category"])
    except Exception:
        return HttpResponse("Invalid category", status=400)
    try:
        name = request.POST["name"]
        brand = request.POST["brand"]
        description = request.POST["description"]
    except KeyError:
        return HttpResponse("Name, brand or description not given.", status=400)
    rating = -1
    try:
        stock = int(request.POST["stock"])
        price = float(request.POST["price"])
    except (KeyError, ValueError):
        return HttpResponse("Stock or price Invalid", status=400)
    try:
        product = Product.objects.create(
            vendor=vendor,
            category=category,
            name=name,
            description=description,
            rating=rating,
            stock=stock,
            price=price,
            brand=brand
            )
        product.save()
    except Exception:
        return HttpResponse("Product couldn't be created with current params", status=400)
    form = ImageUploadForm(request.POST, request.FILES)
    try:
        if form.is_valid():
            image = Image.objects.create(product=product)
            image.photo = form.cleaned_data["photo"]
            image.save()
    except Exception:
        pass
    return HttpResponse("success")
