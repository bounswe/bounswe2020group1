from flask import Flask,render_template,redirect

products = [
        {
            "name": "sneakers 1 ",
            "seller": "nike",
            "price": {"try": 30, "usd": 210, "eur": 225},
            "description": "nike ayakkabı",
            "id":0,
            "url":"https://images.unsplash.com/photo-1580232942837-906fc331cd99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80",
            "comments":[
                {
                "name": "ufuk",
                "comment": "cok iyi"
            },
            {
                "name": "yagiz",
                "comment": "iyi"
            },
            ]
        },
        {
            "name": "sneakers 2 ",
            "seller": "adidas",
            "price": {"try": 40, "usd": 280, "eur": 300},
            "description": "adidas ayakkabı",
            "id":1,
            "url":"https://images.unsplash.com/photo-1581327512014-619407b6a116?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=829&q=80",
            "comments":[
                {
                "name": "asena",
                "comment": "cok iyi"
            },
            {
                "name": "mehmet",
                "comment": "iyi"
            },
            ]
        },
        {
            "name": "sneakers 1 ",
            "seller": "nike",
            "price": {"try": 30, "usd": 210, "eur": 225},
            "description": "nike ayakkabı",
            "id":0,
            "url":"https://images.unsplash.com/photo-1580232942837-906fc331cd99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80",
            "comments":[
                {
                "name": "ufuk",
                "comment": "cok iyi"
            },
            {
                "name": "yagiz",
                "comment": "iyi"
            },
            ]
        },
        {
            "name": "sneakers 2 ",
            "seller": "adidas",
            "price": {"try": 40, "usd": 280, "eur": 300},
            "description": "adidas ayakkabı",
            "id":1,
            "url":"https://images.unsplash.com/photo-1581327512014-619407b6a116?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=829&q=80",
            "comments":[
                {
                "name": "asena",
                "comment": "cok iyi"
            },
            {
                "name": "mehmet",
                "comment": "iyi"
            },
            ]
        }
]

app = Flask(__name__)

@app.route("/")
@app.route("/home")
def home():
    return render_template("home.html",products = products)

@app.route("/createproduct")
def create():
    return render_template("create_product.html")

@app.route("/product/<int:id>")
def comment(id):
    return render_template("product_page.html",product = products[id])

@app.route("/deneme")
def deneme():
    return render_template("layout.html")

if __name__ == "__main__":
    app.run(debug=True)

