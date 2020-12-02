""" Utility functions for filtering and sorting products """

from django.db.models import Q, Count

def product_filter(request, products):
    """ Filters products according to the request parameters """

    query = Q()
    try:
        rating = int(request.GET["frating_gte"])
        query &= Q(rating__gte=rating)
    except (KeyError, ValueError):
        pass

    try:
        category = request.GET["fcategory"]
        query &= Q(category__name__iexact=category)
    except KeyError:
        pass

    try:
        price_lower = float(request.GET["fprice_lower"])
    except (KeyError, ValueError):
        price_lower = 0

    try:
        price_upper = float(request.GET["fprice_upper"])
    except (KeyError, ValueError):
        price_upper = float("inf")
    query &=  Q(price__range=(price_lower, price_upper))

    try:
        vendor_name = request.GET["fvendor_name"]
        query &= Q(vendor__user__user__first_name__iexact=vendor_name)
    except KeyError:
        pass
    try:
        brand = request.GET["fbrand"]
        query &= Q(brand__iexact=brand)
    except KeyError:
        pass
    return products.filter(query)

def product_sort(request, products):
    """ Sorts products according to the request parameter """

    try:
        sort_type = request.GET["sort_by"]
    except KeyError:
        return products
    if sort_type == "bestseller":
        sorted_products = products.annotate(num_orders=Count('order')).order_by('-num_orders')
    elif sort_type == "newest":
        sorted_products = products.order_by('-date_added')
    elif sort_type == "priceAsc":
        sorted_products = products.order_by('price')
    elif sort_type == "priceDesc":
        sorted_products = products.order_by('-price')
    elif sort_type == "rating":
        sorted_products = products.order_by('-rating')
    elif sort_type == "numComments":
        sorted_products = products.annotate(
                                num_comments=Count('comment',
                                filter=~Q(comment__text=""))).order_by('-num_comments')
    else:
        sorted_products = products
    #    raise ValueError("sort type is wrong")
    return sorted_products
