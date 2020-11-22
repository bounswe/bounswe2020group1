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


// put each div into a grid
// bunu da Product gibi farklı bi js dosyasına(HomeGrid) atıp importlamayı denedim ama beceremedim, ona bi bakmak lazım
class HomePage extends React.Component{
    state = {
        products: []
    }

    componentDidMount() {
        Axios.get('http://3.232.20.250/').then(res => {
            console.log(res)
            this.setState({ products: res.data})
        })
    }

    render(){
        return(
            <ThemeProvider theme={theme} >
                <Grid container direction="column" className="HomePage">
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
                    <Grid item xs={12} container spacing={6}>
                        {this.state.products.map((product) => ( <ProductBox product={product}/>))}
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

export default HomePage;

