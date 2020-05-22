"""

@author:muratekici

routes_product.py

"""

from flask import Blueprint, abort, jsonify, request, render_template, url_for

from .db import get_db

bp = Blueprint('Product Page API', __name__, url_prefix='/product', template_folder="../frontend")

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

@bp.route('/product/<productId>', methods=["GET","POST"])
def product_page (productId):
    
    if request.method == "GET":

        products = query_db('select * from Product where id=' + productId)

        product_list = []
        for product in products:
            comments = query_db('select * from Comment where productID=' + productId)
            comment_list = []
            for comment in comments:
                comment_list.append(comment)

            product_dict = {"id": product["id"],
                            "name": product["name"],
                            "price": product["price"],
                            "description": product["description"],
                            "location": product["location"],
                            "comments": comment_list
                            }
            product_list.append(product_dict)

        if len(product_list) != 1:
            return abort(400)
       
        return render_template("product.html", product=product_list[0])

    else:
        
        if 'author' not in request.form or 'commentText' not in request.form:
            abort(400)

        author = request.form['author']
        commentText = request.form['commentText']
       
        db = get_db();
        db.execute("insert into Comments values(\'" + author + "\', " + str(productId) + "," + "\'" + commentText + "\')")
        db.commit()

        return redirect(url_for('product_page', productId = productId))
