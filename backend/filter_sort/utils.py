""" Utility functions for filtering and sorting products """

from django.db.models import Q, Count

def product_filter(request, products):
    """ Filters products according to the request parameters """

    query = Q(is_verified=True)
    try:
        rating = int(request.GET["frating_gte"])
        query &= Q(rating__gte=rating)
    except (KeyError, ValueError):
        pass

    try:
        categories = request.GET["fcategory"]
        category_filter = Q()
        for category in categories.split("|"):
            category_filter |= Q(category__name__iexact=category)
        query &= category_filter
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
        vendor_names = request.GET["fvendor_name"]
        vendor_filter = Q()
        for vendor_name in vendor_names.split("|"):
            vendor_filter |= Q(vendor__user__user__first_name__iexact=vendor_name)
        query &= vendor_filter
    except KeyError:
        pass
    try:
        brands = request.GET["fbrand"]
        brand_filter = Q()
        for brand in brands.split("|"):
            brand_filter |= Q(brand__iexact=brand)
        query &= brand_filter
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
