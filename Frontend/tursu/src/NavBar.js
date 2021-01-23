// import and use AppBar.js here, can be changed tho
import React, {useEffect, useState} from "react";
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
import NotificationsIcon from '@material-ui/icons/Notifications';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import SmsIcon from '@material-ui/icons/Sms';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import axios from "axios";
import DnsIcon from '@material-ui/icons/Dns';
import Axios from "axios";


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
        //position: "absolute",
        right: "180px",
    },
    avatar: {
        backgroundColor: "#81c784",
        color: "#388e3c",
    },
    notificationButton: {
        marginLeft: "120px"
    },
    notificationIcon: {
        color: 'white'
    },
    dialog: { // TODO: check for different resolutions
        position: 'absolute',
        right: '18%', // not sure how it displays in different resolutions
        top: 50,
        width: 400
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

// TODO: I couldn't find why it is global.
let notifications = [];

/*
 * - It is the dialog that pops up when notification icon is clicked.
 * - Maps the notification variable and displays them depending on the user type.
 * - Redirect address of the link is different
 */
function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open } = props;
    const [updated, setUpdated] = React.useState(false);
    const [rawNotifications, setRawNotifications] = React.useState([])

    useEffect(() => {
        axios.get("http://3.232.20.250/notifications/get_notifications",{
            headers: {
                'Authorization': "Token " + window.sessionStorage.getItem("authToken")
            }
        }).then(res =>{
            console.log("NOTIFICATIONS")
            console.log(res.data)
            let temp = []
            for(const item of res.data)
            {
                if(!item.read)
                {
                    temp.push(item)
                }
            }
            setRawNotifications(temp)
            console.log("raw: ", rawNotifications.length)
        })
    }, [])

    function getNotificationText(item)
    {
        let text = "";
        switch (item.type) {
            case 1:
                text += "Your order " + item.product_name + " is in delivery now."
                return text;
                break;
            case 2:
                text += "Your product " + item.product_name + " is verified now."
                return text;
                break;
            case 3:
                text += "Price Drop: " + item.product_name + " is " + item.new_value + "₺ now."
                return text;
                break;
            case 4:
                text += "Price Change: " + item.product_name + " is " + item.new_value + "₺ now."
                return text;
                break;
            case 5:
                text += "Stock Change: " + item.product_name + " has " + item.new_value + "products in the stock now."
                return text;
                break;
            default:
                console.log(item.type)
                break;
        }
        return text;
    }

    function handleClose(){
        for(let notification of rawNotifications)
        {
            const formData = new FormData();
            formData.append("id", notification.id);
            Axios.post('http://3.232.20.250/notifications/set_read',
                formData,{
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            })
            .then(res => {
                console.log(res.status)
                console.log("Notification: ", notification.id, " is set as read.")
            })
        }
        setRawNotifications([]);
        onClose(selectedValue);
    };

    const linkAddress = "/" + window.sessionStorage.getItem("user_type") + "Profile"
    return (
        <Dialog classes={{paper: classes.dialog}} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Your Notifications</DialogTitle>
            <List>
                {rawNotifications.map((notification) => (
                    <Link to={`/product/${notification.product_id}`} style={{ textDecoration: 'none'}}>
                        <ListItem key={notification}>
                            <ListItemAvatar>
                                    <Avatar className={classes.avatar}>
                                        <NotificationsActiveIcon />
                                    </Avatar>
                                </ListItemAvatar>
                            <ListItemText primary={getNotificationText(notification)} />
                        </ListItem>
                    </Link>
                ))}
                <br/>

                <Link to={linkAddress}>
                    <Button className={classes.notificationButton} variant="contained" color="secondary">
                        All Notifications
                    </Button>
                </Link>

            </List>
        </Dialog>
    );
}

// no idea what this is lol
SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};


export default function Navbar(props){
    const [search_type, setType] = React.useState('product');
    const [search_str, setStr] = React.useState();
    const [update, setUpdate] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(notifications[1]);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };
    const handleSearch = () => {
        const array = window.location.href.split("/")
        window.sessionStorage.setItem("searched", document.getElementById("search").value)
        window.sessionStorage.setItem("search_type", "product")
        setUpdate(!update)
        if(array[3] === "search"){
            props.callbackSearched(update)
        }
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

                                    <Grid item className={classes.searchGrid}>
                                        <InputBase placeholder="Search" id="search" className={classes.search} onChange={handleChangeStr}/>
                                    </Grid>

                                    <Grid item>
                                        <Link to={`/search/${search_str}/${search_type}`}>
                                            <IconButton onClick={() => {handleSearch()
                                            }}>
                                                <SearchIcon/>
                                            </IconButton>
                                        </Link>
                                    </Grid>


                                    <Grid item>
                                        {window.sessionStorage.getItem("isLogged")?(
                                            <Grid item>
                                                <IconButton onClick={handleClickOpen}>
                                                    <NotificationsIcon className={classes.notificationIcon} />
                                                </IconButton>
                                                <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
                                            </Grid>
                                        ):(
                                            <Tooltip title={"You need to login to see your notifications."} placement={"top-start"}>
                                                <span>
                                                    <IconButton disabled={true}>
                                                        <NotificationsIcon/>
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        )}
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
                                            <Button variant="contained" style={{ backgroundColor: '#84c484' }}>
                                                Electronics
                                            </Button>
                                        </Link>
                                    </Grid>

                                    <Grid item>
                                        <Link to='/categories/Fashion'>
                                            <Button variant="contained" style={{ backgroundColor: '#84c484' }}>
                                                Fashion
                                            </Button>
                                        </Link>
                                    </Grid>

                                    <Grid item>
                                        <Link to='/categories/Home'>
                                            <Button variant="contained" style={{ backgroundColor: '#84c484' }}>
                                                Home
                                            </Button>
                                        </Link>
                                    </Grid>

                                    <Grid item>
                                        <Link to='/categories/Sports'>
                                            <Button variant="contained" style={{ backgroundColor: '#84c484' }}>
                                                Sports&Outdoors
                                            </Button>
                                        </Link>
                                    </Grid>

                                    <Grid item>
                                        <Link to='/categories/Cosmetics'>
                                            <Button variant="contained" style={{ backgroundColor: '#84c484' }}>
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

    const handleSignOut = () => {
        var temp_type = window.sessionStorage.getItem("user_type")
        window.sessionStorage.clear()
        window.sessionStorage.setItem("user_type",  temp_type)
    };

    const linkAddress = "/" + window.sessionStorage.getItem("user_type") + "Profile"
    const messageAddress = "/message"
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
                {window.sessionStorage.getItem("user_type") !=="admin" && <Link to={linkAddress}>
                    <MenuItem>
                        <ListItemIcon>
                           <PersonIcon></PersonIcon>
                        </ListItemIcon>
                        <Typography>My Profile</Typography>
                    </MenuItem>
                </Link>}
                <Link to={messageAddress}>
                    <MenuItem>
                        <ListItemIcon>
                           <SmsIcon></SmsIcon>
                        </ListItemIcon>
                        <Typography>Messages</Typography>
                    </MenuItem>
                </Link>
                {window.sessionStorage.getItem("user_type")==="admin" && <Link to={"/admin"}>
                    <MenuItem >
                        <ListItemIcon>
                            <SupervisorAccountIcon/>
                        </ListItemIcon>
                        <Typography>Admin Panel</Typography>
                    </MenuItem>
                </Link>}
                {window.sessionStorage.getItem("user_type")==="admin" && <Link to={"/activityStream"}>
                    <MenuItem >
                        <ListItemIcon>
                            <DnsIcon/>
                        </ListItemIcon>
                        <Typography>Act. Stream</Typography>
                    </MenuItem>
                </Link>}
                <Link to={"/"}>
                    <MenuItem onClick={handleSignOut}>
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
