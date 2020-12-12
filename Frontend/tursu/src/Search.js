import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "./NavBar";
import Filter from "./FilterBar";
import ProductList from "./ProductList";
import VendorList from "./VendorList";
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


class SearchPage extends React.Component{
    state = {
        products : [],
        vendors : []
    }

    componentDidMount() {
        Axios.get('http://3.232.20.250/search/',{
            params: {
                search_string:  window.sessionStorage.getItem("searched"),
                search_type: window.sessionStorage.getItem("search_type"),
                sort_by : window.sessionStorage.getItem("sort_by")
            }
        })
            .then(res => {
                console.log(res)
                this.setState({products: res.data})
            })
    }

    componentDidUpdate() {
        Axios.get('http://3.232.20.250/search/',{
            params: {
                search_string:  window.sessionStorage.getItem("searched"),
                search_type: window.sessionStorage.getItem("search_type"),
                sort_by : window.sessionStorage.getItem("sort_by")

            }
        })
            .then(res => {
                console.log(res)
                this.setState({products: res.data})
            })
    }



    render(){
        if("product"==window.sessionStorage.getItem("search_type")){
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
                                <Filter/>
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
                                <Filter/>
                            </Paper>
                        </Grid>
                        <h1>{this.props.match.params.category}</h1>
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
