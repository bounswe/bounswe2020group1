import React, {useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import axios from "axios";



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

    const [notifications, setNotifications] = React.useState([]);

    useEffect(() => {
        axios.get("http://3.232.20.250/notifications/get_notifications",{
            headers: {
                'Authorization': "Token " + window.sessionStorage.getItem("authToken")
            }
        }).then(res =>{
            fillNotifications(res.data)
            console.log("NOTIFICATIONS")
            console.log(res.data)
        })
    }, [])
    function fillNotifications(data)
    {
        let newList = []
        for(const item of data)
        {
            let text = "";
            switch (item.type) {
                case 1:
                    text += "Your order " + item.product_name + " is in delivery now."
                    newList.push(text)
                    break;
                case 2:
                    text += "Your product " + item.product_name + " is verified now."
                    newList.push(text)
                    break;
                case 3:
                    text += "Price Drop: " + item.product_name + " is " + item.new_value + "₺ now."
                    newList.push(text)
                    break;
                case 4:
                    text += "Price Change: " + item.product_name + " is " + item.new_value + "₺ now."
                    newList.push(text)
                    break;
                case 5:
                    text += "Stock Change: " + item.product_name + " has " + item.new_value + "products in the stock now."
                    newList.push(text)
                    break;
                default:
                    console.log(item.type)
                    break;
            }
        }
        setNotifications(newList)
    }

    return (
        <div className={classes.root}>

            {notifications.map((notification) => (
                <Paper elevation={8} className={classes.paper}>
                    <Grid container wrap="nowrap" spacing={2}>
                        <Grid item>
                            <Avatar className={classes.avatar}>T</Avatar>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Typography noWrap>{notification}</Typography>
                        </Grid>
                    </Grid>
                </Paper>

            ))}
            <br/>
        </div>
    );
}