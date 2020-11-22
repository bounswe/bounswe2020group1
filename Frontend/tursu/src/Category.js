import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "./NavBar";

import ProductList from "./ProductList";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";

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
    render(){
        return(
            <ThemeProvider theme={theme} >
                <Grid container spacing={15} direction="column" className="HomePage">
                    <Grid item xs={12}>
                        <Paper>
                            <Navbar />
                        </Paper>
                    </Grid>
                    <h1>{this.props.match.params.category}</h1>
                    <Grid item xs={12} container>
                        <ProductList />
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

export default Category;
