import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "./NavBar";

import ProductList, {ProductListHorizontal} from "./ProductList";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import Axios from "axios";

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

const products = [
    {
        name: "aa",
        photo_url: "http://3.232.20.250/static/product/product_1.jpg",
        vendor_name: "Apple",
        price: "7999.99"
    },
    {
        name: "aa",
        photo_url: "http://3.232.20.250/static/product/product_1.jpg",
        vendor_name: "Apple",
        price: "7999.99"
    },
    {
        name: "aa",
        photo_url: "http://3.232.20.250/static/product/product_1.jpg",
        vendor_name: "Apple",
        price: "7999.99"
    }
];

class Category extends React.Component{
    state = {
        products : []
    }

    render(){
        return(
            <ThemeProvider theme={theme} >
                <Grid container spacing={15} direction="column" className="HomePage">
                    <Grid item xs={12}>
                        <Paper>
                            <Navbar />
                        </Paper>
                    </Grid>
                    <h1>
                        Shopping Cart
                    </h1>
                    <Grid item xs={12} container>
                        {<ProductListHorizontal products={products}/>}
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

export default Category;
