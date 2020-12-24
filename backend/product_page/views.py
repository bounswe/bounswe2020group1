from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from product.models import Product, Image
from comment.models import Comment

def index(request):
    try:
        product_id = request.GET["id"]
    except:
        return HttpResponse('There is no valid Product ID.',status=400)
        
    product = Product.objects.filter(Q(id=product_id))
    if len(product) == 0:
        return HttpResponse('There is no such product.',status=400)
    else:
        product = product[0]
    
    static_url = "http://3.232.20.250/static/images/"
    images = Image.objects.filter(product=product)
    if(len(images) > 0):
        photo_url = f"{static_url}{images[0].photo}"
    else:
        photo_url = ""
        
    comments = Comment.objects.filter(Q(product=product))
    comments_of_product = []
    if len(comments) > 0:
        for comment in comments:
            comment_info = {"id": comment.pk,
                "customer": comment.customer.user.user.username,
                "text": comment.text,
                "rating": comment.rating
            }
        comments_of_product.append(comment_info)
    
    product_info = {"id": product.pk,
                "name": product.name,
                "description": product.description,
                "photo_url": photo_url,
                "vendor_name": product.vendor.user.user.first_name,
                "category": product.category.name,
                "rating": product.rating,
                "stock": product.stock,
                "price": product.price,
                "comments": comments_of_product
            }
                   
    return JsonResponse(product_info, safe=False)
