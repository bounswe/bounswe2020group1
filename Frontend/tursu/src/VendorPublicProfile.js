import React from "react"
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import Navbar from "./NavBar";
import {Typography} from "@material-ui/core";


const vendorProfileStyles = makeStyles((theme)=>({
    root:{

    },
    mostOuterGrid:{
        marginTop: "250px",

        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    }
}))

/**
 * @brief Public profile page of the vendor.
 *        It is displayed to other users, not to the vendor itself.
 */
export default function VendorPublicProfile(props){
    const classes = vendorProfileStyles()

    return(
        <div className={classes.root}>
            <Navbar/>
            <Grid list className={classes.mostOuterGrid}>
                <Grid list item>
                    <Grid item>
                        <Typography variant="h4">
                            Apple
                        </Typography>
                        <Typography>
                            Istanbul/Turkey
                        </Typography>

                    </Grid>
                    <Grid item>
                        Its Rating
                    </Grid>
                </Grid>
                <Grid item>
                    Products
                </Grid>
            </Grid>
        </div>
    );
}
