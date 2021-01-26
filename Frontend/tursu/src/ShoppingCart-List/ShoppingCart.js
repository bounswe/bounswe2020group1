import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "../NavigationBar/NavBar";
import { Link } from "react-router-dom";
import ProductList, {ProductListHorizontal} from "../Product/ProductList";
import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Axios from "axios";
import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Box from "@material-ui/core/Box";
import Footer from "../Footer/Footer";

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
        height: 175,
        // marginLeft: 100,
        marginTop: 35,
        // marginBottom: 1,
        // width: 60,
    },
}));

const ahmet = [
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

    const [products,setProducts] = useState([]);
    const [totalSum, setTotalSum] = useState(0);

    //ComponentDidMount
    useEffect(() => {
        axios.get("http://3.232.20.250/shoppingcart/all",{
            headers: {
                'Authorization': "Token " + window.sessionStorage.getItem("authToken")
            }
        }).then(res =>{
            console.log("PRODUCTS IN THE SHOPPING CART")
            console.log(res.data);
            setProducts(res.data)
            setTotalSum(calculateTotalSum(res.data))
        })
    }, [])

    function onCountChange(change, price){
        setTotalSum(parseInt(totalSum) + (change * parseInt(price)) )
    }

    return(
        <ThemeProvider theme={theme} >
            <Grid container spacing={15} direction="column" className="HomePage">
                <Grid item xs={12}>
                    <Paper>
                        <Navbar />
                    </Paper>
                </Grid>
                <Typography >
                    <Box fontWeight={"fontWeightBold"}  fontStyle="italic">
                       Shopping Cart
                    </Box>
                </Typography>
                <Grid item container direction="row">
                    {<ProductListHorizontal products={products} onCountChange={onCountChange}/>}
                    <Paper className={classes.summaryPaper}>
                        <Grid item className={classes.summaryGrid}>
                                <Typography variant="subtitle2" gutterBottom align={"left"}>
                                    AMOUNT TO BE PAID
                                </Typography>
                                <Typography variant="h5" gutterBottom align={"left"}>
                                    {totalSum} ₺
                                </Typography>
                            <Link to='/checkout'>
                                    <Button variant={"contained"} color="primary" size={"large"}>
                                        Complete Order
                                    </Button>
                            </Link>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Footer/>
        </ThemeProvider>
    );
}

export function calculateTotalSum(products){
    var total_sum = 0;

    for(let i=0; i<products.length; i++){
        total_sum += parseInt(products[i].product.price) * products[i].quantity
    }

    return total_sum;
}
