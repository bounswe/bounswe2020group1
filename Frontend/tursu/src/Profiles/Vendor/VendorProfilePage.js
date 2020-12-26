import React, {Component} from 'react';
import Navbar from "../../NavBar";
import "./profile.css";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import VendorSidebar from "./VendorSidebar";
import MyInfo from "./MyInfo";
import MyProducts from "./MyProducts";
import MyOrders from "./MyOrders";


export default class VendorProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab : "info"
        }
        this.infoChange = this.infoChange.bind(this);
        this.productsChange = this.productsChange.bind(this);
        this.ordersChange = this.ordersChange.bind(this);
        this.SelectPage = this.SelectPage.bind(this);
        this.SelectTitle = this.SelectTitle.bind(this);
    }

    SelectPage(){
        switch (this.state.currentTab) {
            case "info":
                return <MyInfo />
            case "products":
                return <MyProducts />
            case "orders":
                 return <MyOrders />
        }
    }
    SelectTitle(){
        switch (this.state.currentTab) {
            case "info":
                return <h1 className="stepper">My Information</h1>
            case "products":
                return <h1 className="stepper">My Products</h1>
            case "orders":
                 return <h1 className="stepper">My Orders</h1>
        }
    }
    infoChange(){
            this.setState({
                currentTab:"info"
            });
    }
    productsChange(){
            this.setState({
                currentTab:"products"
            });
    }
    ordersChange(){
             this.setState({
                 currentTab:"orders"
             });
    }
    render() {
        return (
            <ThemeProvider>
                <Grid container direction="column" className="ProfilePage" spacing={4}>
                    <Grid item xs={12}>
                        <Paper>
                            <Navbar />
                        </Paper>
                    </Grid>
                    <div>
                        {this.SelectTitle()}
                    </div>
                    <Grid container item direction="row" spacing={1}>
                        <VendorSidebar info={this.infoChange} products={this.productsChange} orders={this.ordersChange}/>
                        {this.SelectPage()}
                    </Grid>

                </Grid>
            </ThemeProvider>
        );
    }

}
