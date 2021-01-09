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
import { Radio } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';

export default function FormDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [vendor, setVendor] = React.useState("");
    const [ready, setReady] = React.useState(false)
    const [list, setList] = React.useState([])

    const handleClickOpen = () => {
        axios({
              method: 'get',
              url: 'http://3.232.20.250/helper/allvendors/',
              headers: {Authorization: 'Token ' + window.sessionStorage.getItem("authToken")}
              })
          .then(res => {
              console.log(res)
              setList (res.data)
              setVendor (list[0])
              setReady (true);
              setOpen (true);
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
            </IconButton>
            </Tooltip>
        </Grid>

          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Start a New Chat</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Select a vendor with whom you would like to start a chat.
              </DialogContentText>
                {ready ?(
                <FormControl component="fieldset">
                  <FormLabel component="legend">Vendors:</FormLabel>
                  <RadioGroup aria-label="gender" name="gender1" value={vendor} onChange={handleChange}>
                  {console.log(list)}
                  {list.map((list_item) => (
                         <FormControlLabel value={list_item} control={<Radio />} label={list_item} />
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
