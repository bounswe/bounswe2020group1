import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import {Button, Typography} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

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
    //console.log(props.product.photo_url)
    return(
        <h1></h1>
        // <Grid item className={classes.grid}>
        //     <Link to='/product'>
        //         <Button variant="contained" onClick={() => { window.sessionStorage.setItem("product_id", props.product.id); }}>
        //             <Paper className={classes.paper}>
        //                 <div className="ProductInfo" >
        //                     <img
        //                         src={props.product.photo_url}
        //                         //src="https://grandstream.pl/wp-content/uploads/2016/03/left-e1456834177965.png"
        //                         alt={props.product.name}
        //                         className="responsiveImage"/>
        //                     <text>
        //                         <br/>
        //                         <Typography variant="subtitle2">
        //                             {props.product.name}
        //                         </Typography>
        //                         <Typography variant="body2">
        //                             <Box fontWeight="fontWeightBold">
        //                                 {props.product.price} ₺
        //                             </Box>
        //                         </Typography>
        //                         <Typography variant="caption">
        //                             {props.product.vendor_name}
        //                         </Typography>
        //                     </text>
        //                 </div>
        //             </Paper>
        //         </Button>
        //     </Link>
        // </Grid>
    );
}


const horizontalStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    grid: {
        padding: theme.spacing(1),
        width: "100%",
        height: 110,
    },
    smallerGrid: {
        height: 100
    },
    imageContainer: {
        width: 128,
        height: 128
    },
    image: {
        width: "50%",
        height: "auto",
    },
    paper:{
        marginLeft: 100,
        marginTop: 50,
        marginBottom: 1,
        width: 500,
    }
}));


export function ProductBoxHorizontal(props) {
    const classes = horizontalStyles()

    return(
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={5}>
                <Grid container item className={classes.grid} alignItems="center">
                    <Grid item className={classes.imageContainer}>
                        <img
                            src={props.product.photo_url}
                            //src="https://grandstream.pl/wp-content/uploads/2016/03/left-e1456834177965.png"
                            alt={props.product.name}
                            className={classes.image}/>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2">
                            {props.product.name}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">
                            <Box fontWeight="fontWeightBold">
                                {props.product.price} ₺
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="caption">
                            {props.product.vendor_name}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <ButtonGroup orientation={"vertical"}>
                            <Button
                                aria-label="increase"
                                onClick={() => {
                                    // setCount(count + 1);
                                }}
                            >
                                <AddIcon fontSize="small" />
                            </Button>
                            <Button
                                aria-label="reduce"
                                onClick={() => {
                                    // setCount(Math.max(count - 1, 0));
                                }}
                            >
                                <RemoveIcon fontSize="small" />
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
