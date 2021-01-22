import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "./NavBar";
import Filter from "./FilterBar";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import Axios from "axios";
import {Typography} from "@material-ui/core";
import ProductBox from "./ProductBox";
import Divider from '@material-ui/core/Divider';
import VendorBox from "./VendorBox";




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
        range: [],
        vendor: null,
        category: null,
        category_switch: null,
        vendor_switch: null,
        sort: null,
        vendor_list: [],
        filter_tab: false,
        search_types: "",
        searched: null,
        search_type_switch: null,

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
    handleCallbackdataSearchType= (childData) =>{
        this.setState({search_types: childData})
    }
    handleCallbackSearch= (childData) =>{
        this.setState({searched: childData})
    }
    handleCallbackdataSwitchType= (childData) =>{
        this.setState({search_type_switch: childData})
    }
    componentDidMount() {
        const array = window.location.href.split("/")
        Axios.get('http://3.232.20.250/search/',{
            params: {
                search_string : array[4],
                search_type : "product",
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
            })

        Axios.get('http://3.232.20.250/search/',{
            params: {
                search_string : array[4],
                search_type : "vendor",
                ...( array[6] !== null ? { fprice_lower: array[6] } : {}),
                ...( array[7] !== null ? { fprice_upper: array[7] } : {}),
                ...( array[8] !== null ? { fvendor: array[8] } : {}),
                ...( array[9] !== null ? { fcategory: array[9] } : {}),
                ...( array[10] !== null ? { sort_by: array[10] } : {}),
            }

        })
            .then(res => {
                console.log(res)
                this.setState({vendors: res.data});
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

        console.log(this.state.search_types)
        if((this.state.search_types !== prevState.search_types)||(array[4] !== prevProps.match.params.search_string)||(this.state.range !== prevState.range)||(this.state.vendor !== prevState.vendor)|| (this.state.sort !== prevState.sort)||(this.state.category !== prevState.category)||(this.state.category_switch !== prevState.category_switch)||(this.state.vendor_switch !== prevState.vendor_switch)){
            if(this.state.search_types.includes("vendor")){
                Axios.get('http://3.232.20.250/search/',{
                    params: {
                        search_string : array[4],
                        search_type : "vendor",
                        fprice_lower: this.state.range[0],
                        fprice_upper: this.state.range[1],
                        ...( this.state.category_switch !== true ? { fcategory: null } : { fcategory: this.state.category }),
                        ...( this.state.vendor_switch !== true ? { fvendor_name: null } : { fvendor_name: this.state.vendor }),
                        sort_by:this.state.sort
                    }
                })
                    .then(res => {
                        console.log(res)
                        this.setState({vendors: res.data});
                    })
            }
            if(this.state.search_types.includes("product")){
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
                    })
            }

        }
    }
    render(){
        return(
            <ThemeProvider theme={theme} >
                <Grid item xs={12}>
                    <Paper>
                        <Navbar callbackSearched={this.handleCallbackSearch}/>
                    </Paper>
                </Grid>
                <br/><br/><br/><br/><br/><br/>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={3}>
                        <Filter callbackSwitchType={this.handleCallbackdataSwitchType} inCategory={false} callbackRange = {this.handleCallbackdataRange} callbackVendor= {this.handleCallbackdataVendor} callbackCategory = {this.handleCallbackdataCategory} callbackSort = {this.handleCallbackdataSort} callbackCategorySwitch={this.handleCallbackdataCategorySwitch} callbackVendorSwitch={this.handleCallbackdataVendorSwitch} vendorList={this.state.vendor_list} callbackSearchType={this.handleCallbackdataSearchType}/>
                    </Grid>
                    {<Grid style={{margin: '30px'}} container xs={12} sm={8} spacing={1}>

                        {this.state.products.map((product) => (


                            <Grid style={{margin: '30px', display: 'static', }} item xs={12} sm={3}>
                                {(!this.state.search_type_switch || this.state.search_types.includes("product") )&&  <ProductBox product={product}/>
                                }
                            </Grid>



                        ))}

                        {this.state.vendors.map((vendor) => (


                            <Grid style={{margin: '30px', display: 'static', }} item xs={12} sm={3}>
                                {(!this.state.search_type_switch || this.state.search_types.includes("vendor") )&&   <VendorBox vendor={vendor}/>}
                            </Grid>



                        ))}
                    </Grid>}
                    <Divider />


                    {this.state.search_types.includes("vendor") && <Grid style={{margin: '30px'}} container xs={12} sm={8} spacing={1}>


                    </Grid>}

                </Grid>
            </ThemeProvider>
        );
    }


}

export default SearchPage;
