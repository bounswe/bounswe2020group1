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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';


const horizontalStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper:{
        marginLeft: 100,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(8),
        width: 850,
        height: 90,
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
    productCountBox: {
        width: 45,
        height: 64,
    },
    productCountNumber:{
        // marginBottom: 10
    },
    marginInsideGrid: {
        marginBottom:  20,
    },
    carrot:{
        marginBottom: 50,
        paddingBottom: 50,
        color: "red",
    }
}));

let token;
token = window.sessionStorage.getItem("authToken")

function deleteProduct(id){

    console.log("Deleting product " + id)
    const formData = new FormData();
    formData.append("id", id);
    axios
        .post("http://3.232.20.250/product/delete/", formData, {
            headers: {
                'Authorization': "Token " + token //the token is a variable which holds the token
            },
        }).then((response) => {

        if (response.status === 200) {
            alert("Product deleted!");
            console.log(response)
        }
    })
        .catch((err) => {
            if (err.response.status === 400) {
                alert(err.response.data);
            } else if (err.response.status === 401) {
                alert(err.response.data);
            }

        });
}

export default function OfferedProduct(props) {
    const classes = horizontalStyles()
    var id = props.product.id
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
                            Rating: {props.product.rating}
                        </Typography>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.brandName].join(" ")}>
                        <Typography variant="caption">
                            {props.product.category}
                        </Typography>
                    </Grid>

                    <Grid item className={[classes.marginInsideGrid, classes.brandName].join(" ")}>
                        <Typography variant="caption">
                            {props.product.stock}
                        </Typography>
                    </Grid>

                    <Grid className={classes.marginInsideGrid}>
                    <Tooltip title="Edit">
                        <IconButton onClick={() => {
                            props.handleID(id)
                            props.edit()
                        }}
                                    size="small">
                            <EditIcon/>
                        </IconButton>
                        </Tooltip>
                    </Grid>

                    <Grid className={classes.marginInsideGrid}>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => deleteProduct(id)} size="small">
                            <DeleteIcon/>
                        </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
