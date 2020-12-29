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
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import {Tooltip} from "@material-ui/core";
import axios from "axios";

export default function FormDialog(props) {
    const id = props.id

    const [open, setOpen] = React.useState(false);
    const [cargo, setCargo] = React.useState("");
    const [days, setDays] = React.useState("");

    const handleClickOpen = () => {
        setOpen (true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleCargo = (e) => {
          setCargo(e.target.value)
    };
    const handleDays = (e) => {
           setDays(e.target.value)
    };

    const handleSubmit = (e) => {
          console.log("in delivery " + id)
          console.log("in delivery " + cargo)
          console.log("in delivery " + days)

          var token = sessionStorage.getItem("authToken");
          var bodyFormData = new FormData();
          bodyFormData.append('order_id', id);
          bodyFormData.append('cargo_id', cargo);
          bodyFormData.append('days', days);
          axios({
              method: 'post',
              url: 'http://3.232.20.250/order/set_delivery/',
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
          setOpen(false);
    };
    const classes = props.classes
    return (
        <div>
        <Grid className={classes.marginInsideGrid}>
        <Tooltip title="Set status: in delivery">
            <IconButton onClick={handleClickOpen} size="small">
                <LocalShippingIcon/>
            </IconButton>
            </Tooltip>
        </Grid>
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Set Status</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To set the status of this order as 'in delivery', please enter the following information regarding the delivery.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Cargo Id"
                type="text"
                fullWidth
                cargo={cargo}
                onChange={event => handleCargo(event)}
              />
              <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Expected numnber days until delivery"
                  type="text"
                  fullWidth
                  days={days}
                  onChange={event => handleDays(event)}
                />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={event => handleSubmit(event)} color="primary">
                Set status
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    );
}
