// import and use AppBar.js here, can be changed tho
import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar";
import {Button, ButtonGroup, fade, IconButton} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import InputBase from "@material-ui/core/InputBase";
import {makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SearchIcon from '@material-ui/icons/Search';
import Avatar from "@material-ui/core/Avatar";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Paper from "@material-ui/core/Paper";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";



const useStyles = makeStyles((theme)=> ({
    root:{
        display: "flex",
        flexGrow: 1
    },
    toolbar: {
        minHeight: 80,
        alignItems: "flex-start",
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    logo: {
        width: theme.spacing(13),
        height: theme.spacing(13),
    },
    category: {
        marginLeft: theme.spacing(3),
        justifyContent: "center",
        alignSelf: "center"
    },
    searchGrid: {
        alignSelf: "center"
    },
    search:{
        color: "inherit",
        paddingLeft: `calc(1em + ${theme.spacing(1)}px)`,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        borderRadius: theme.shape.borderRadius,
    },
    searchIcon: {
        display: 'flex',
        position: 'absolute',
        padding: theme.spacing(0, 3),
        height: '75%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shoppingCartIcon:{
        color: 'white'
    },
    leftSide: {
        display: "flex"
    },
    upperLeft: {
        position: 'relative',
        justifyContent: "center",
    },
}))

// TODO: implement search functionality
export default function Navbar(){
    const classes = useStyles();

    return(
        <div className={classes.root}>
            <AppBar>
                <Toolbar className={classes.toolbar}>
                    <Avatar variant="square" className={classes.logo}>
                        <img src="https://raw.githubusercontent.com/bounswe/bounswe2020group1/master/images/logo.PNG"
                             alt="logo"/>
                    </Avatar>
                    <Grid container className={classes.leftSide} direction="column" spacing={3}>
                        <Grid item xs sm className={classes.upperLeft} container direction="row">
                            <Grid item className={classes.searchGrid}>
                                <InputBase placeholder="Search" className={classes.search} />
                            </Grid>
                            <Grid item>
                                <IconButton>
                                    <SearchIcon/>
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <Paper variant="outlined" elevation={3} >
                                    <AccountCircleIcon />
                                    <Button variant="text">
                                        Sign in
                                    </Button>
                                    <Button variant="text">
                                        Sign up
                                    </Button>
                                </Paper>
                            </Grid>
                            <Grid item>
                                <IconButton>
                                    <ShoppingCartIcon className={classes.shoppingCartIcon} />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className={classes.category}  >
                            <Grid item>
                                <Link to='/electronics'>
                                    <Button variant="contained" color="secondary">
                                        Electronics
                                    </Button>
                                </Link>
                            </Grid>

                            <Grid item>
                                <Link to='/fashion'>
                                    <Button variant="contained" color="secondary">
                                        Fashion
                                    </Button>
                                </Link>
                            </Grid>

                            <Grid item>
                                <Link to='/home'>
                                    <Button variant="contained" color="secondary">
                                        Home
                                    </Button>
                                </Link>
                            </Grid>

                            <Grid item>
                                <Link to='/office'>
                                    <Button variant="contained" color="secondary">
                                        Office
                                    </Button>
                                </Link>
                            </Grid>

                            <Grid item>
                                <Link to='/sports'>
                                    <Button variant="contained" color="secondary">
                                        Sports&Outdoors
                                    </Button>
                                </Link>
                            </Grid>

                            <Grid item>
                                <Link to='/cosmetics'>
                                    <Button variant="contained" color="secondary">
                                        Cosmetics
                                    </Button>
                                </Link>
                            </Grid>

                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    );
}
