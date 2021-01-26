import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Avatar from "@material-ui/core/Avatar";
import {ThemeProvider, createMuiTheme, makeStyles} from "@material-ui/core/styles";
import Navbar from "../NavigationBar/NavBar";
import axios from 'axios'
import { green } from '@material-ui/core/colors';
import {Alert} from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {ListsDialog} from "./ProductBox"
import Footer from "../Footer/Footer";
import {IconButton} from "@material-ui/core";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import withStyles from "@material-ui/core/styles/withStyles";
import AddAlertIcon from '@material-ui/icons/AddAlert';
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import Divider from "@material-ui/core/Divider";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import Axios from "axios";

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

const CustomTypography = withStyles({
    root: {
        color: "#ffffff"
    }
})(Typography);


export default function ProductDetailPage() {
    return (
        <ThemeProvider theme={theme} >

            <Grid container spacing={15} direction="column" className="DetailPage">
                <Grid item xs={12}>
                    <Paper>
                        <Navbar />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <ProductDetail />
                    </Paper>
                </Grid>

            </Grid>


        </ThemeProvider>
    );
}
class ProductDetail extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            product: [],
            comments:[],
            product_not_found : true,
            isAlertOpen: false,
            isListOpen: false,
            isAlertMenuOpen: false,
        }

        this.addToShoppingCart = this.addToShoppingCart.bind(this);
        this.handleAlertClose = this.handleAlertClose.bind(this)
        this.openNotificationMenu = this.openNotificationMenu.bind(this)
        this.handleAlertMenuClose = this.handleAlertMenuClose.bind(this)
    }

    componentDidMount() {
        const array = window.location.href.split("/")
        axios.get(`http://3.232.20.250/product/`, {

            params: {
                id: array[4]
            }
        }).then(res =>{
            this.setState({product: res.data})
            this.setState({comments: res.data.comments})
            this.setState({product_not_found: true})
        }).catch((error) => {
            console.log(error) //Logs a string: Error: Request failed with status code 404
            this.setState({product_not_found: false})
        })

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // TODO: it will fail if two different products have the same name. Resolve this.
        const array = window.location.href.split("/")
        if(this.state.product.name !== prevState.product.name)
        {
            axios.get("http://3.232.20.250/product/", {
                params: {
                    id: array[4]
                }
            }).then(res =>{
                console.log(res);
                this.setState({product: res.data})
                this.setState({comments: res.data.comments})
                this.setState({product_not_found: true})
            }).catch((error) => {
                console.log(error) //Logs a string: Error: Request failed with status code 404
                this.setState({product_not_found: false})
            })
        }


    }

    addToShoppingCart(){
        console.log(this.state.product.id)
        const formData = new FormData();
        formData.append("product_id", this.state.product.id);
        console.log("Token " + window.sessionStorage.getItem("authToken"))
        axios.post('http://3.232.20.250/shoppingcart/add',
            formData, {
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            })
            .then(res => {
                console.log(res);
                console.log(res.status);
                if(res.status === 200)
                {
                    this.setState({isAlertOpen: true})
                }
            })
            .catch(error =>{
                console.log(error)
                alert ("There has been an error. Please try again.");
            })
    }

    openNotificationMenu(){
        this.setState({isAlertMenuOpen: true})
    }

    handleAlertClose(){
        this.setState({isAlertOpen: false})
    }
    addToShoppingList = () => {
        this.setState({isListOpen: true})
    }

    handleListsClose = () => {
        this.setState({isListOpen: false})
    }
    handleAlertMenuClose= () => {
        this.setState({isAlertMenuOpen: false})
    }

    render(){

        return(

            <div >
                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                {this.state.product_not_found &&
                <Grid className="product-page"  id="photo" container spacing={3}>
                    <Grid  item xs={6}>
                        <ButtonBase >
                            <img  alt="complex" src={this.state.product.photo_url}  width="300" height="300"/>
                        </ButtonBase>
                    </Grid>
                    <Grid  container item  xs={6} alignItems="flex-start" justify="left">
                        <Grid item>
                            <Typography align="left">
                                <h1>{this.state.product.name}</h1>
                                <Typography variant="h4"><b>{this.state.product.price}₺</b></Typography>
                                <Link to={`/vendorPublicProfile/${this.state.product.vendor_name}`}>
                                    <b> Vendor: </b> {this.state.product.vendor_name}<br></br>
                                </Link>
                                <b> Description: </b> {this.state.product.description}<br></br>
                            </Typography>

                            <List>
                                {this.state.comments.map((comment) => (
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar style={{backgroundColor: "#388e3c"}}>
                                                {comment.customer}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={comment.customer}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="textPrimary"
                                                    >
                                                    </Typography>
                                                    {comment.text}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>

                                ))
                                }
                            </List>
                        </Grid>
                        <Grid  item container xs={12} spacing={5}>
                            <Grid item>
                                <Tooltip title={window.sessionStorage.getItem("isLogged") ? "" : "You need to login."}>
                                    <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                        <Button variant="contained" color="secondary" onClick={this.addToShoppingList}
                                                disabled={!window.sessionStorage.getItem("isLogged")}>
                                            <PlaylistAddIcon/>
                                            <CustomTypography>
                                                Add To List
                                            </CustomTypography>
                                        </Button>
                                        {this.state.isListOpen? (
                                            <ListsDialog open={this.state.isListOpen} productId={this.state.product.id} onClose={this.handleListsClose}/>
                                        ):(
                                            <div></div>
                                        )}
                                    </Typography>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title={window.sessionStorage.getItem("isLogged") ? "" : "You need to login."}>
                                    <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                        <Button variant="contained" color="secondary" onClick={this.addToShoppingCart}
                                                disabled={!window.sessionStorage.getItem("isLogged")} >
                                            <AddShoppingCartIcon/>
                                            <CustomTypography>
                                                Add to Cart
                                            </CustomTypography>
                                        </Button>
                                    </Typography>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title={window.sessionStorage.getItem("isLogged") ? "" : "You need to login."}>
                                    <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                        <Button variant="contained" color="secondary" onClick={this.openNotificationMenu}
                                                disabled={!window.sessionStorage.getItem("isLogged")}>
                                            <AddAlertIcon/>
                                            <CustomTypography>
                                                 Alert Me
                                            </CustomTypography>
                                        </Button>
                                        {this.state.isAlertMenuOpen? (
                                            <AlertMenu open={true} productId={this.state.product.id} onClose={this.handleAlertMenuClose}/>
                                        ):(
                                            <div></div>
                                        )}
                                    </Typography>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br/>
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                </Grid>}
                {!this.state.product_not_found &&
                <Grid item>
                    <Typography variant="subtitle1">Product Not Found</Typography>
                </Grid>
                }
                <Snackbar open={this.state.isAlertOpen} autoHideDuration={2000} onClose={this.handleAlertClose}>
                    <Alert onClose={this.handleAlertClose} severity="success">
                        Product is added to shopping cart.
                    </Alert>
                </Snackbar>
                <Footer/>
            </div>
        )
    }
}


const alertMenuStyles =  makeStyles((theme) => ({
    textField:{
        fontSize:15
    },
    input:{
        width: 70
    },
}));


export function AlertMenu(props){
    const classes = alertMenuStyles()

    const { open, onClose} = props;
    const [isLoaded, setIsLoaded] = React.useState(false)

    const [priceChangeAlert, setPriceChangeAlert] = React.useState(false);
    const [priceBelowAlert, setPriceBelowAlert] = React.useState(false);
    const [stockAlert, setStockAlert] = React.useState(false);

    const [priceBelowAlertId, setPriceBelowAlertId] = React.useState(-1);
    const [priceChangeAlertId, setPriceChangeAlertId] = React.useState(-1);
    const [stockAlertId, setStockAlertId] = React.useState(-1);

    const [update, setUpdate] = React.useState(false);
    const [alertsList, setAlertsList] = React.useState([]);

    const [priceLevel, setPriceLevel] = React.useState(30);
    const [stockLevel, setStockLevel] = React.useState(30);


    useEffect(() => {
       getAlerts()
    }, [])

    const handleClose = () => {
        setIsLoaded(false)
        onClose();
    };

    function getAlerts()
    {
        Axios.get('http://3.232.20.250/notifications/get_alerts',{
            params: {
                product_id:  props.productId
            },
            headers: {
                'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
            }
        })
        .then(res => {
            console.log("ALERTS:")
            console.log(res.data)
            for(const alert of res.data)
            {
                switch (alert.type) {
                    case 1:
                        setPriceBelowAlertId(alert.id)
                        setPriceBelowAlert(true)
                        setPriceLevel(alert.value)
                        break;
                    case 2:
                        setPriceChangeAlertId(alert.id)
                        setPriceChangeAlert(true)
                        break;
                    case 3:
                        setStockAlertId(alert.id)
                        setStockAlert(true)
                        setStockLevel(alert.value)
                        break;
                    default:
                }
            }
        })
    }

    function setAlertBelowPrice()
    {
        if (!priceBelowAlert){
            const formData = new FormData();
            formData.append("product_id", props.productId);
            formData.append("type", "1");
            formData.append("value", priceLevel.toString());
            axios.post('http://3.232.20.250/notifications/create_alert',
                formData, {
                    headers: {
                        'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                    }
                })
                .then(res => {
                    console.log(res);
                    console.log(res.status);
                    setPriceBelowAlert(true);
                    setPriceBelowAlertId(res.data);
                })
        }
        else{
            setPriceBelowAlert(false);
            deleteAlert(priceBelowAlertId)
            setPriceBelowAlertId(-1);

        }
        setPriceBelowAlert(!priceBelowAlert);
    }

    function setAlertForPriceChanges() {
        if (!priceChangeAlert){
            const formData = new FormData();
            formData.append("product_id", props.productId);
            formData.append("type", "2");
            axios.post('http://3.232.20.250/notifications/create_alert',
                formData, {
                    headers: {
                        'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                    }
                })
                .then(res => {
                    console.log("Price change alert is created");
                    console.log(res)
                    console.log(res.status);
                    setPriceChangeAlert(true);
                    setPriceChangeAlertId(res.data)
                })
        }
        else{
            setPriceChangeAlert(false)
            deleteAlert(priceChangeAlertId)
            setPriceChangeAlertId(-1)
        }
        setPriceChangeAlert(!priceChangeAlert);
    }

    function setAlertForStock()
    {
        if (!stockAlert){
            const formData = new FormData();
            formData.append("product_id", props.productId);
            formData.append("type", "3");
            formData.append("value", stockLevel.toString());
            axios.post('http://3.232.20.250/notifications/create_alert',
                formData, {
                    headers: {
                        'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                    }
                })
                .then(res => {
                    console.log(res);
                    console.log(res.status);
                    setStockAlert(true)
                    setStockAlertId(res.data)
                })
        }
        else{
            setStockAlert(false)
            deleteAlert(stockAlertId)
            setStockAlertId(-1)
        }
        setStockAlert(!stockAlert);
    }

    function deleteAlert(alert_id){
        console.log("Will be deleted ", alert_id)
        const formData = new FormData()
        formData.append("id", alert_id)
        axios.post('http://3.232.20.250/notifications/delete_alert',
            formData, {
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            })
            .then(res => {
                console.log(res);
                console.log(res.status);
                console.log("Alert is deleted.")
            })
    }

    const handlePriceLevelSlider = (event, newValue) => {
        setPriceLevel(newValue);
    };

    const handleStockLevelSlider = (event, newValue) => {
        setStockLevel(newValue);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <div style={{
                display: "flex",
                flexWrap: 'nowrap',
                justifyContent: 'space-around',
                height: "auto",
                width: "270px",

            }}>
                <DialogTitle>
                    <Typography>Set Alerts:</Typography>
                </DialogTitle>
                <IconButton onClick={handleClose}>
                    <CloseIcon/>
                </IconButton>
            </div>
            <Divider/>
            <List>
                <ListItem>
                    <Checkbox checked={priceChangeAlert}
                              onClick={setAlertForPriceChanges}/>
                    <Typography variant={"body2"}>Alert me for price changes.</Typography>
                </ListItem>
                <Divider/>
                <ListItem style={{marginTop:10, marginBottom: 10}}>
                    <Checkbox checked={priceBelowAlert}
                              onClick={setAlertBelowPrice}/>
                    <Grid container direction={"column"}>
                        <Grid item>
                            <Typography variant={"body2"}>Alert me below a <b>price level.</b></Typography>
                        </Grid>
                            <Grid item style={{marginTop: 40}} >
                                <Tooltip title={"To change, please uncheck first."} disableHoverListener={!priceBelowAlert}>
                                    <span>
                                        <Slider
                                            value={priceLevel}
                                            aria-labelledby="input-slider"
                                            onChange={handlePriceLevelSlider}
                                            valueLabelDisplay="on"
                                            min={0}
                                            max={10000}
                                            color={"primary"}
                                        />
                                    </span>
                                </Tooltip>
                            </Grid>
                            <Grid item style={{margin: "auto"}}>
                                    <Input
                                        className={classes.input}
                                        value={priceLevel}
                                        margin="dense"
                                        onChange={handlePriceLevelSlider}
                                        inputProps={{
                                            step: 10,
                                            min: 0,
                                            max: 10000,
                                            type: 'number',
                                            'aria-labelledby': 'input-slider',
                                        }}
                                        disabled={priceBelowAlert}
                                    />
                            </Grid>
                    </Grid>
                </ListItem>
                <Divider/>
                <ListItem style={{marginTop: 10}}>
                    <Checkbox checked={stockAlert}
                             onClick={setAlertForStock}/>
                     <Grid container direction={"column"}>
                         <Grid item>
                             <Typography variant={"body2"}>Alert me above a <b>stock level</b></Typography>
                         </Grid>
                             <Grid item style={{marginTop: 40}}>
                                 <Tooltip title={"To change, please uncheck first."} disableHoverListener={!stockAlert}>
                                     <span>
                                         <Slider
                                             value={typeof stockLevel === 'number' ? stockLevel : 0}
                                             aria-labelledby="input-slider"
                                             onChange={handleStockLevelSlider}
                                             valueLabelDisplay="on"
                                             min={0}
                                             max={500}
                                         />
                                     </span>
                                 </Tooltip>
                             </Grid>
                             <Grid item style={{margin: "auto"}}>
                                     <Input
                                         className={classes.input}
                                         value={stockLevel}
                                         margin="dense"
                                         onChange={handleStockLevelSlider}
                                         inputProps={{
                                             step: 10,
                                             min: 0,
                                             max: 10000,
                                             type: 'number',
                                             'aria-labelledby': 'input-slider',
                                         }}
                                         disabled={stockAlert}/>
                             </Grid>
                     </Grid>
                </ListItem>
            </List>
            <Divider/>
        </Dialog>
    )
}



