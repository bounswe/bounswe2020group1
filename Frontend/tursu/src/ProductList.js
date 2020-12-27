import React from 'react';
import './HomePage.css'
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import ProductBox, {ProductBoxHorizontal} from "./ProductBox";
import Grid from "@material-ui/core/Grid";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        paddingBottom: 100,
        paddingLeft: 25,
        paddingRight: 25
    },
}));

export default function ProductListVertical(props) {
    const classes = useStyles();
    
    return (
        <Grid item container className={classes.root} spacing={6}>
            {props.products.map((product) => (
                <ProductBox product={product}/>
            ))}
        </Grid>
    );
}



export function ProductListHorizontal(props) {
    const classes = useStyles();
    return (
        <Grid item container className={classes.root} direction={"column"}>
            {props.products.map((product) => (
                <ProductBoxHorizontal product={product.product}
                                      quantity={product.quantity}
                                      onCountChange={props.onCountChange}/>
            ))}
        </Grid>
    );
}
