import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "./NavBar";
import Filter from "./FilterBar";
import ProductList from "./ProductList";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
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


class Category extends React.Component{
    state = {
        products : []
    }

    componentDidMount() {
        Axios.get('http://3.232.20.250/product/category/',{
            params: {
                name:  this.props.match.params.category,
                // sort_by : "priceAsc"
            }
        })
            .then(res => {
                console.log(res)
                this.setState({products: res.data})
            })
    }

    componentDidUpdate() {
        Axios.get('http://3.232.20.250/product/category/',{
            params: {
                name:  this.props.match.params.category,
                // sort_by : "priceAsc"
            }
        })
            .then(res => {
                console.log(res)
                this.setState({products: res.data})
            })
    }


    render(){
        return(
            <ThemeProvider theme={theme} >
                <Grid container spacing={15} direction="column" className="HomePage">
                    <Grid item xs={12}>
                        <Paper>
                            <Filter />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <Navbar />
                        </Paper>
                    </Grid>
                    <h1>{this.props.match.params.category}</h1>
                    <Grid item xs={12} container>
                        <ProductList products={this.state.products}/>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

export default Category;
