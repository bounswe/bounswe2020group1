import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "./NavBar";
import Filter from "./FilterBar";
import ProductList from "./ProductList";
import VendorList from "./VendorList";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import Axios from "axios";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';



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

class SearchPage extends React.Component{

    state = {
        products : [],
        vendors : [],
        search_url: [],
        range: [],
        vendor: null,
        category: null,
        category_switch: null,
        vendor_switch: null,
        sort: null,
        vendor_list: [],
        filter_tab: false,

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
        const array = window.location.href.split("/")
        Axios.get('http://3.232.20.250/search/',{
            params: {
                search_string : array[4],
                search_type : array[5],
                ...( array[6] !== null ? { fprice_lower: array[6] } : {}),
                ...( array[7] !== null ? { fprice_upper: array[7] } : {}),
                ...( array[8] !== null ? { fvendor: array[8] } : {}),
                ...( array[9] !== null ? { fcategory: array[9] } : {}),
                ...( array[10] !== null ? { sort_by: array[10] } : {}),
            }

        })
            .then(res => {
                console.log(res)
                this.setState({products: res.data});
                this.setState({search_url: array.slice(4,11)});
            })

        Axios.get('http://3.232.20.250/helper/allvendors',{
        })
            .then(res => {
                console.log(res)
                this
                    .setState({vendor_list: res.data})
            })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        const array = window.location.href.split("/")



        if((array[4] !== prevProps.match.params.search_string)||(this.state.range !== prevState.range)||(this.state.vendor !== prevState.vendor)|| (this.state.sort !== prevState.sort)||(this.state.category !== prevState.category)||(this.state.category_switch !== prevState.category_switch)||(this.state.vendor_switch !== prevState.vendor_switch)){
            console.log(this.state.category)
            Axios.get('http://3.232.20.250/search/',{
                params: {
                    search_string : array[4],
                    search_type : array[5],
                    fprice_lower: this.state.range[0],
                    fprice_upper: this.state.range[1],
                    ...( this.state.category_switch !== true ? { fcategory: null } : { fcategory: this.state.category }),
                    ...( this.state.vendor_switch !== true ? { fvendor_name: null } : { fvendor_name: this.state.vendor }),
                    sort_by:this.state.sort
                }
            })
                .then(res => {
                    console.log(res)
                    this.setState({products: res.data});
                    this.setState({search_url: array.slice(4,11)});
                })
        }
    }

    toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        this.setState({filter_tab: open});
    };

    render(){
        if("product"==this.state.search_url[1]){
            return(
                <ThemeProvider theme={theme} >
                    <Grid item xs={12}>
                        <Paper>
                            <Navbar />
                        </Paper>
                    </Grid>
                    <Grid container xs={12} direction="column">
                        <Grid item xs={3} direction="column">

                            <SwipeableDrawer
                                variant="temporary"
                                anchor="left"
                                open={this.state.filter_tab}
                                onClose={this.toggleDrawer(false)}
                                onOpen={this.toggleDrawer(true)}
                            >

                                <Filter inCategory={true} callbackRange = {this.handleCallbackdataRange} callbackVendor= {this.handleCallbackdataVendor} callbackCategory = {this.handleCallbackdataCategory} callbackSort = {this.handleCallbackdataSort} callbackCategorySwitch={this.handleCallbackdataCategorySwitch} callbackVendorSwitch={this.handleCallbackdataVendorSwitch} vendorList={this.state.vendor_list}/>
                            </SwipeableDrawer>
                        </Grid>
                        <br/><br/><br/><br/><br/><br/><br/><br/>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={this.toggleDrawer(true)}>Filter</Button>
                        </Grid>
                        <br/><br/>
                        <Grid item xs={12} direction="column">

                            <ProductList products={this.state.products}/>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            );
        }
        else{
            return(
                <ThemeProvider theme={theme} >
                    <Grid container spacing={15} direction="column" className="HomePage">
                        <Grid item xs={12}>
                            <Paper>
                                <Navbar />
                            </Paper>
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            <Paper>
                                <Filter />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} container>
                            <VendorList vendors={this.state.products}/>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            );
        }
    }
}

export default SearchPage;
