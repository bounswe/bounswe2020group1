import React from 'react';
import './HomePage.css'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from './AppBar';
import Stepper from './Stepper'
import ProductGrid from './ProductGrid'
//import HomeGrid from "./HomeGrid";


// put each div into a grid
// bunu da Product gibi farklı bi js dosyasına(HomeGrid) atıp importlamayı denedim ama beceremedim, ona bi bakmak lazım
class HomePage extends React.Component{
    render(){
        return(
            <div>
                <Grid container spacing={3}>
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
            </div>
        );
    }
}

// import and use AppBar.js here, can be changed tho
class Navbar extends React.Component{
    render(){
        return(
            <div className="Navbar">
                <img src = "https://raw.githubusercontent.com/bounswe/bounswe2020group1/master/images/logo.PNG"
                     alt ="logo"
                     className = "logo"
                     />
                <AppBar />
            </div>
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

//module.exports = {Navbar, Product}

export default HomePage;

/*
export {
    Navbar,
    Product,
}*/
