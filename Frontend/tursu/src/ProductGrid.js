import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        backgroundColor: "#3CBC8D",
    },
}));

export default function CenteredGrid(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>

                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <div className="ProductInfo">
                            <img
                                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.manufactum.de%2Fis%2Fimage%2FManufactum%2F1000s_shop%2Ftelefon-w-48--67326_01.jpg&f=1&nofb=1"
                                alt={props.name}
                                className="responsiveImage"/>
                            <text>
                                <br/>
                                {props.name} <br/>
                                {props.price}
                            </text>
                        </div>
                    </Paper>
                </Grid>

                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <div className="ProductInfo">
                            <img
                                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.manufactum.de%2Fis%2Fimage%2FManufactum%2F1000s_shop%2Ftelefon-w-48--67326_01.jpg&f=1&nofb=1"
                                alt={props.name}
                                className="responsiveImage"/>
                            <text>
                                <br/>
                                {props.name} <br/>
                                {props.price}
                            </text>
                        </div>
                    </Paper>
                </Grid>

                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <div className="ProductInfo">
                            <img
                                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.manufactum.de%2Fis%2Fimage%2FManufactum%2F1000s_shop%2Ftelefon-w-48--67326_01.jpg&f=1&nofb=1"
                                alt={props.name}
                                className="responsiveImage"/>
                            <text>
                                <br/>
                                {props.name} <br/>
                                {props.price}
                            </text>
                        </div>
                    </Paper>
                </Grid>

                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <div className="ProductInfo">
                            <img
                                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.manufactum.de%2Fis%2Fimage%2FManufactum%2F1000s_shop%2Ftelefon-w-48--67326_01.jpg&f=1&nofb=1"
                                alt={props.name}
                                className="responsiveImage"/>
                            <text>
                                <br/>
                                {props.name} <br/>
                                {props.price}
                            </text>
                        </div>
                    </Paper>
                </Grid>

            </Grid>
        </div>
    );
}