import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import {Button, Typography} from "@material-ui/core";
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary
        // backgroundColor: "#388e3c",
    },
}));

export default function ProductBox(props) {
    const classes = useStyles()
    console.log(props.product.photo_url)
    return(
        <Grid item xs={3}>
            <Link to='/product'>
                <Button variant="contained" onClick={() => { window.sessionStorage.setItem("product_id", props.product.id); }}>
                    <Paper className={classes.paper}>
                        <div className="ProductInfo" >
                            <img
                                src={props.product.photo_url}
                                //src="https://grandstream.pl/wp-content/uploads/2016/03/left-e1456834177965.png"
                                alt={props.product.name}
                                className="responsiveImage"/>
                            <text>
                                <br/>
                                <Typography variant="subtitle2">
                                    {props.product.name}
                                </Typography>
                                <Typography variant="body2">
                                    <Box fontWeight="fontWeightBold">
                                        {props.product.price} ₺
                                    </Box>
                                </Typography>
                                <Typography variant="caption">
                                    {props.product.vendor_name}
                                </Typography>
                            </text>
                        </div>
                    </Paper>
                </Button>
            </Link>
        </Grid>
    );
}
