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
    if(vendor is None or not vendor.is_verified):
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

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def edit_product(request):
    """Edits product with given parameters when POST request is made."""
    vendor = get_vendor_from_request(request)
    if(vendor is None or not vendor.is_verified):
        return HttpResponse("Vendor authentication failed", status=401)
    message = ""
    try:
        product_id = request.POST["id"]
    except Exception:
        return HttpResponse("Product id not specified", status=400)
    try:
        product = Product.objects.get(id=product_id)
    except Exception:
        return HttpResponse("There is no such product with the id", status=400)
    if(vendor != product.vendor):
        return HttpResponse("You cannot edit products of other vendors", status=401)
    try:
        category = Category.objects.get(name=request.POST["category"])
        product.category = category
        message += "Category, "
    except Exception:
        pass
    try:
        name = request.POST["name"]
        product.name = name
        message += "name, "
    except KeyError:
        pass
    try:
        brand = request.POST["brand"]
        product.brand = brand
        message += "brand, "
    except KeyError:
        pass
    try:
        description = request.POST["description"]
        product.description = description
        message += "description, "
    except KeyError:
        pass

    try:
        stock = int(request.POST["stock"])
        product.stock = stock
        message += "stock, "
    except (KeyError, ValueError):
        pass
    try:
        price = float(request.POST["price"])
        product.price = price
        message += "price "
    except (KeyError, ValueError):
        pass
    try:
        product.save()
        message += "fields updated."
    except Exception:
        return HttpResponse("Product couldn't be created with current params", status=400)
    try:
        form = ImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            image = Image.objects.create(product=product)
            image.photo = form.cleaned_data["photo"]
            image.save()
    except Exception:
        pass
    return HttpResponse(message)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['DELETE'])
def delete_product(request):
    """Delete product with given parameters when DELETE request is made."""
    vendor = get_vendor_from_request(request)
    if(vendor is None or not vendor.is_verified):
        return HttpResponse("Vendor authentication failed", status=401)
    try:
        product_id = request.POST["id"]
    except KeyError:
        return HttpResponse("Product id not specified", status=400)
    try:
        product = Product.objects.get(id=product_id)
    except Exception:
        return HttpResponse("There is no such product with the id", status=400)
    if(vendor != product.vendor):
        return HttpResponse("You cannot delete products of other vendors", status=401)
    else:
        product.delete()
    return HttpResponse("success")
