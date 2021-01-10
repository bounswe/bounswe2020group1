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
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import {Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Footer from "../../Footer";


export default class VendorProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab : "info",
            id : -1
        }
        this.infoChange = this.infoChange.bind(this);
        this.productsChange = this.productsChange.bind(this);
        this.ordersChange = this.ordersChange.bind(this);
        this.SelectPage = this.SelectPage.bind(this);
        this.SelectTitle = this.SelectTitle.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.handleID = this.handleID.bind(this);
    }

    SelectPage(){
        switch (this.state.currentTab) {
            case "info":
                return <MyInfo />
            case "products":
                return <MyProducts edit={this.editProduct} handleID={this.handleID} />
            case "orders":
                return <MyOrders />
            case "add":
                return <AddProduct />
            case "edit":
                return <EditProduct id={this.state.id} />
        }
    }
    SelectTitle(){
        switch (this.state.currentTab) {
            case "info":
                return (<div className="stepper">
                    <Typography >
                        <Box fontWeight={"fontWeightBold"}  fontStyle="italic">
                            My Information
                        </Box>
                    </Typography>
                </div>)
            case "products":
                return (<div className="stepper">
                    <Typography >
                        <Box fontWeight={"fontWeightBold"}  fontStyle="italic">
                            My Products
                        </Box>
                    </Typography>
                </div>)
            case "orders":
                return (<div className="stepper">
                    <Typography >
                        <Box fontWeight={"fontWeightBold"}  fontStyle="italic">
                            My Orders
                        </Box>
                    </Typography>
                </div>)
            case "add":
                return (<div className="stepper">
                    <Typography >
                        <Box fontWeight={"fontWeightBold"}  fontStyle="italic">
                            Add Product
                        </Box>
                    </Typography>
                </div>)
            case "edit":
                return (<div className="stepper">
                    <Typography >
                        <Box fontWeight={"fontWeightBold"}  fontStyle="italic">
                            Edit Product
                        </Box>
                    </Typography>
                </div>)
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
    addProduct(){
        this.setState({
            currentTab:"add"
        });
    }
    editProduct(id){
        console.log("anelka id" , id)
        this.setState({
            currentTab:"edit"
        });
    }
    handleID(id){
        this.setState({
            id: id
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
                        <VendorSidebar info={this.infoChange} products={this.productsChange} orders={this.ordersChange} add={this.addProduct} />
                        {this.SelectPage()}
                    </Grid>

                </Grid>
                <Footer/>
            </ThemeProvider>
        );
    }

}