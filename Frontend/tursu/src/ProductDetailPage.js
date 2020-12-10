import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Avatar from "@material-ui/core/Avatar";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Navbar from "./NavBar";
import axios from 'axios'

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
        }

        this.addToShoppingCart = this.addToShoppingCart.bind(this);
    }

    componentDidMount() {
        axios.get("http://3.232.20.250/product/", {
            params: {
                id: window.sessionStorage.getItem("product_id")
            }
        }).then(res =>{
            console.log(res);
            this.setState({product: res.data})
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // TODO: it will fail if two different products have the same name. Resolve this.
        if(this.state.product.name !== prevState.product.name)
        {
            axios.get("http://3.232.20.250/product/", {
                params: {
                    id: window.sessionStorage.getItem("product_id")
                }
            }).then(res =>{
                console.log(res);
                this.setState({product: res.data})
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
            })
            .catch(error =>{
                    console.log(error)
                    alert ("There has been an error. Please try again.");
            })
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
                <Grid id="photo" container spacing={3}>
                    <Grid  item xs={6}>
                        <ButtonBase >
                            <img  alt="complex" src={this.state.product.photo_url}  width="300" height="300"/>
                            {/*<img  alt="complex" src="https://lh3.googleusercontent.com/proxy/mPIEPUHrmQ9UEA8mUBjx34Y3SNJFTIYcxxCX_uM9jCuwhBvv4lX4n1w7QBX629OPCVV0GWHRUAWrhv-JZ9xCseTv6pcgmNZ6LQpaq2md1JHWb0mMNNggnp1iAA" />*/}
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

                    <Grid item xs={6}>
                        <Paper>
                            <Avatar alt="Remy Sharp" src="https://raw.githubusercontent.com/bounswe/bounswe2020group1/master/images/logo.PNG" />
                            <Typography variant="body2" color="textPrimary" align="left">
                                I bought this sneakers and I am satisfied with it.
                            </Typography>

                        </Paper>
                    </Grid>

                    <Grid item xs={6}>
                        <Paper >

                            <Typography variant="body2" color="textPrimary" align="left">
                                <Avatar alt="Al" >Al
                                </Avatar>
                                Some more comments
                            </Typography>

                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

