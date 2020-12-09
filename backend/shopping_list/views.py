"""Views related to shopping list"""
from django.http import JsonResponse, HttpResponse
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from shopping_list.models import ProductLists, ListedProducts
from product.models import Product, Image
from registered_user.models import get_customer_from_request

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def create_shopping_list(request):
    """Create shopping list with given name"""
    customer = get_customer_from_request(request)
    if customer is None:
        return HttpResponse("Customer authentication failed", status=401)
    try:
        name = request.POST["list_name"]
    except KeyError:
        return HttpResponse("List name not given", status=400)
    try:
        product_list = ProductLists.objects.get(name=name, customer=customer)
        return HttpResponse("List with name already exists", status=400)
    except Exception:
        pass
    product_list = ProductLists.objects.create(name=name, customer=customer)
    product_list.save()
    return HttpResponse("List created successfully")

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['DELETE'])
def delete_shopping_list(request):
    """Delete shopping list with given name"""
    customer = get_customer_from_request(request)
    if customer is None:
        return HttpResponse("Customer authentication failed", status=401)
    try:
        name = request.POST["list_name"]
    except KeyError:
        return HttpResponse("List name not given", status=400)
    try:
        product_list = ProductLists.objects.get(name=name, customer=customer)
        product_list.delete()
    except Exception:
        return HttpResponse("Can't delete list because it doesn't exist", status=400)
    return HttpResponse("List successfully deleted")

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def add_product_to_shopping_list(request):
    """Add product with id to the shopping list with given name"""
    customer = get_customer_from_request(request)
    if customer is None:
        return HttpResponse("Customer authentication failed", status=401)
    try:
        product_id = int(request.POST["product_id"])
    except (KeyError, ValueError):
        return HttpResponse("Product id (product_id) not given", status=400)
    try:
        name = request.POST["list_name"]
    except KeyError:
        return HttpResponse("List name not given", status=400)
    try:
        product_list = ProductLists.objects.get(name=name, customer=customer)
    except Exception:
        return HttpResponse("Customer doesn't have a list with given name", status=400)

    try:
        product = Product.objects.get(id=product_id)
    except Exception:
        return HttpResponse("There is no such product with given id", status=400)
    try:
        listing = ListedProducts.objects.create(product_list=product_list, product=product)
        listing.save()
    except Exception:
        return HttpResponse("Product with the id is already in the list", status=400)
    return HttpResponse("Product is added to the list successfully!")


@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['DELETE'])
def delete_product_from_shopping_list(request):
    """Delete product with id from the shopping list with given name"""
    customer = get_customer_from_request(request)
    if customer is None:
        return HttpResponse("Customer authentication failed", status=401)
    try:
        product_id = int(request.POST["product_id"])
    except (KeyError, ValueError):
        return HttpResponse("Product id (product_id) not given", status=400)
    try:
        name = request.POST["list_name"]
    except KeyError:
        return HttpResponse("List name not given", status=400)
    try:
        product_list = ProductLists.objects.get(name=name, customer=customer)
    except Exception:
        return HttpResponse("Customer doesn't have a list with given name", status=400)

    try:
        product = Product.objects.get(id=product_id)
    except Exception:
        return HttpResponse("There is no such product with given id", status=400)
    try:
        listing = ListedProducts.objects.get(product_list=product_list, product=product)
        listing.delete()
    except Exception:
        return HttpResponse("Product with the id is not in the list", status=400)
    return HttpResponse("Product is deleted from the list successfully!")

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET'])
def get_shopping_lists_of_customer(request):
    """Get shopping lists of the current customer"""
    customer = get_customer_from_request(request)
    if customer is None:
        return HttpResponse("Customer authentication failed", status=401)
    lists = [product_list.name for product_list in ProductLists.objects.filter(customer=customer)]
    return JsonResponse(lists, safe=False)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def get_products_from_shopping_list(request):
    """Get products from shopping list with given name"""
    customer = get_customer_from_request(request)
    if customer is None:
        return HttpResponse("Customer authentication failed", status=401)
    try:
        name = request.POST["list_name"]
    except KeyError:
        return HttpResponse("List name not given", status=400)
    try:
        product_list = ProductLists.objects.get(name=name, customer=customer)
    except Exception:
        return HttpResponse("Customer doesn't have a list with given name", status=400)
    list_products =[listing.product for listing in
                     ListedProducts.objects.filter(product_list=product_list)]
    products = []
    static_url = "http://3.232.20.250/static/images/" # TODO Move this to conf
    for product in list_products:
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
                       "price": product.price,
                       "brand": product.brand
                    }
        products.append(product_info)
    return JsonResponse(products, safe=False)
