import React, {Component} from 'react';
import Navbar from "../NavBar";
import "./profile.css";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CustomerSidebar from "./CustomerSidebar";
import MyInfo from "./MyInfo";
import MyLists from "./MyLists";
import MyOrders from "./MyOrders";


export default class CustomerProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab : "info"
        }
        this.infoChange = this.infoChange.bind(this);
        this.listsChange = this.listsChange.bind(this);
        this.ordersChange = this.ordersChange.bind(this);
        this.SelectPage = this.SelectPage.bind(this);
        this.SelectTitle = this.SelectTitle.bind(this);
    }

    SelectPage(){
        switch (this.state.currentTab) {
            case "info":
                return <MyInfo />
            case "lists":
                return <MyLists />
            case "orders":
                 return <MyOrders />
        }
    }
    SelectTitle(){
        switch (this.state.currentTab) {
            case "info":
                return <h1 className="stepper">My Information</h1>
            case "lists":
                return <h1 className="stepper">My Lists</h1>
            case "orders":
                 return <h1 className="stepper">My Orders</h1>
        }
    }
    infoChange(){
            this.setState({
                currentTab:"info"
            });
    }
    listsChange(){
            this.setState({
                currentTab:"lists"
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
                        <CustomerSidebar info={this.infoChange} lists={this.listsChange} orders={this.ordersChange}/>
                        {this.SelectPage()}
                    </Grid>

                </Grid>
            </ThemeProvider>
        );
    }

}
