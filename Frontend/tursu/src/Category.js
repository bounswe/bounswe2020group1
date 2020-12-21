import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "./NavBar";

import ProductListVertical from "./ProductList";
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
                name:  this.props.match.params.category
            }
        })
            .then(res => {
                console.log(res)
                this.setState({products: res.data})
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.match.params.category !== this.props.match.params.category )
        {
            Axios.get('http://3.232.20.250/product/category/',{
                params: {
                    name:  this.props.match.params.category
                }
            })
                .then(res => {
                    console.log(res)
                    this.setState({products: res.data})
                })
        }
    }

    render(){
        return(
            <ThemeProvider theme={theme} >
                <Grid container spacing={15} direction="column" className="HomePage">
                    <Grid item xs={12}>
                        <Paper>
                            <Navbar />
                        </Paper>
                    </Grid>
                    <h1>
                        {this.props.match.params.category}
                    </h1>
                    <Grid item xs={12} container>
                        <ProductListVertical products={this.state.products}/>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

export default Category;
