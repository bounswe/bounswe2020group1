import React from 'react';
import './HomePage.css'
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import ProductBox from "./ProductBox";
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

export default function ProductsGrid(props) {
    const classes = useStyles();

    return (
        <Grid item container className={classes.root} spacing={6}>
            {props.products.map((product) => (
                <ProductBox product={product}/>
            ))}
        </Grid>
    );
}
