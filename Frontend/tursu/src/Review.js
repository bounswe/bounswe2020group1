import React, {useEffect, useState} from 'react';
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Navbar from "./NavBar";
import {ProductListHorizontal} from "./ProductList";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
    listItem: {
        padding: theme.spacing(1, 0),
    },
    total: {
        fontWeight: 700,
    },
    title: {
        marginTop: theme.spacing(2),
    },
    summaryGrid: {
        padding: 30,
        width: '100%'
    },
    summaryPaper:{
        height: 175,
        marginLeft: 100,
        marginTop: 5,
        // marginBottom: 1,
        width: '250px'
    },
}));

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

function calculateTotalSum(products){
    var total_sum = 0;

    for(let i=0; i<products.length; i++){
        total_sum += parseInt(products[i].product.price) * products[i].quantity
    }

    return total_sum;
}

export default function Review() {
    const classes = useStyles();

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

    return (
        <ThemeProvider theme={theme} >
            <Grid container spacing={1} direction="column" className="HomePage">
                <Grid item container direction="column">
                    {<ProductListHorizontal products={products} onCountChange={onCountChange}/>}
                    <Paper className={classes.summaryPaper}>
                        <Grid item className={classes.summaryGrid}>
                            <Typography variant="subtitle2" gutterBottom align={"center"}>
                                AMOUNT TO BE PAID
                            </Typography>
                            <Typography variant="h5" gutterBottom align={"center"}>
                                {totalSum} ₺
                            </Typography>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}