import React, { Component} from 'react';
import OfferedProduct from "./OfferedProduct"


export default class myProducts extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }

    }

    render() {
    const products = [
        {
            name: "Iphone 6",
            photo_url: "http://3.232.20.250/static/product/product_1.jpg",
            price: "7999.99",
            description: "The newest iPhone on the market for the lowest price!",
            category: "Electronics",
            stock: "15"
        },
       {
            name: "Iphone 6",
            photo_url: "http://3.232.20.250/static/product/product_1.jpg",
            price: "7999.99",
            description: "The newest iPhone on the market for the lowest price!",
            category: "Electronics",
            stock: "15"
        },
        {
            name: "Iphone 6",
            photo_url: "http://3.232.20.250/static/product/product_1.jpg",
            price: "7999.99",
            description: "The newest iPhone on the market for the lowest price!",
            category: "Electronics",
            stock: "15"
        }
    ];
        return(
            <div>
                {products.map((product) => (
                    <OfferedProduct product={product}/>
                ))}
            </div>
        )


    }
}
