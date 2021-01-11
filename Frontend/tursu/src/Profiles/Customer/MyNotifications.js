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
    },
    avatar: {
        backgroundColor: "#81c784",
        color: "#388e3c",
    },
}));

const message = `You have a new notification!`;


export default function MyNotifications() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar className={classes.avatar}>T</Avatar>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                        <Typography noWrap>{message}</Typography>
                    </Grid>
                </Grid>
            </Paper>
            <br/>
            <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar className={classes.avatar}>T</Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography noWrap>{message}</Typography>
                    </Grid>
                </Grid>
            </Paper>
            <br/>
            <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar className={classes.avatar}>T</Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography>{message}</Typography>
                    </Grid>
                </Grid>
            </Paper>
            <br/>
            <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar className={classes.avatar}>T</Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography>{message}</Typography>
                    </Grid>
                </Grid>
            </Paper>
            <br/>
            <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar className={classes.avatar}>T</Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography>{message}</Typography>
                    </Grid>
                </Grid>
            </Paper>
            <br/>
            <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar className={classes.avatar}>T</Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography>{message}</Typography>
                    </Grid>
                </Grid>
            </Paper>
            <br/>
        </div>
    );
}