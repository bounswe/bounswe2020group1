import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import {Button, Typography, Tooltip} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ChatIcon from '@material-ui/icons/Chat';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {palette} from "@material-ui/system";
import axios from "axios";
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import StoreIcon from '@material-ui/icons/Store';
import FormDialog from "./orderDelivery"



const horizontalStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper:{
        marginLeft: 100,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(8),
        width: 900,
        height: 100,
    },
    grid: {
        paddingLeft: theme.spacing(1),
        width: "100%",
        height: "100%",
        justifyContent: "space-between"
    },
    imageContainer: {
        width: 128,
        height: 128,
    },
    image: {
        width: "50%",
        height: "auto",
        //marginTop: "12px"
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
function set_delivered(id){
    console.log("delivered " + id)
    var token = sessionStorage.getItem("authToken");
    var bodyFormData = new FormData();
    bodyFormData.append('order_id', id);
    axios({
        method: 'post',
        url: 'http://3.232.20.250/order/set_delivered',
        data: bodyFormData,
        headers: {Authorization: 'Token ' + token}
        })
    .then(res => {
        console.log(res)
    })
    .catch(error =>{
        if (error.response){
            console.log(error.response.message);
        }
    })

}
function set_delivery(id,cargo,days){
    console.log("in delivery " + id)

    var token = sessionStorage.getItem("authToken");
    var bodyFormData = new FormData();
    bodyFormData.append('order_id', id);
    bodyFormData.append('cargo_id', id);
    bodyFormData.append('days', days);
    axios({
        method: 'post',
        url: 'http://3.232.20.250/order/set_delivery',
        data: bodyFormData,
        headers: {Authorization: 'Token ' + token}
        })
    .then(res => {
        console.log(res)
    })
    .catch(error =>{
        if (error.response){
            console.log(error.response.message);
        }
    })

}
function set_cancelled(id){
    console.log("cancel " + id)

    var token = sessionStorage.getItem("authToken");
    var bodyFormData = new FormData();
    bodyFormData.append('order_id', id);
    axios({
        method: 'post',
        url: 'http://3.232.20.250/order/cancel_order',
        data: bodyFormData,
        headers: {Authorization: 'Token ' + token}
        })
    .then(res => {
        console.log(res)
    })
    .catch(error =>{
        if (error.response){
            console.log(error.response.message);
        }
    })

}
function options(status,id,classes){
    console.log(id)

    if (status === "processing"){
        return(
        <div>
        <FormDialog classes={classes} id={id}/>
        <Grid className={classes.marginInsideGrid}>
        <Tooltip title="Cancel order">
            <IconButton onClick={() => set_cancelled(id)} size="small">
                <CancelPresentationIcon/>
            </IconButton>
            </Tooltip>
        </Grid>
        </div>
        )

    }
    else if (status ===  "in delivery"){
        return(
        <div>

        <Grid className={classes.marginInsideGrid}>
         <Tooltip title="Set status: delivered">
            <IconButton onClick={() => set_delivered(id)} size="small">
                <StoreIcon/>
            </IconButton>
            </Tooltip>
        </Grid>
        <Grid className={classes.marginInsideGrid}>
            <IconButton size="small">
            </IconButton>
        </Grid>
        </div>
        )
    }
    else{
        return(
        <div>
        <Grid className={classes.marginInsideGrid}>
            <IconButton size="small">
            </IconButton>
        </Grid>
        <Grid className={classes.marginInsideGrid}>
            <IconButton size="small">
            </IconButton>
        </Grid>
        </div>
        )
    }
}


export default function Product(props) {
    const classes = horizontalStyles()
    console.log(props.product)

    return(
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={5}>
                <Grid container item className={classes.grid} alignItems="center" spacing={4}>
                    <Grid item className={classes.imageContainer}>
                        <img
                            src={props.product_info.photo_url}
                            alt={props.product_info.name}
                            className={classes.image}/>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.productName].join(" ") }>
                        <Typography variant="subtitle2">
                            {props.product_info.name}
                        </Typography>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.price].join(" ")}>
                        <Typography variant="body2">
                            <Box fontWeight="fontWeightBold">
                                {props.product_info.price} ₺
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.brandName].join(" ")}>
                        <Typography variant="caption">
                            {props.product.customer}
                        </Typography>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.brandName].join(" ")}>
                        <Typography variant="caption">
                            {props.product.status}
                        </Typography>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.price].join(" ")}>
                        <Typography variant="body2">
                            <Box fontWeight="fontWeightBold">
                                {props.product.quantity}
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.productName].join(" ") }>
                        <Typography variant="subtitle2">
                            {props.product.orderDate}
                        </Typography>
                    </Grid>
                    {options(props.product.status,props.product.id,classes)}
                </Grid>
            </Paper>
        </div>
    );
}
