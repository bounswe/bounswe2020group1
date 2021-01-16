import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import AddCommentIcon from '@material-ui/icons/AddComment';
import {Tooltip} from "@material-ui/core";
import axios from "axios";
import { Radio, Typography } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';

export default function VendorFormDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [option, setOption] = React.useState("");
    const [products, setProducts] = React.useState(["initial_value"])
    const [orders, setOrders] = React.useState(["initial_value"])
    const [usedV, setUsedV] = React.useState(["initial_value"])
    const [map, setMap] = React.useState({"initial_key":"initial_value"})

    const handleClickOpen = () => {
        axios({
              method: 'get',
              url: 'http://3.232.20.250/message/flow/vendor/',
              headers: {Authorization: 'Token ' + window.sessionStorage.getItem("authToken")}
              })
          .then(res => {
              console.log(res)
              var usedObjects = []
              for (var i=0; i<(res.data.admin_flows).length; i++){
                  usedObjects.push((res.data.admin_flows)[i].context + " " + (res.data.admin_flows)[i].object_id)
              }
              setUsedV (usedObjects)

              axios({
                    method: 'get',
                    url: 'http://3.232.20.250/vendorpage',
                    headers: {Authorization: 'Token ' + window.sessionStorage.getItem("authToken")}
                    })
                .then(res => {
                    console.log(res)
                    var names = {}
                    for (var i=0; i<(res.data.products).length; i++){
                        names[res.data.products[i].id]=res.data.products[i].name
                    }
                    setMap (names)
                    setProducts (res.data.products)
                    setOrders (res.data.orders)
                    setOpen (true)
                })
                .catch(error =>{
                    if (error.response){
                        console.log(error.response.message);
                    }
              })
          })
          .catch(error =>{
              if (error.response){
                  console.log(error.response.message);
              }
        })
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        console.log(e.target.value)
        setOption(e.target.value)
    };


    const handleSubmit = (e) => {
    if (option!=""){
        var token = sessionStorage.getItem("authToken");
        var splitData = option.split(" ");
        console.log(splitData[0])
        console.log(splitData[1])
        var bodyFormData = new FormData();
        bodyFormData.append('context', splitData[0]);
        bodyFormData.append('object_id', splitData[1]);
        axios({
            method: 'post',
            url: 'http://3.232.20.250/message/startflow/vendor/',
            data: bodyFormData,
            headers: {Authorization: 'Token ' + token}
            })
        .then(res => {
            console.log(res)
            props.onSubmit()
        })
        .catch(error =>{
            if (error.response){
                console.log(error.response.message);
            }
        })}
        setOpen (false)
    };

    return (
        <div>
        <Grid>
        <Tooltip title="Start a New Conversation with the Admin">
            <IconButton onClick={handleClickOpen} size="small">
                <AddCommentIcon/>
                <Typography>New Conversation</Typography>
            </IconButton>
            </Tooltip>
        </Grid>

          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Start a New Chat</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Select a product or order about which you would like to start a conversation.
              </DialogContentText>
                {(products!=["initial_value"] && orders!=["initial_value"] && usedV!=["initial_value"]) ?(
                <FormControl component="fieldset">
                  <FormLabel component="legend">Your Products and Orders:</FormLabel>
                  <RadioGroup aria-label="gender" name="gender1" value={option} onChange={handleChange}>
                  {products.map((product_item) => (
                         (usedV.includes("product " + product_item.id) && <FormControlLabel value="disabled" disabled control={<Radio />} label={"Product: " + product_item.name} />) ||
                         (!usedV.includes("product " + product_item.id) && <FormControlLabel value={"product " + product_item.id} control={<Radio />} label={"Product: " + product_item.name} />)
                  ))}
                  {orders.map((order_item) => (
                         (usedV.includes("order " + order_item.id) && <FormControlLabel value="disabled" disabled control={<Radio />} label={"Order-> Product: " + map[order_item.product] + " | Customer: " + order_item.customer} />) ||
                         (!usedV.includes("order " + order_item.id) && <FormControlLabel value={"order " + order_item.id} control={<Radio />} label={"Order-> Product: " + map[order_item.product] + " | Customer: " + order_item.customer} />)
                  ))}
                  </RadioGroup>
                </FormControl>
                ):(
                <div></div>
                )}

            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={event => handleSubmit(event)} color="primary">
                Start Conversation
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    );
}
