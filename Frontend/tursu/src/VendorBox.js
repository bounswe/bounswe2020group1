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
    },
}));

export default function VendorBox(props) {
    const classes = useStyles()
    return(
        <Grid item xs={3}>
            <Button variant="contained" onClick={() => { window.sessionStorage.setItem("vendor_id", props.product.id); }}>
                <Paper className={classes.paper}>
                    <div className="ProductInfo" >
                        <text>
                            <br/>
                            <Typography variant="subtitle2">
                                {props.vendor.name}
                            </Typography>
                            <Typography variant="body2">
                                <Box fontWeight="fontWeightBold">
                                    {props.vendor.rating} ₺
                                </Box>
                            </Typography>
                        </text>
                    </div>
                </Paper>
            </Button>
        </Grid>
    );
}
