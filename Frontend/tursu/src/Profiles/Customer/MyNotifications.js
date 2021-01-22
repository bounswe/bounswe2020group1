import React, {useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: theme.spacing(0, 3),
    },
    paper: {
        maxWidth: 700,
        marginLeft: '15%',
        padding: theme.spacing(2),
        marginTop: '30px'
    },
    avatar: {
        backgroundColor: "#81c784",
        color: "#388e3c",
    },
}));


// map every notificiation to display them, like a for loop
export default function MyNotifications() {
    const classes = useStyles();

    const [rawNotifications, setRawNotifications] = React.useState([])

    useEffect(() => {
        axios.get("http://3.232.20.250/notifications/get_notifications",{
            headers: {
                'Authorization': "Token " + window.sessionStorage.getItem("authToken")
            }
        }).then(res =>{
            console.log("NOTIFICATIONS")
            console.log(res.data)
            setRawNotifications(res.data)
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

    return (
        <div className={classes.root}>

            {rawNotifications.map((notification) => (
                <Paper elevation={8} className={classes.paper}>
                    <Link to={`/product/${notification.product_id}`} style={{ textDecoration: 'none'}}>
                        <Grid container wrap="nowrap" spacing={2}>
                            <Grid item>
                                <Avatar className={classes.avatar}>T</Avatar>
                            </Grid>
                            <Grid item xs zeroMinWidth>
                                <Typography noWrap>{getNotificationText(notification)}</Typography>
                            </Grid>
                        </Grid>
                    </Link>
                </Paper>
            ))}
            <br/>
        </div>
    );
}