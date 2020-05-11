from flask import Flask,render_template,redirect

products = [
        {
            "name": "sneakers 1 ",
            "seller": "nike",
            "price": 36.99,
            "description": "nike ayakkabı",
            "id":0,
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
            "price": 39.99,
            "description": "adidas ayakkabı",
            "id":1,
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
    return redirect("/")

@app.route("/comment/<int:id>")
def comment(id):
    return render_template("commentpage.html",product = products[id])

if __name__ == "__main__":
    app.run(debug=True)

