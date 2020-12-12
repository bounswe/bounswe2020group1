// import and use AppBar.js here, can be changed tho
import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar";
import {Button, ButtonGroup, fade, IconButton} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import {createMuiTheme, makeStyles, Theme, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SearchIcon from '@material-ui/icons/Search';
import Avatar from "@material-ui/core/Avatar";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Paper from "@material-ui/core/Paper";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link } from "react-router-dom";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import './NavBar.css'





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
        height: theme.spacing(13),
        width: theme.spacing(13),
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
        width: 500,
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
    searchType:{
        marginLeft: 150,
        marginRight: 30
    },
    sign:{
        marginLeft:10
    },
    sign_paper:{
        pacity: 0.5,

    },
    cart:{
        marginLeft:100
    },


}))

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

// TODO: implement search functionality
export default function Navbar(){
    const [search_type, setType] = React.useState('product');

    const handleChange = (event) => {
        setType(event.target.value);
    };

    const classes = useStyles();
    var option;
    if (window.sessionStorage.getItem("isLogged") === "true" ){
        option = "Log Out"
    }
    else {
        option = "Sign In | Sign Up"
    }

    return(
        <ThemeProvider theme={theme} >
            <div className={classes.root}>
                <AppBar>
                    <Toolbar className={classes.toolbar}>
                        <Link to='/'>
                            <Button>
                                <Paper elevation={5}>
                                    <Avatar variant="square" className={classes.logo}>
                                        <img src="https://raw.githubusercontent.com/bounswe/bounswe2020group1/master/images/logo.PNG"
                                             alt="logo"
                                             className={classes.logo}/>
                                    </Avatar>
                                </Paper>
                            </Button>
                        </Link>
                        <Grid container className={classes.leftSide} direction="column" spacing={3} >

                            <Grid item xs sm className={classes.upperLeft} container direction="row" >

                                <Select className={classes.searchType}
                                    id="search-type-id"
                                    value={search_type}
                                    onChange={handleChange}
                                    IconComponent={FindReplaceIcon}
                                >
                                    <MenuItem value={"product"}>Products</MenuItem>
                                    <MenuItem value={"vendor"}>Vendors</MenuItem>
                                </Select>
                                <Grid item className={classes.searchGrid}>
                                    <InputBase placeholder="Search" id="search" className={classes.search}/>
                                </Grid>
                                <Grid item>
                                    <Link to='/search'>
                                        <IconButton onClick={() => {window.sessionStorage.setItem("searched", document.getElementById("search").value);
                                            window.sessionStorage.setItem("search_type", search_type);
                                        }}>
                                            <SearchIcon/>
                                        </IconButton>
                                    </Link>

                                </Grid>
                                <Grid item className={classes.cart}>
                                    <IconButton >
                                        <ShoppingCartIcon  />
                                    </IconButton>
                                </Grid>
                                <Grid item className={classes.sign}>
                                    <Paper variant="outlined" elevation={3}  className={classes.sign_paper}>
                                        <AccountCircleIcon  />
                                        <Link to='/signIn'>
                                            <Button variant="text">
                                                {option}
                                            </Button>
                                        </Link>
                                    </Paper>
                                </Grid>


                            </Grid>

                            <Grid container spacing={2} className={classes.category}  >
                                <Grid item>
                                    <Link to='/categories/Electronics'>
                                        <Button variant="contained" color="secondary">
                                            Electronics
                                        </Button>
                                    </Link>
                                </Grid>

                                <Grid item>
                                    <Link to='/categories/Fashion'>
                                        <Button variant="contained" color="secondary">
                                            Fashion
                                        </Button>
                                    </Link>
                                </Grid>

                                <Grid item>
                                    <Link to='/categories/Home'>
                                        <Button variant="contained" color="secondary">
                                            Home
                                        </Button>
                                    </Link>
                                </Grid>

                                <Grid item>
                                    <Link to='/categories/Sports'>
                                        <Button variant="contained" color="secondary">
                                            Sports&Outdoors
                                        </Button>
                                    </Link>
                                </Grid>

                                <Grid item>
                                    <Link to='/categories/Cosmetics'>
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
        </ThemeProvider>
    );
}
