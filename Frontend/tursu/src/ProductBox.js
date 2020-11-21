// import and use productGrid
import React from "react";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import {Button} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        backgroundColor: "#388e3c",
    },
}));

export default function ProductBox() {
    const classes = useStyles()

    return(
        <Grid item xs={3}>
                <Button>
                    <Paper className={classes.paper}>
                        <div className="ProductInfo" >

                            <img
                                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.manufactum.de%2Fis%2Fimage%2FManufactum%2F1000s_shop%2Ftelefon-w-48--67326_01.jpg&f=1&nofb=1"
                                alt={"a"}
                                className="responsiveImage"/>
                            <text>
                                <br/>
                                {"a"}
                                <br/>
                                {"b"}
                            </text>
                        </div>
                    </Paper>
                </Button>
        </Grid>
    );
}