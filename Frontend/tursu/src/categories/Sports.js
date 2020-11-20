import '../App.css';
import HomePage from "../HomePage";
import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Stepper from '../Stepper'
import ProductGrid from '../ProductGrid'
import Navbar from "../NavBar";
import ProductList from "../ProductList";
//import HomeGrid from "./HomeGrid";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

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


class electronics extends React.Component{
    //TODO: understand the below structure.
    render(){
        return(
            <ThemeProvider theme={theme} >
                <Grid container spacing={15} direction="column" className="HomePage">
                    <Grid item xs={12}>
                        <Paper>
                            <Navbar />
                        </Paper>
                    </Grid>
                    <h1> SPORTS & OUTDOORS </h1>
                    <Grid item xs={12}>
                        <Paper>
                            <ProductList />
                        </Paper>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

export default electronics;
