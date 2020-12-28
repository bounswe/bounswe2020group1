import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import {Button, Typography, Tooltip} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ChatIcon from '@material-ui/icons/Chat';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {palette} from "@material-ui/system";
import axios from "axios";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Rating from '@material-ui/lab/Rating';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';



const horizontalStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper:{
        marginLeft: 100,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: 800,
        height: 90,
    },
    grid: {
        paddingLeft: theme.spacing(1),
        width: "100%",
        height: "100%",
        justifyContent: "space-between"
    },
    imageContainer: {
        width: 128,
        height: 128,
    },
    image: {
        width: "50%",
        height: "auto",
        //marginTop: "12px"
    },
    productName: {
        flex: "0 0 150px",
        textAlign: "left"
    },
    price: {
        flex: "0 0 100px",
        textAlign: "left"
    },
    brandName: {
        flex: "0 0 100px",
        textAlign: "left",
    },
    productCountBox: {
        width: 45,
        height: 64,
    },
    productCountNumber:{
        // marginBottom: 10
    },
    marginInsideGrid: {
        marginBottom:  20,
    }
}));



const theme = createMuiTheme({
    palette:{
        primary:{
            main: "#388e3c",
        },
        secondary:{
            main: "#81c784",
        }
    }
})

let token;
token = window.sessionStorage.getItem("authToken")

function set_delivered(id){
    console.log("delivered " + id)
    var auth_token = sessionStorage.getItem("authToken");
    var bodyFormData = new FormData();
    bodyFormData.append('order_id', id);
    axios({
        method: 'post',
        url: 'http://3.232.20.250/order/set_delivered/',
        data: bodyFormData,
        headers: {Authorization: 'Token ' + auth_token}
        })
    .then(res => {
        console.log(res)
        alert("Status is changed. Refresh page to view.")
    })
    .catch(error =>{
        if (error.response){
            console.log(error.response.message);
        }
    })
}
function options(status,id,classes){
    console.log(id)

     if (status ===  "in delivery"){
         return(
         <div>

         <Grid className={classes.marginInsideGrid}>
          <Tooltip title="Set status: delivered">
             <IconButton onClick={() => set_delivered(id)} size="small">
                 <LocalShippingIcon/>
             </IconButton>
             </Tooltip>
         </Grid>

         </div>
         )
     }
     else{
        return(<div><Grid className={classes.marginInsideGrid}>
                            <IconButton size="small">
                            </IconButton>
                        </Grid></div>)
     }}
export default function Product(props) {

    const classes = horizontalStyles()

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(5);
    const [comment, setComment] = React.useState("");

    const handleClickOpen = () => {
        console.log(props.product.product)

        setOpen(true);
    };

    const handleClose = () => {
        console.log("comment is ",  comment)
        console.log("value is ",  value)
        setOpen(false);
    };

    const handleComment = (e) => {
        setComment(e.target.value)
    };

    const handleSubmit = (e) => {
        const formData = new FormData();
        formData.append("product_id", props.product.product.id)
        formData.append("text", comment)
        formData.append("rating", value)
        axios
            .post("http://3.232.20.250/comment/", formData, {
                headers: {
                    'Authorization': "Token " + token //the token is a variable which holds the token
                },
            }).then((response) => {

            if (response.status === 200) {
                alert("Comment added!");
                console.log(response)
            }
        })
            .catch((err) => {
                if (err.response.status === 401) {
                    alert(err.response.data);
                }

            });
        setOpen(false);
    };

    return(
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={5}>
                <Grid container item className={classes.grid} alignItems="center" spacing={4}>
                    <Grid item className={classes.imageContainer}>
                        <img
                            src={props.product.product.photo_url}
                            alt={props.product.product.name}
                            className={classes.image}/>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.productName].join(" ") }>
                        <Typography variant="subtitle2">
                            {props.product.product.name}
                        </Typography>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.price].join(" ")}>
                        <Typography variant="body2">
                            <Box fontWeight="fontWeightBold">
                                {props.product.product.price} ₺
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.brandName].join(" ")}>
                        <Typography variant="caption">
                            {props.product.product.vendor_name}
                        </Typography>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.brandName].join(" ")}>
                        <Typography variant="caption">
                            {props.product.status}
                        </Typography>
                    </Grid>
                    <Grid item className={[classes.marginInsideGrid, classes.price].join(" ")}>
                        <Typography variant="body2">
                            <Box fontWeight="fontWeightBold">
                                {props.product.quantity}
                            </Box>
                        </Typography>
                    </Grid>
                    {options(props.product.status,props.product.id,classes)}
                    <ThemeProvider theme={theme} >
                        <Grid className={classes.marginInsideGrid}>
                        <Tooltip title="Add Comment">
                            <IconButton size="small">
                                <ChatIcon onClick={handleClickOpen}/>
                            </IconButton>
                        </Tooltip>
                            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Add a Comment</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        If you wish, you can add a comment to the product you ordered!
                                    </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Your Comment"
                                        type="text"
                                        fullWidth
                                        comment={comment}
                                        onChange={event => handleComment(event)}
                                    />
                                </DialogContent>
                                <br/>
                                <DialogContent >
                                    <Box style={{ justifyContent: 'center', display: 'flex' }} component="fieldset" mb={3} borderColor="transparent">
                                        <Typography style={{ marginBottom: '20px' }} variant="h5" align="center" component="legend">Your Rating</Typography>
                                        <Rating
                                            size="large"
                                            name="simple-controlled"
                                            value={value}
                                            onChange={(event, newValue) => {
                                                setValue(newValue);
                                            }}
                                        />
                                    </Box>
                                </DialogContent>

                                <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={event => handleSubmit(event)} color="primary">
                                        Add Comment
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </ThemeProvider>

                </Grid>
            </Paper>
        </div>
    );
}