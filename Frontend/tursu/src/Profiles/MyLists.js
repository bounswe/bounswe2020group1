import React, { Component} from 'react';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {Button, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import {makeStyles} from "@material-ui/core/styles";



export default function myLists(props){
    return(
        <div>
            {aList()}
            {aList()}
            {aList()}
        </div>
    )
}

const listStyle = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper:{
        marginLeft: 100,
        marginTop: 50,
        marginBottom: 1,
        width: 500,
    },
    grid: {
        paddingLeft: theme.spacing(3),
        width: "100%",
        height: 150,
        justifyContent: "space-between"
    },
    listName: {
        marginLeft: "20px"
    },
    goToListButton: {
        width: "100px"
    },
    marginInsideGrid: {
        marginBottom:  20,
    }
}));

function aList(prop){
    const classes = listStyle()
    function handleDelete(){

    }
    return(
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={5}>
                <Grid container item className={classes.grid} alignItems="center" spacing={4}>
                    <Grid item className={[classes.marginInsideGrid].join(" ") }>
                        <Typography variant="subtitle2" className={classes.listName}>
                            List Name
                        </Typography>
                    </Grid>
                    <Grid item className={classes.marginInsideGrid}>
                        <Button variant={"contained"} className={classes.goToListButton}>
                            Go to the List
                        </Button>
                    </Grid>
                    <Grid item className={classes.marginInsideGrid}>
                        <IconButton size="small">
                            <DeleteOutlineIcon color="error" onClick={handleDelete}/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}