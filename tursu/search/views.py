from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.core import serializers
from django.db.models import Q
from product.models import Product, Category


# Test view
def index(request):
	try:
		search_string = request.GET["search_string"]
	except :
		return JsonResponse([], safe=False)
	try:
		search_type = request.GET["search_type"]
	except :
		return HttpResponse('Select search_type as vendor or product to search',status=400)

	if(search_type == "product"):
		data = Product.objects.filter(Q(name__contains=search_string)|Q(description__contains=search_string)|
									Q(category__name__contains=search_string) | Q(vendor__bio__contains=search_string))
	elif(search_type == "vendor"):
		raise NotImplementedError("Vendor search is not yet implemented")
	else:
		return HttpResponse('Select search_type as vendor or product to search',status=400)


	products = []
	for product in data:
		product_info ={"id": product.pk,
					   "name": product.name,
					   "photo_url": "", 	#TODO ADD PHOTO URL
					   "vendor_name": product.vendor.bio,
					   "category": product.category.name,
					   "rating": product.rating,
					   "stock": product.stock,
					   "price": product.price
					   }


		products.append(product_info)
	return JsonResponse(products, safe=False)

#def future_index(request):
#	try:
#		search_string = request.GET["search_string"]
#	except :
#		return JsonResponse([], safe=False)
#	try:
#		search_type = request.GET["search_type"]
#	except :
#		return HttpResponse('Select search_type as vendor or product to search',status=400)
#
#	if(search_type == "product"):
#		data = Product.objects.filter(Q(name__contains=search_string)|Q(description__contains=search_string)|
#									Q(category__name__contains=search_string) | Q(vendor__bio__contains=search_string))
#		products = []
#		for product in data:
#			product_info ={"id": product.pk,
#						   "name": product.name,
#						   "photo_url": "", 	#TODO ADD PHOTO URL
#						   "vendor_name": product.vendor.bio,
#						   "category": product.category.name,
#						   "rating": product.rating,
#						   "stock": product.stock,
#						   "price": product.price
#						   }
#
#
#			products.append(product_info)
#		# TODO Filtering
#		return JsonResponse(products, safe=False)
#
#	elif(search_type == "vendor"):
#		raise NotImplementedError("Vendor search is not yet implemented")
#	else:
#		return HttpResponse('Select search_type as vendor or product to search',status=400)


	
