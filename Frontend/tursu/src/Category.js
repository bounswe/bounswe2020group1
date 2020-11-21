import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "./NavBar";

import ProductList from "./ProductList";

class Category extends React.Component{
    render(){
        return(
            <Grid container spacing={15} direction="column" className="HomePage">
                <Grid item xs={12}>
                    <Paper>
                        <Navbar />
                    </Paper>
                </Grid>
                <h1>{this.props.match.params.category}</h1>
                <Grid item xs={12}>
                    <Paper>
                        <ProductList />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default Category;
