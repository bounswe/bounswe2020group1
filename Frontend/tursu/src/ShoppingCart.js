import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "./NavBar";

import ProductList, {ProductListHorizontal} from "./ProductList";
import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Axios from "axios";
import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import 'fontsource-roboto';

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
    },
    summaryGrid: {
        padding: 30
    },
    summaryPaper:{
        height: 200,
        // marginLeft: 100,
        marginTop: 35,
        // marginBottom: 1,
        // width: 60,
    },
    text: {

    }
}));

const products = [
    {
        name: "Iphone 6",
        photo_url: "http://3.232.20.250/static/product/product_1.jpg",
        vendor_name: "Apple",
        price: "7999.99"
    },
    {
        name: "Iphone 6",
        photo_url: "http://3.232.20.250/static/product/product_1.jpg",
        vendor_name: "Apple",
        price: "7999.99"
    },
    {
        name: "Iphone 6",
        photo_url: "http://3.232.20.250/static/product/product_1.jpg",
        vendor_name: "Apple",
        price: "7999.99"
    }
];

export default function ShoppingCart(props){
    // var products = React.useState([])
    const classes = styles()

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
                <Grid item container direction="row">
                    {<ProductListHorizontal products={products}/>}
                    <Paper className={classes.summaryPaper}>
                        <Grid item className={classes.summaryGrid}>
                                <Typography variant="body2" gutterBottom align={"left"}>
                                    AMOUNT TO BE PAID
                                </Typography>
                                <Typography variant="h3" gutterBottom align={"left"}>
                                    599,90 ₺
                                </Typography>
                                <Button variant={"contained"} color="primary" size={"large"}>
                                    Complete Order
                                </Button>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
