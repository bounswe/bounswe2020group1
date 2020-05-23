"""
@author:barismutlu
routes_addproduct.py
"""

from flask import Blueprint, abort, jsonify, request, render_template, url_for

from .db import get_db

bp = Blueprint('Add Product API', __name__, url_prefix='/product', template_folder="../frontend")

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

@bp.route('/product/<int: productId>/', methods=['POST'])

def addproduct(productId):
    
        if 'name' not in request.form or 'price' not in request.form or 'location' not in request.form or 'description' not in request.form:
            abort(400)

        name = request.form['name']
        price = request.form['price']
        location = request.form['location']
        description = request.form['description']
        
       
        db = get_db();
        db.execute("insert into Products values("\'" + name + "\', " + str(productId) + "," + "\'" + price + "\',\'"+ location + "\',\'" + description "\')")
        db.commit()

        return redirect(url_for('addproduct', productId = productId))
