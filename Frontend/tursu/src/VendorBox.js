import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import {Button, Typography} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import Rating from "@material-ui/lab/Rating";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        width: "200px",
        height: "200px"
    },
}));

/**
 * @brief It is the box component that is used to show vendors after vendor search.
 */
export default function VendorBox(props) {
    const classes = useStyles()
    return(
        <Grid item xs={3}>
            <Link to={`/vendorPublicProfile/${props.vendor.name}`}>
                <Button variant="contained">
                    <Paper className={classes.paper}>
                        <div className="ProductInfo" >
                            <Grid item container style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-around",
                                height: "200px"
                            }}>
                                <Grid item>
                                    <Typography variant="body1">
                                        <Box fontWeight="fontWeightBold">
                                            {props.vendor.name}
                                        </Box>

                                    </Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="caption">
                                        {props.vendor.city}
                                    </Typography>
                                </Grid>
                                <Grid>
                                    <Rating
                                        value = {props.vendor.rating}
                                        readOnly
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        {props.vendor.is_verified ? (
                            <VerifiedUserIcon color={"primary"} style={{
                                position: "absolute",
                                right: 30,
                                top: 10
                            }}/>
                        ):(
                            <div></div>
                        )}
                    </Paper>
                </Button>
            </Link>
        </Grid>
    );
}
