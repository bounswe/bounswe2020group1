import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import {Button, Typography} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {palette} from "@material-ui/system";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary
        // backgroundColor: "#388e3c",
    },
}));


export default function ProductBox(props) {
    const classes = useStyles()
    //console.log(props.product.photo_url)
    return(
        <Grid item xs={3}>
            <Link to='/product'>
                <Button variant="contained" onClick={() => { window.sessionStorage.setItem("product_id", props.product.id); }}>
                    <Paper className={classes.paper}>
                        <div className="ProductInfo" >
                            <img
                                src={props.product.photo_url}
                                //src="https://grandstream.pl/wp-content/uploads/2016/03/left-e1456834177965.png"
                                alt={props.product.name}
                                className="responsiveImage"/>
                            <text>
                                <br/>
                                <Typography variant="subtitle2">
                                    {props.product.name}
                                </Typography>
                                <Typography variant="body2">
                                    <Box fontWeight="fontWeightBold">
                                        {props.product.price} ₺
                                    </Box>
                                </Typography>
                                <Typography variant="caption">
                                    {props.product.vendor_name}
                                </Typography>
                            </text>
                        </div>
                    </Paper>
                </Button>
            </Link>
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

export function ProductBoxHorizontal(props) {
    const classes = horizontalStyles()
    const [count, setCount] = React.useState(props.quantity);

    function handleDelete(){
        console.log("Product ID:", props.product.id);
        console.log("Token: " + window.sessionStorage.getItem("authToken"))

        const formData = new FormData();
        formData.append("product_id", props.product.id);

        axios.delete('http://3.232.20.250/shoppingcart/delete', {
                headers: {
                    'Authorization': "Token " + window.sessionStorage.getItem("authToken"),
                },
                data: {
                    "product_id": props.product.id
                },
            })
            .then(res => {
                console.log(res);
                console.log(res.status);
            })
            .catch(error =>{
                console.log(error.response)
                console.log(error.response.request.response)
                console.log(error.request)
                console.log(error.message)
                alert ("There has been an error. Please try again.");
            })
    }

    function handleCountChange(change){
        const newCount = Math.max(count + change, 0);
        setCount(newCount);

        if(count <= 0 && change < 0)
        {
            //TODO: Delete items when its quantity is set to zero.
            return;
        }

        console.log("Product Id", props.product.id)
        console.log("Token " + window.sessionStorage.getItem("authToken"))

        const formData = new FormData();
        formData.append("product_id", props.product.id);
        formData.append("quantity", newCount.toString());

        axios.post('http://3.232.20.250/shoppingcart/add',
            formData, {
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            })
            .then(res => {
                console.log(res);
                console.log(res.status);
            })
            .catch(error =>{
                console.log(error)
            })

        props.onCountChange(change, props.product.price);
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
                    <Grid item className={[classes.marginInsideGrid, classes.brandName].join(" ")}>
                        <Typography variant="caption">
                            {props.product.vendor_name}
                        </Typography>
                    </Grid>
                    <Grid item className={classes.marginInsideGrid}>
                        <ButtonGroup orientation={"vertical"} size={"small"}>
                            <IconButton
                                aria-label="increase"
                                onClick={() => {
                                    handleCountChange(1)
                                }}
                                variant
                            >
                                <AddIcon fontSize="small"/>
                            </IconButton>
                            <Typography className={classes.productCountNumber}>
                                <Box fontWeight="fontWeightBold">
                                    {count}
                                </Box>
                            </Typography>
                            <IconButton
                                aria-label="reduce"
                                onClick={() => {
                                    handleCountChange(-1)
                                }}
                            >
                                <RemoveIcon fontSize="small"/>
                            </IconButton>
                        </ButtonGroup>
                    </Grid>
                    <Grid className={classes.marginInsideGrid}>
                        <IconButton size="small">
                            <DeleteOutlineIcon color="error" onClick={handleDelete}/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

