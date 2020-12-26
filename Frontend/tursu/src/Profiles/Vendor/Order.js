import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Axios from "axios";
import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
//import 'fontsource-roboto';
import axios from "axios";
import Product from "./Product.js";
import Summary from "./Summary.js";

const theme = createMuiTheme({
    palette:{
        primary:{
            main: "#388e3c",
        },
        secondary:{
            main: "#81c784",
        }
    }
})

const styles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginLeft: 150,
    },
    summaryGrid: {
        padding: 30
    },
    summaryPaper:{
        height: 175,
        // marginLeft: 100,
        marginTop: 35,
        // marginBottom: 1,
        // width: 60,
    },
    product:{
        margin: 1
    },
}));



export default function Order(props){
    const classes = styles()
    const products = [
        {
            name: "Iphone 6",
            photo_url: "http://3.232.20.250/static/product/product_1.jpg",
            vendor_name: "Apple",
            price: "7999.99",
            comment: "jfdhjhgdj"
        },
       {
            name: "Iphone 6",
            photo_url: "http://3.232.20.250/static/product/product_1.jpg",
            vendor_name: "Apple",
            price: "7999.99",
            comment: ""
        },
        {
            name: "Iphone 6",
            photo_url: "http://3.232.20.250/static/product/product_1.jpg",
            vendor_name: "Apple",
            price: "7999.99",
            comment: "fgdgj"
        }
    ];
    const order = {
        number: "3",
        totalprice: "3546256.67",
        date: "19.12.2020",
        status: "Delivered"
    }


    return(
        <div>
            {products.map((product) => (
                <Product product={product}/>
            ))}
            <Summary order={order}/>
        </div>
    );
}

function calculateTotalSum(products){
    var total_sum = 0;

    for(let i=0; i<products.length; i++){
        total_sum += parseInt(products[i].product.price) * products[i].quantity
    }

    return total_sum;
}