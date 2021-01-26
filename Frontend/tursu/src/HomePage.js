import React from 'react';
import './HomePage.css'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Stepper from './Stepper'
import Navbar from "./NavBar";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ProductBox from "./ProductBox";
import Axios from "axios";
import {Typography} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Footer from "./Footer";



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


class HomePage extends React.Component{
    state = {
        products: [],
        recommendedProducts: []
    }

    componentDidMount() {
        if(window.sessionStorage.getItem("isLogged"))
        {
            Axios.get('http://3.232.20.250/recommendation/recommended',{
                headers: {
                    'Authorization': "Token " + window.sessionStorage.getItem("authToken")
                }}).then(res => {
                    console.log(res)

                        Axios.get('http://3.232.20.250/recommendation/recommended',{
                            headers: {
                                'Authorization': "Token " + window.sessionStorage.getItem("authToken")
                            }}).then(res => {
                                this.setState({ recommendedProducts: res.data})
                        })
            })

        }
        Axios.get('http://3.232.20.250/').then(res => {
            console.log(res)
            this.setState({ products: res.data})
        })
    }

    render(){
        return(
            <ThemeProvider theme={theme} >
                <Grid container direction="column" className="HomePage" spacing={4}>
                    <Grid item xs={12}>
                        <Paper>
                            <Navbar />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className="stepper">
                            <Stepper />
                        </Paper>
                    </Grid>
                    {this.state.recommendedProducts.length>=4?(
                        <div>
                            <Typography variant="h4" style={{
                                marginTop:"20px"
                            }}>Recommended For You</Typography>
                            <Divider style={{marginBottom:"20px"}} />
                            <Grid item xs={12} container spacing={6} justify={"space-around"}>
                                {this.state.recommendedProducts.map((product) => ( <ProductBox product={product}/>))}
                            </Grid>
                            <Divider style={{margin:"20px"}}/>
                        </div>
                    ):(
                        <div></div>
                    )}
                    <Grid item xs={12} container spacing={6}>
                        {this.state.products.map((product) => ( <ProductBox product={product}/>))}
                    </Grid>
                </Grid>
                <Footer/>
            </ThemeProvider>
        );
    }
}

export default HomePage;

