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
import {ProductBoxHorizontal} from "./ProductBox";
import Box from "@material-ui/core/Box";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";


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
        height: 105,
        marginLeft: 370,
        // marginTop: 5,
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
                    {<ProductListHorizontalDuplicate products={products} onCountChange={onCountChange}/>}
                    <Paper className={classes.summaryPaper}>
                        <Grid item className={classes.summaryGrid}>
                            <Typography variant="subtitle2" gutterBottom align={"center"}>
                                Total Amount:
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom align={"center"}>
                                {totalSum} ₺
                            </Typography>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

const horizontalStyle = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        paddingBottom: 100,
        paddingLeft: 25,
        paddingRight: 25,
        width: "100%"
    },
}));


export function ProductListHorizontalDuplicate(props) {
    const classes = horizontalStyle();
    return (
        <Grid item container className={classes.root} direction={"column"}>
            {props.products.map((product) => (
                <ProductBoxReview product={product.product}
                                      quantity={product.quantity}
                                      onCountChange={props.onCountChange}/>
            ))}
        </Grid>
    );
}

const horizontalStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper:{
        marginLeft: 10,
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

export function ProductBoxReview(props) {
    const classes = horizontalStyles()
    const [count, setCount] = React.useState(props.quantity);
    const [render, setRender] = React.useState(true)

    if(render === false)
    {
        return null;
    }
    return(
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={5}>
                <Grid container item className={classes.grid} alignItems="center" spacing={4}>
                    <Grid item className={classes.imageContainer}>
                        <img
                            src={props.product.photo_url}
                            //src="https://grandstream.pl/wp-content/uploads/2016/03/left-e1456834177965.png"
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
                    <Grid item className={classes.marginInsideGrid}>
                        <ButtonGroup orientation={"vertical"} size={"small"}>
                            <Typography className={classes.productCountNumber}>
                                <Box fontWeight="fontWeightBold">
                                    Quantity: {count}
                                </Box>
                            </Typography>
                        </ButtonGroup>
                    </Grid>

                </Grid>
            </Paper>
        </div>
    );
}