"""

@author:muratekici

routes_product.py

"""

from flask import Blueprint, abort, jsonify, request, render_template
from . import db
from . import exchange_rate_api as currency
from . import bad_word_filter

product_bp = Blueprint('Product Routes', __name__)

def query_db(query, args=(), one=False):
    cur = db.get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

@product_bp.route('/product/<productId>', methods=["GET","POST"])
def get_product(productId):
        
    if request.method == "POST":

        form_values = dict(request.form)
        print(form_values)

        if 'name' not in form_values or 'comment' not in form_values:
            abort(400)

        author = form_values['name']
        commentText = form_values['comment']

        if bad_word_filter.is_comment_inapporiate(commentText) == True:
            return "Comment you are trying to post contains inapporiate words"
       
        if bad_word_filter.is_comment_inapporiate(author) == True:
            return "Comment you are trying to post contains inapporiate words"
       
        cur = db.get_db();
        cur.execute("insert into Comment (author, productID, commentText) values(?, ?, ?)", (author, productId, commentText))
        cur.commit()
   
    products = query_db('select * from Product where id=?', productId)

    product_list = []
    for product in products:
        comments = query_db('select * from Comment where productID=?', productId)
        comment_list = []
        for comment in comments:
            comment_list.append({
                    "name": comment["author"],
                    "comment": comment["commentText"]
                })

        prices = currency.prices_in_currencies(product["price"])

        price_try = round(prices["TRY"], 1)
        price_usd = round(prices["USD"], 1)
        price_eur = round(prices["EUR"], 1) 
        
        product_dict = {"id": product["id"],
                        "name": product["name"],
                        "price": {
                            "try": price_try,
                            "usd": price_usd,
                            "eur": price_eur
                        },
                        "seller": product["seller"],
                        "description": product["description"],
                        "location": product["location"],
                        "comments": comment_list
                        }
        product_list.append(product_dict)

    if len(product_list) != 1:
        return abort(400)

    return render_template("product.html", product=product_list[0])
