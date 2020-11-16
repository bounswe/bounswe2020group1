import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
//import Navbar from './HomePage';
//import Product from './HomePage';
import Stepper from "./Stepper";

//const { Navbar, Product } = require('./HomePage');

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function CenteredGrid() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper>
                        <Navbar />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <Stepper />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <Product name="telefon" price="3600" imageUrl="blbalba"/>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}