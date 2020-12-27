import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Avatar from "@material-ui/core/Avatar";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Navbar from "./NavBar";
import axios from 'axios'
import { green } from '@material-ui/core/colors';
import {Alert} from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

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
            product_not_found : true
            isAlertOpen: false
        }

        this.addToShoppingCart = this.addToShoppingCart.bind(this);
        this.handleAlertClose = this.handleAlertClose.bind(this)
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

    handleAlertClose(){
        this.setState({isAlertOpen: false})
    }

    render(){

        return(

            <div >
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                {this.state.product_not_found &&
                <Grid className="product-page"  id="photo" container spacing={3}>
                    <Grid  item xs={6}>
                        <ButtonBase >
                            <img  alt="complex" src={this.state.product.photo_url}  width="300" height="300"/>
                        </ButtonBase>
                    </Grid>
                    <Grid container  xs={6} alignItems="center" justify="center">

                        <Typography>
                            <h1>{this.state.product.name}</h1>
                            <b> Vendor: </b> {this.state.product.vendor_name}<br></br>
                            <b> Description: </b> {this.state.product.description}<br></br>
                        </Typography>
                    </Grid>

                    <Grid item xs={4} >
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item>
                                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                    <Button variant="contained" color="primary" onClick={this.addToShoppingCart}>
                                        Add To Cart
                                    </Button>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1">${this.state.product.price}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={8} >
                    </Grid>
                    <br/>
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;

                    <Paper id="comments">
                        {this.state.comments.map((comment) => (
                            <Typography variant="body2" color="textPrimary" align={"left"}>
                                <Avatar>{comment.customer}
                                </Avatar>
                                {comment.text}
                                <br/><br/>
                            </Typography>


                        ))
                        }
                    </Paper>
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
            </div>
        )
    }
}

