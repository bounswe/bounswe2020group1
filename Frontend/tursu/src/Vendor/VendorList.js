import React from 'react';
import '../MainPage/HomePage.css'
import { makeStyles } from '@material-ui/core/styles';
import VendorBox from "../MainPage/VendorBox";
import Grid from "@material-ui/core/Grid";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-st1art',
        alignItems: 'flex-start',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function VendorsGrid(props) {
    const classes = useStyles();

    return (
        <Grid item container className={classes.root} spacing={6}>
            {props.vendors.map((vendor) => (
                <VendorBox vendor={vendor}/>
            ))}
        </Grid>
    );
}
