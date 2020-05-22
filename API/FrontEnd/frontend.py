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
            "name": "Pear Notebook",
            "seller": "Pear Company",
            "price": {"try": 9999, "usd": 1499, "eur": 1349},
            "description": "A great Pear-Book by Pear-Company",
            "id":2,
            "url":"http://www.pxleyes.com/images/contests/eaten-pear/fullsize/Laptop-4cbb25ed1f437_hires.jpg",
            "comments":[
                {
                "name": "Onur",
                "comment": "awesome"
            },
            {
                "name": "Buse",
                "comment": "PearOS is not that great but the design is cute."
            },
            ]
        },
        {
            "name": "Book - The Stranger by Albert Camus",
            "seller": "Book Shop",
            "price": {"try": 30, "usd": 6, "eur": 5},
            "description": "A must-read book that is Winner of the Nobel Prize for Literature in 1957, by the existentialist Albert Camus",
            "id":3,
            "url":"https://thebadbread.files.wordpress.com/2015/05/img_0357.jpg",
            "comments":[
                {
                "name": "Asena",
                "comment": "One of the greatest books I have ever read."
            },
            {
                "name": "Omer",
                "comment": "It took a week for the book to arrive but the book itself is great."
            },
            ]
        },
        {
            "name": "Book - Animal Farm by George Orwell",
            "seller": "Book Shop",
            "price": {"try": 42, "usd": 7, "eur": 6},
            "description": "A well-written allegorical story about communism.",
            "id":4,
            "url":"https://thegirlsguidetoreading.files.wordpress.com/2016/08/animal-farm.jpg?w=620",
            "comments":[
                {
                "name": "Ali",
                "comment": "A great way to learn about history."
            },
            {
                "name": "Baris",
                "comment": "Really liked the book, thanks book shop."
            },
            ]
        },
        {
            "name": "Gamer Notebook",
            "seller": "Gamer PC Company",
            "price": {"try": 7999, "usd": 1399, "eur": 1199},
            "description": "The best notebook for true gamers.",
            "id":5,
            "url":"https://productimages.hepsiburada.net/s/21/460/9915438825522.jpg",
            "comments":[
                {
                "name": "Murat",
                "comment": "This notebook is awesome for gaming."
            },
            {
                "name": "Baris",
                "comment": "I'd rather have a Pear Notebook but the this pc is very good given that it is cheaper."
            },
            ]
        },
        {
            "name": "Black Study Lamp",
            "seller": "Lamp Shop",
            "price": {"try": 200, "usd": 40, "eur": 30},
            "description": "A high-quality black lamp for studying.",
            "id":6,
            "url":"https://images-na.ssl-images-amazon.com/images/I/71XHyGiUx8L._SL1500_.jpg",
            "comments":[
                {
                "name": "Ufuk",
                "comment": "Good lighting."
            },
            {
                "name": "Yagiz",
                "comment": "Nice lamp."
            },
            ]
        },
        {
            "name": "Blue Study Lamp",
            "seller": "Lamp Shop",
            "price": {"try": 260, "usd": 45, "eur": 32},
            "description": "A high-quality blue lamp for studying.",
            "id":7,
            "url":"https://www.ulcdn.net/images/products/157429/original/Otto_Study_Lamp_Naturals_LP.jpg?1508734517",
            "comments":[
                {
                "name": "Buse",
                "comment": "Very good."
            },
            {
                "name": "Mehmet",
                "comment": "A nice design."
            },
            ]
        },
        {
            "name": "Blue Towel",
            "seller": "Towel Shop",
            "price": {"try": 84, "usd": 14, "eur": 12},
            "description": "Soft, blue bath towels.",
            "id":8,
            "url":"https://productimages.hepsiburada.net/s/27/460/10183423295538.jpg",
            "comments":[
                {
                "name": "Onur",
                "comment": "Not worth the high price."
            },
            {
                "name": "Omer",
                "comment": "The color is really nice."
            },
            ]
        },
        {
            "name": "Black and White Towel",
            "seller": "Towel Shop",
            "price": {"try": 120, "usd": 20, "eur": 18},
            "description": "Soft, black and white bath towels.",
            "id":9,
            "url":"https://cb2.scene7.com/is/image/CB2/LenaBathTowelGroupFHF19",
            "comments":[
                {
                "name": "Ali",
                "comment": "The delivery was late."
            },
            {
                "name": "Murat",
                "comment": "The quality of the product is good."
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

