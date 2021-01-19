import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import {Button, Typography} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from '@material-ui/icons/Check';
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import Axios from "axios";

window.sessionStorage.setItem("update", 1)
export default function NonverifiedProductBox(props) {

    console.log("NonverifiedProductBox")

    const handleVerify = () => {
        console.log("verify")
        props.callbackUpdateList(window.sessionStorage.getItem("update"))
        window.sessionStorage.setItem("update", 1+parseInt(window.sessionStorage.getItem("update")))
        props.callbackUpdateList(window.sessionStorage.getItem("update"))
        console.log(window.sessionStorage.getItem("update"))
        const formData = new FormData();
        formData.append("id", props.product.id);
        Axios.post('http://3.232.20.250/admin/verifyproduct/',formData,{
            headers: {
                'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
            }
        })
            .then(res => {
                console.log(res)
                console.log("verifysucces?")
            })
            .catch(error =>{
                console.log(error.response)
            })
    };

    const handleDelete = () => {
        console.log("delete")
        window.sessionStorage.setItem("update", 1+parseInt(window.sessionStorage.getItem("update")))
        props.callbackUpdateList(window.sessionStorage.getItem("update"))
        console.log(window.sessionStorage.getItem("update"))

        const formData = new FormData();
        formData.append("id", props.product.id);
        Axios.post('http://3.232.20.250/admin/removeproduct/',formData,{
            headers: {
                'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
            }
        })
            .then(res => {
                console.log(res)
                console.log("deletesucces?")
            })
            .catch(error =>{
                console.log(error.response)
            })
    };

    return(
        <Grid item xs={3}>
            <Link to={`/product/${props.product.id}`}>
                <Button variant="contained">
                    <Paper>
                        <div className="ProductInfo" >
                            <img
                                src={props.product.photo_url}
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
            <Grid>
                <IconButton onClick={handleVerify}>
                    <CheckIcon/>
                </IconButton>
                <IconButton onClick={handleDelete}>
                    <DeleteOutlinedIcon/>
                </IconButton>
            </Grid>

        </Grid>
    );
}
