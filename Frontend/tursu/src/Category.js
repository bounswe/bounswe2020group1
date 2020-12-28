import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "./NavBar";

import ProductListVertical from "./ProductList";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import Axios from "axios";
import Filter from "./FilterBar";
import {Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";

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
        products : [],
        range: [],
        vendor: null,
        category: null,
        category_switch: null,
        vendor_switch: null,
        sort: null,
        vendor_list: []
    }

    handleCallbackdataRange = (childData) =>{
        this.setState({range: childData})
    }
    handleCallbackdataVendor = (childData) =>{
        this.setState({vendor: childData})
    }
    handleCallbackdataCategory = (childData) =>{
        this.setState({category: childData})
    }
    handleCallbackdataSort= (childData) =>{
        this.setState({sort: childData})
    }
    handleCallbackdataCategorySwitch= (childData) =>{
        this.setState({category_switch: childData})
    }

    handleCallbackdataVendorSwitch= (childData) =>{
        this.setState({vendor_switch: childData})
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

        Axios.get('http://3.232.20.250/helper/allvendors',{
        })
            .then(res => {
                console.log(res)
                this.setState({vendor_list: res.data})
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if((prevProps.match.params.category !== this.props.match.params.category)||(this.state.range !== prevState.range)||(this.state.vendor !== prevState.vendor)|| (this.state.sort !== prevState.sort)||(this.state.category !== prevState.category)||(this.state.category_switch !== prevState.category_switch)||(this.state.vendor_switch !== prevState.vendor_switch))
        {
            Axios.get('http://3.232.20.250/product/category/',{
                params: {
                    name:  this.props.match.params.category,
                    fprice_lower: this.state.range[0],
                    fprice_upper: this.state.range[1],
                    ...( this.state.category_switch !== true ? { fcategory: null } : { fcategory: this.state.category }),
                    ...( this.state.vendor_switch !== true ? { fvendor_name: null } : { fvendor_name: this.state.vendor }),
                    sort_by:this.state.sort
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
                    <Typography >
                        <Box fontWeight={"fontWeightBold"}  fontStyle="italic">
                            {this.props.match.params.category}
                        </Box>
                    </Typography>
                    <br/>
                    <Grid item xs={12}>
                        <Paper>
                            <Filter inCategory={false} callbackRange = {this.handleCallbackdataRange} callbackVendor= {this.handleCallbackdataVendor} callbackCategory = {this.handleCallbackdataCategory} callbackSort = {this.handleCallbackdataSort} callbackCategorySwitch={this.handleCallbackdataCategorySwitch} callbackVendorSwitch={this.handleCallbackdataVendorSwitch} vendorList={this.state.vendor_list}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} container>
                        <ProductListVertical products={this.state.products}/>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

export default Category;
