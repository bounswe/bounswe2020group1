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

// TODO: Disable already existing vendor chat flows.
export default function FormDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [vendor, setVendor] = React.useState("");
    const [list, setList] = React.useState([])
    const [usedV, setUsedV] = React.useState(["asena_initial_value"])

    const handleClickOpen = () => {
        axios({
              method: 'get',
              url: 'http://3.232.20.250/message/flow/customer/',
              headers: {Authorization: 'Token ' + window.sessionStorage.getItem("authToken")}
              })
          .then(res => {
              console.log(res)
              var usedVendors = []
              for (var i=0; i<(res.data).length; i++){
                  usedVendors.push((res.data)[i].vendor_name)
              }
              setUsedV (usedVendors)

              axios({
                    method: 'get',
                    url: 'http://3.232.20.250/helper/allvendors/',
                    headers: {Authorization: 'Token ' + window.sessionStorage.getItem("authToken")}
                    })
                .then(res => {
                    console.log(res)
                    setList (res.data)
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
        setVendor(e.target.value)
    };


    const handleSubmit = (e) => {
        var token = sessionStorage.getItem("authToken");
        var bodyFormData = new FormData();
        bodyFormData.append('vendor_name', vendor);
        axios({
            method: 'post',
            url: 'http://3.232.20.250/message/startflow/customer/',
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
        })
        setOpen (false)
    };

    return (
        <div>
        <Grid>
        <Tooltip title="Start a New Chat">
            <IconButton onClick={handleClickOpen} size="small">
                <AddCommentIcon/>
                <Typography>New Chat</Typography>
            </IconButton>
            </Tooltip>
        </Grid>

          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Start a New Chat</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Select a vendor with whom you would like to start a chat.
              </DialogContentText>
                {(list!=[] && usedV!=["asena_initial_value"]) ?(
                <FormControl component="fieldset">
                  <FormLabel component="legend">Vendors:</FormLabel>
                  <RadioGroup aria-label="gender" name="gender1" value={vendor} onChange={handleChange}>
                  {console.log(list)}
                  {console.log(usedV)}
                  {list.map((list_item) => (
                         (usedV.includes(list_item) && <FormControlLabel value="disabled" disabled control={<Radio />} label={list_item} />) ||
                         (!usedV.includes(list_item) && <FormControlLabel value={list_item} control={<Radio />} label={list_item} />)
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
                Start Chat
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    );
}
