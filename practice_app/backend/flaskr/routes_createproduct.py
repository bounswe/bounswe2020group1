"""
@author:barismutlu
routes_addproduct.py
"""

from flask import redirect, Blueprint, abort, jsonify, request, render_template
from . import db
from . import bad_word_filter_api
from . import location_api

createproduct_bp = Blueprint('Create Product Routes', __name__)


@createproduct_bp.route('/createproduct/', methods=['POST', 'GET'])
def createproduct():

	location = str(location_api.get_location_of_a_specific_ip(request.headers.get('X-Forwarded-For', request.remote_addr)))


	if request.method == "POST":

		form_values = dict(request.form)

		if 'name' not in form_values or 'seller' not in form_values or 'price' not in form_values or 'description' not in form_values or 'url' not in form_values:
			return "invalid or missing information"

		name = form_values['name']
		seller = form_values['seller']
		price = form_values['price']
		location = str(location_api.get_location_of_a_specific_ip(request.headers.get('X-Forwarded-For', request.remote_addr)))
		description = form_values['description']
		image_url = form_values['url']

		if price.isnumeric() == False:
			return "invalid price"

		if bad_word_filter.is_comment_inapporiate(description) == True:
			return "Description contains inapporiate words"

		price = int(price)

		cur = db.get_db();
		cur.execute("insert into Product (name, seller, price, description, location, url) values(?, ?, ?, ?, ?, ?)", (name, seller, price, description, location, image_url))
		cur.commit()

		return redirect("/")

	return render_template("create_product.html")

