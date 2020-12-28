import React from 'react';
import './HomePage.css'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Stepper from './Stepper'
import Navbar from "./NavBar";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ProductBox from "./ProductBox";
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


class HomePage extends React.Component{
    state = {
        products: []
    }

    componentDidMount() {
        // if(window.sessionStorage.getItem("isLogged"))
        // {
        //     Axios.get('http://3.232.20.250/recommendation/recommended',{
        //         headers: {
        //             'Authorization': "Token " + window.sessionStorage.getItem("authToken")
        //         }}).then(res => {
        //             console.log(res)
        //             if(res.data.length<10)
        //             {
        //                 Axios.get('http://3.232.20.250/recommendation/recommended',{
        //                     headers: {
        //                         'Authorization': "Token " + window.sessionStorage.getItem("authToken")
        //                     }}).then(res => {
        //                         this.setState({ products: res.data})
        //                 })
        //             }
        //             else
        //             {
        //                 this.setState({ products: res.data})
        //             }
        //     })
        //
        // }
        // else{
        Axios.get('http://3.232.20.250/').then(res => {
            console.log(res)
            this.setState({ products: res.data})
        })
        // }
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
                    <Grid item xs={12} container spacing={6}>
                        {this.state.products.map((product) => ( <ProductBox product={product}/>))}
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

export default HomePage;

