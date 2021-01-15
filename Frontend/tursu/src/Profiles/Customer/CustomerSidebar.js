import React, {Component} from 'react';
import myInfo from "./MyInfo";
import MyLists from "./MyLists";
import myOrders from "./MyOrders";
//import Stepper from '../Stepper';
//import Navbar from "../NavBar";
import "./profile.css";
import {makeStyles} from '@material-ui/core/styles';
import ViewListIcon from '@material-ui/icons/ViewList';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import InfoIcon from '@material-ui/icons/Info';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {Drawer, List, ListItem,
    ListItemIcon, ListItemText,
    Container, Typography,} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import NotificationsIcon from '@material-ui/icons/Notifications';

const useStyles = makeStyles((theme)=> ({
    root: {
        // display: "flex",
        // flexGrow: 1
        width: 250,
        marginRight: 75
    },
}))



export default function CustomerSidebar(props){
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
                    <IconButton onClick={props.orders}>
                        <ShoppingCartIcon/>
                        <Typography>My Orders</Typography>
                    </IconButton>
                </Paper>
            </Grid>
            <Grid item className="sidebar">
                 <Paper elevation="4">
                    <IconButton onClick={props.lists}>
                        <ViewListIcon/>
                        <Typography>My Lists</Typography>
                     </IconButton>
                 </Paper>
            </Grid>
            <Grid item className="sidebar">
                <Paper elevation="4">
                    <IconButton onClick={props.notifications}>
                        <NotificationsIcon/>
                        <Typography>My Notifications</Typography>
                    </IconButton>
                </Paper>
            </Grid>
        </Grid>
    );
}
