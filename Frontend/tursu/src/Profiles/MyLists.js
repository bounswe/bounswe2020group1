import React, {Component, useEffect} from 'react';
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
import axios from "axios";
import {Link} from "react-router-dom";



export default function MyLists(props){
    const [lists, setLists] = React.useState([])

    function getLists(){
        axios.get("http://3.232.20.250/shoppinglist/getlists/",{
            headers: {
                'Authorization': "Token " + window.sessionStorage.getItem("authToken")
            }
        }).then(res =>{
            console.log("SHOPPING LISTS:", res.data)
            setLists(res.data)
        })
    }

    //ComponentDidMount
    useEffect(() => {
        getLists()
    }, [])

    function handleDelete(){
        getLists()
    }

    return(
        <div>
            {lists.map((item) => (
               <AList name={item} onDelete={handleDelete}/>
            ))}
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

export function AList(props){
    const classes = listStyle()


    function handleDelete(){
        const formData = new FormData();
        formData.append("list_name", props.name);

        axios.post('http://3.232.20.250/shoppinglist/deletelist/',
            formData,{
                headers: {
                    'Authorization': "Token " + window.sessionStorage.getItem("authToken"),
                }
            })
            .then(res => {
                console.log(res);
            })
            .catch(error =>{
                console.log(error)
                alert ("There has been an error. Please try again.");
            })
        props.onDelete()
    }

    const gotoLink = '/shoppingList/' + props.name;
    return(
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={5}>
                <Grid container item className={classes.grid} alignItems="center" spacing={4}>
                    <Grid item className={[classes.marginInsideGrid].join(" ") }>
                        <Typography variant="subtitle2" className={classes.listName}>
                            {props.name}
                        </Typography>
                    </Grid>
                    <Grid item className={classes.marginInsideGrid}>
                        <Link to={gotoLink}>
                            <Button variant={"contained"} className={classes.goToListButton}>
                                Go to the List
                            </Button>
                        </Link>
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