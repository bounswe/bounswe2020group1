import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "./NavBar";

import ProductList, {ProductListHorizontal} from "./ProductList";
import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Axios from "axios";
import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import 'fontsource-roboto';
import axios from "axios";
import {ProductBoxHorizontal} from "./ProductBox";
import Box from "@material-ui/core/Box";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';

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

export default function ShoppingList(props){
    // var products = React.useState([])
    const classes = styles()

    const [products,setProducts] = useState([]);

    //ComponentDidMount
    useEffect(() => {
        console.log("NAME", props.match.params.name)
        const formData = new FormData();
        formData.append("list_name", props.match.params.name)
        axios.post("http://3.232.20.250/shoppinglist/products/",
            formData,{
            headers: {
                'Authorization': "Token " + window.sessionStorage.getItem("authToken")
            }
        }).then(res =>{
            console.log("PRODUCTS IN THE SHOPPING LIST")
            console.log(res.data);
            setProducts(res.data)
        })
    }, [])

    return(
        <ThemeProvider theme={theme} >
            <Grid container spacing={15} direction="column" className="HomePage">
                <Grid item xs={12}>
                    <Paper>
                        <Navbar />
                    </Paper>
                </Grid>
                <h4>
                    Shopping Cart
                </h4>
                <Grid item container direction="row">
                    {<ProductsInShoppingList products={products} listName={props.match.params.name}/>}
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        paddingBottom: 100,
        width: 900
    },
}));

export function ProductsInShoppingList(props) {
    const classes = useStyles();
    return (
        <Grid item container className={classes.root} direction={"column"}>
            {props.products.map((product) => (
                <ProductInShoppingList product={product} listName={props.listName}/>
            ))}
        </Grid>
    );
}

const horizontalStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper:{
        marginLeft: 100,
        marginTop: 50,
        marginBottom: 1,
        width: 700,
    },
    grid: {
        paddingLeft: theme.spacing(1),
        width: "100%",
        height: 110,
        justifyContent: "space-between"
    },
    imageContainer: {
        width: 128,
        height: 128,
    },
    image: {
        width: "50%",
        height: "auto",
        marginTop: "12px"
    },
    productName: {
        flex: "0 0 150px",
        textAlign: "left"
    },
    price: {
        flex: "0 0 100px",
        textAlign: "left"
    },
    brandName: {
        flex: "0 0 100px",
        textAlign: "left",
    },
    productCountBox: {
        width: 45,
        height: 64,
    },
    productCountNumber:{
        // marginBottom: 10
    },
    marginInsideGrid: {
        marginBottom:  20,
    }
}));

export function ProductInShoppingList(props) {
    const classes = horizontalStyles()
    const [isProductAddedToShoppingCart, SetIsProductAddedToShoppingCart]  = React.useState(false);
    const [isAlertOpen, SetIsAlertOpen]  = React.useState(false);
    const [isRemoveAlertOpen, SetIsRemoveAlertOpen]  = React.useState(false);
    const [isDeleteAlertOpen, SetIsDeleteAlertOpen]  = React.useState(false);
    const [render, SetRender] = React.useState(true);

    useEffect(() => {
        isInShoppingCart()
    }, [])

    function isInShoppingCart(){
        let productsInShoppingCart = [];
        axios.get("http://3.232.20.250/shoppingcart/all",{
            headers: {
                'Authorization': "Token " + window.sessionStorage.getItem("authToken")
            }
        }).then(res =>{
            console.log("PRODUCTS IN THE SHOPPING CART")
            console.log(res.data);
            productsInShoppingCart = res.data;

            for(let i=0; i<productsInShoppingCart.length; i++){
               if(props.product.id === productsInShoppingCart[i].product.id){
                    SetIsProductAddedToShoppingCart(true);
                    return;
               }
            }
        })
    }

    function handleDeleteFromList(){
        console.log("Product ID:", props.product.id);
        console.log("Token: " + window.sessionStorage.getItem("authToken"))

        const formData = new FormData();
        formData.append("list_name", props.listName);
        formData.append("product_id", props.product.id);

        axios.post('http://3.232.20.250/shoppinglist/deletefromlist/',
            formData,{
            headers: {
                'Authorization': "Token " + window.sessionStorage.getItem("authToken"),
            },
        })
            .then(res => {
                console.log(res);
                console.log(res.status);
                SetIsDeleteAlertOpen(true);
                SetRender(false);
            })
            .catch(error =>{
                console.log(error.response)
                console.log(error.response.request.response)
                console.log(error.request)
                console.log(error.message)
                alert ("There has been an error. Please try again.");
            })
    }

    function handleAddShoppingCart(){
        console.log("Product ID:", props.product.id)
        console.log("Token " + window.sessionStorage.getItem("authToken"))

        const formData = new FormData();
        formData.append("product_id", props.product.id);

        axios.post('http://3.232.20.250/shoppingcart/add',
            formData, {
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            })
            .then(res => {
                console.log(res);
                console.log(res.status);
                if(res.status === 200){
                    SetIsProductAddedToShoppingCart(true);
                    SetIsAlertOpen(true)
                }
            })
            .catch(error =>{
                console.log(error)
                alert ("There has been an error. Please try again.");
            })
    }

    function handleAlertClose(){
        SetIsAlertOpen(false)
    }

    function handleRemoveAlertClose(){
        SetIsRemoveAlertOpen(false)
    }

    function handleDeleteFromShoppingCart(){
        const formData = new FormData();
        formData.append("product_id", props.product.id);

        axios.post('http://3.232.20.250/shoppingcart/delete',
            formData,{
                headers: {
                    'Authorization': "Token " + window.sessionStorage.getItem("authToken"),
                }
            })
            .then(res => {
                console.log(res);
                console.log(res.status);
                SetIsProductAddedToShoppingCart(false)
                SetIsRemoveAlertOpen(true)
            })
            .catch(error =>{
                console.log(error.response)
                console.log(error.response.request.response)
                console.log(error.request)
                console.log(error.message)
                alert ("There has been an error. Please try again.");
            })
    }

    function handleDeleteAlertClose(){
        SetIsDeleteAlertOpen(false)
    }

    if(!render){
        return(
            <Snackbar open={isDeleteAlertOpen} autoHideDuration={3000} onClose={handleDeleteAlertClose}>
                <Alert onClose={handleDeleteAlertClose} severity="warning">
                    Product is removed from the shopping list
                </Alert>
            </Snackbar>
        )
    }
    return(
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={5}>
                <Grid container item className={classes.grid} alignItems="center" spacing={4}>
                    <Grid item className={classes.imageContainer}>
                        <img
                            src={props.product.photo_url}
                            alt={props.product.name}
                            className={classes.image}/>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.productName].join(" ") }>
                        <Typography variant="subtitle2">
                            {props.product.name}
                        </Typography>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.price].join(" ")}>
                        <Typography variant="body2">
                            <Box fontWeight="fontWeightBold">
                                {props.product.price} ₺
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.brandName].join(" ")}>
                        <Typography variant="caption">
                            {props.product.vendor_name}
                        </Typography>
                    </Grid>
                    {isProductAddedToShoppingCart?(
                        <Grid className={classes.marginInsideGrid}>
                            <Tooltip title="Remove from shopping cart">
                                <IconButton size="small">
                                    <RemoveShoppingCartIcon color="error" onClick={handleDeleteFromShoppingCart}/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    ):(
                        <Grid className={classes.marginInsideGrid}>
                            <Tooltip title="Add to shopping cart">
                                <IconButton size="small">
                                    <AddShoppingCartIcon color="action" onClick={handleAddShoppingCart}/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    )}
                    <Grid className={classes.marginInsideGrid} >
                        <Tooltip title="Delete from this list">
                            <IconButton size="small">
                                <DeleteOutlineIcon color="error" onClick={handleDeleteFromList}/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Paper>
            <Snackbar open={isAlertOpen} autoHideDuration={3000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="success">
                    Product is added to shopping cart.
                </Alert>
            </Snackbar>
            <Snackbar open={isRemoveAlertOpen} autoHideDuration={3000} onClose={handleRemoveAlertClose}>
                <Alert onClose={handleRemoveAlertClose} severity="warning">
                    Product is removed from shopping cart.
                </Alert>
            </Snackbar>
        </div>
    );
}