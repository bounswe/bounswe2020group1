import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: theme.spacing(0, 3),
    },
    paper: {
        maxWidth: 400,
        marginLeft: '25%',
        padding: theme.spacing(2),
        marginTop: '30px'
    },
    avatar: {
        backgroundColor: "#81c784",
        color: "#388e3c",
    },
}));

// mock notification data to display
// TODO: connect with the notification endpoint of backend
const notifications = ['Your order has been shipped!', 'An item from your wishlist is back on stocks!',
    'Discount on a product that is on your wishlist!', 'Your order has been shipped!', 'You have a new message!'];

// map every notificiation to display them, like a for loop
export default function MyNotifications() {
    const classes = useStyles();
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