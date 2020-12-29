import React, {Component} from 'react';
import myInfo from "./MyInfo";
import myProducts from "./MyProducts";
import myOrders from "./MyOrders";
import Navbar from "../../NavBar";
import "./profile.css";
import {makeStyles} from '@material-ui/core/styles';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StorefrontIcon from '@material-ui/icons/Storefront';
import InfoIcon from '@material-ui/icons/Info';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {Drawer, List, ListItem,
    ListItemIcon, ListItemText,
    Container, Typography,} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme)=> ({
    root: {
        // display: "flex",
        // flexGrow: 1
        width: 250,
        marginRight: 75
    },
}))



export default function VendorSidebar(props){
    const classes = useStyles();

    return (
        <Grid container item direction="column" spacing="1" className={classes.root}>
            <Grid item className="sidebar">
                <Paper elevation="4">
                    <IconButton onClick={props.info}>
                        <InfoIcon/>
                        <Typography>My Information</Typography>
                    </IconButton>
                </Paper>
            </Grid>
            <Grid item className="sidebar">
                <Paper elevation="4">
                    <IconButton onClick={props.products}>
                        <StorefrontIcon/>
                        <Typography>My Products</Typography>
                    </IconButton>
                </Paper>
            </Grid>
            <Grid item className="sidebar">
                <Paper elevation="4">
                    <IconButton onClick={props.orders}>
                        <ShoppingCartIcon/>
                        <Typography>My Orders</Typography>
                    </IconButton>
                </Paper>
            </Grid>
            <Grid item className="sidebar">
                <Paper elevation="4">
                    <IconButton onClick={props.add}>
                        <ShoppingCartIcon/>
                        <Typography>Add Product</Typography>
                    </IconButton>
                </Paper>
            </Grid>

        </Grid>

    );
}