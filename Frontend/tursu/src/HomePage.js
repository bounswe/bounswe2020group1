import React from 'react';
import './HomePage.css'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Stepper from './Stepper'
import ProductGrid from './ProductGrid'
import Navbar from "./NavBar";
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

const style = {

}

// put each div into a grid
// bunu da Product gibi farklı bi js dosyasına(HomeGrid) atıp importlamayı denedim ama beceremedim, ona bi bakmak lazım
class HomePage extends React.Component{
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
                    <Grid item xs={12}>
                        <Paper>
                            <Stepper />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <Product name="telefon" price="3600" imageUrl="blbalba"/>
                        </Paper>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

// import and use productGrid
class Product extends React.Component {

    render() {
        return(
            <div className="container">
                <ProductGrid name={this.props.name} price={this.props.price} imageUrl={this.props.imageUrl}/>
            </div>
        );
    }
}

export default HomePage;
