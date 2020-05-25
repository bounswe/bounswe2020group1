from flask import Blueprint, abort, jsonify, request, render_template
import json

from .db import query_db
from .find_similar_words_API import get_words_with_similar_meaning


bp = Blueprint('Product API Search', __name__, url_prefix='/', template_folder="templates")


@bp.route('/search/', methods=['GET'])
def search():
    keyword = request.args.get('keyword')
    if(keyword is not None and keyword !=""):
        keyword.replace("+"," ")
        semantically_close = get_words_with_similar_meaning(keyword)[:20] # Getting 20 most semantically related words for search
        search_words = [keyword] + semantically_close
        all_products = query_db('select * from product')
        product_list = []
        for product in all_products:
        	for word in search_words:
        		if(word in product["name"] or word in product["description"]):
        			product_dict = {"id": product["id"],
        							"name": product["name"],
                                    "seller": product["seller"],
        							"price": product["price"],
        							"description": product["description"],
        							"location": product["location"],
                                    "url": product["url"]
        							}
        			product_list.append(product_dict)
        			break
    else:
        product_list = []

    if(request.args.get('json') == "True"):
        return json.dumps(product_list)
    else:   
        return render_template("home.html", products=product_list)
