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
import {Link, Redirect} from "react-router-dom";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import './NavBar.css'
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import Tooltip from "@material-ui/core/Tooltip";
import withStyles from "@material-ui/core/styles/withStyles";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import Menu from "@material-ui/core/Menu";
import PersonIcon from '@material-ui/icons/Person';
import PowerSettingsNewSharpIcon from '@material-ui/icons/PowerSettingsNewSharp';

/**
 * It is used for enabling Navbar to disappear/appear
 * as we move scroll towards downside/upside.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function HideOnScroll(props) {
    const { children } = props;

    const trigger = useScrollTrigger();

    return (
        <Slide timeout={1000} appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}


const useStyles = makeStyles((theme)=> ({
    root:{
        display: "flex",
        flexGrow: 1
    },
    toolbar: {
        height: 100,
        alignItems: "flex-start",
        paddingTop: theme.spacing(2),
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
    shoppingCartIconPassive:{
        color: 'black'
    },
    leftSide: {
        display: "flex"
    },
    upperLeft: {
        position: 'relative',
        justifyContent: "center",

    },
    searchType:{
        marginRight: 5
    },
    sign:{
        marginLeft:10
    },
    sign_paper:{
        position: "absolute",
        left: "85%"
    },
    cart:{
        position: "absolute",
        right: "180px",
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
export default function Navbar(props){
    const [search_type, setType] = React.useState('product');
    const [search_str, setStr] = React.useState();


    const handleChange = (event) => {
        setType(event.target.value);
    };

    const handleChangeStr = (event) => {
        setStr(event.target.value);
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
                <HideOnScroll children={props.children}>
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
                                        <InputBase placeholder="Search" id="search" className={classes.search} onChange={handleChangeStr}/>
                                    </Grid>
                                    <Grid item>
                                        <Link to={`/search/${search_str}/${search_type}`}>
                                            <IconButton onClick={() => {window.sessionStorage.setItem("searched", document.getElementById("search").value);
                                                window.sessionStorage.setItem("search_type", search_type)
                                            }}>
                                                <SearchIcon/>
                                            </IconButton>
                                        </Link>

                                    </Grid>
                                    <Grid item className={classes.cart}>
                                        {window.sessionStorage.getItem("isLogged") && (window.sessionStorage.getItem("user_type")!=="vendor")?(
                                            <Link to='/shoppingCart'>
                                                <LightTooltip title={"Shopping cart"} placement={"top-start"}>
                                                    <IconButton>
                                                        <ShoppingCartIcon className={classes.shoppingCartIcon} />
                                                    </IconButton>
                                                </LightTooltip>
                                            </Link>
                                        ):(
                                            <Tooltip title={"You need to login as customer."} placement={"top-start"}>
                                                <span>
                                                    <IconButton disabled={true}>
                                                        <Link to='/shoppingCart'>
                                                            <ShoppingCartIcon className={classes.shoppingCartIconPassive}
                                                            />
                                                         </Link>
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        )}

                                    </Grid>
                                    <Grid item className={classes.sign}>
                                        <Paper variant="outlined" elevation={3}  className={classes.sign_paper}
                                               style={{
                                                   display: "flex",
                                                   alignItems: "center",
                                                   justifyContent: "center",
                                                   width: "175px",
                                               }}
                                        >
                                            {window.sessionStorage.getItem("isLogged") ? (
                                                <span style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    paddingLeft: "10px"
                                                }}>
                                                    <AccountCircleIcon style={{
                                                        paddingRight: "5px"
                                                    }}/>
                                                    <Typography>
                                                        {"My Account"}
                                                    </Typography>
                                                    <UserDropDown/>
                                                </span>
                                            ):(
                                                <Link to='/signIn'>
                                                    <Button variant="text">
                                                        {option}
                                                    </Button>
                                                </Link>
                                            )}
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
                </HideOnScroll>
            </div>
        </ThemeProvider>
    );
}

function UserDropDown(){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isListOpen, SetIsListOpen]  = React.useState(false);
    const [isAlertOpen, SetIsAlertOpen]  = React.useState(false);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const linkAddress = "/" + window.sessionStorage.getItem("user_type") + "Profile"
    return(
        <div>
            <IconButton
                onClick={handleClick}
                name="optionsButton"
            >
                <ArrowDropDownIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        marginTop: 40,
                        maxHeight: 45 * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {/*TODO: Convert this linkto structure to redirecting structure.*/}
                <Link to={linkAddress}>
                    <MenuItem>
                        <ListItemIcon>
                           <PersonIcon></PersonIcon>
                        </ListItemIcon>
                        <Typography>My Profile</Typography>
                    </MenuItem>
                </Link>
                <Link to={"/"}>
                    <MenuItem onClick={
                        ()=>{
                            window.sessionStorage.clear()
                        }
                    }>
                        <ListItemIcon>
                            <PowerSettingsNewSharpIcon/>
                        </ListItemIcon>
                        <Typography>Log Out</Typography>
                    </MenuItem>
                </Link>
            </Menu>
        </div>

    )
}
/**
 * It is used for making tooltips styled.
 * Instead of using ToolTip, use this component.
 *
 * It is adapted from the original documentation of Material-UI.
 */
const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 1.0)',
        boxShadow: theme.shadows[2],
        fontSize: 13,

        // I tried to add color to arrow attribute but
        // I was not able to do it. It can be revisited later.
        arrow: 'rgba(0, 0, 0, 0.0)'
    },
}))(Tooltip);