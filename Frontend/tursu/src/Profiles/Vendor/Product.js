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
import ChatIcon from '@material-ui/icons/Chat';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {palette} from "@material-ui/system";
import axios from "axios";


const horizontalStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper:{
        marginLeft: 100,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: 700,
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

function addComment(){

}
function viewComment(){

}

function commentSection(props,classes){

    if (props.product.comment === ""){
        return(
            <Grid className={classes.marginInsideGrid}>
                <IconButton size="small">
                    <ChatIcon onClick={addComment}/>
                    Add a Comment
                </IconButton>
            </Grid>
        )
    }
    else{
        return(
            <Grid className={classes.marginInsideGrid}>
                <IconButton size="small">
                    <ChatIcon onClick={addComment}/>
                    View your Comment
                </IconButton>
            </Grid>
        )
    }
}

export default function Product(props) {
    const classes = horizontalStyles()


    return(
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={5}>
                <Grid container item className={classes.grid} alignItems="center" spacing={4}>
                    <Grid item className={classes.imageContainer}>
                        <img
                            src={props.product.photo_url}
                            alt={props.name}
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

                    {commentSection(props,classes)}
                </Grid>
            </Paper>
        </div>
    );
}
