import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Axios from "axios";
import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
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
    //console.log(props.order);
    var products = props.order;
    var totalprice = calculateTotalSum(products)


    return(
        <div>
            {products.map((product) => (
                <Product product={product}/>
            ))}
            <Summary price={totalprice}/>
        </div>
    );
}

function calculateTotalSum(products){
    var total_sum = 0;

    for(let i=0; i<products.length; i++){
        total_sum += parseFloat(products[i].product.price) * products[i].quantity
    }

    return total_sum;
}