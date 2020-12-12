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

    state = {
        product: [],
    };

    componentDidMount() {
        const array = window.location.href.split("/")
        axios.get(`http://3.232.20.250/product/`, {

            params: {
                id: array[4]
            }
        }).then(res =>{
            console.log(res);
            this.setState({product: res.data})
        })
    }
    componentDidUpdate() {
        axios.get("http://3.232.20.250/product/", {
            params: {
                id: window.sessionStorage.getItem("product_id")
            }
        }).then(res =>{
            console.log(res);
            this.setState({product: res.data})
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
                                    <Button variant="contained" color="primary">
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
                            <Typography variant="body2" color="textPrimary" align="left">
                                <Avatar alt="Remy Sharp" src="https://raw.githubusercontent.com/bounswe/bounswe2020group1/master/images/logo.PNG" />
                                I bought this sneakers and I am satisfied with it.
                            </Typography>

                        </Paper>
                    </Grid>

                    <Grid item xs={6}>
                        <Paper >

                            <Typography variant="body2" color="textPrimary" align="left">
                                <Avatar alt="Al" >Al
                                </Avatar>
                                {window.location.href}

                            </Typography>

                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

