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
    var product = props.order
    var product_info = {}
    for(var i=0; i<props.product_list.length; i++){
        if (props.order.product==props.product_list[i].id){
            product_info = props.product_list[i];
            break;
        }
    }
    return(
        <div>
            <Product product={product} product_info={product_info}/>
        </div>
    );
}
