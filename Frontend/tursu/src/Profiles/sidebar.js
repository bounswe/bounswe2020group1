import React, {Component} from 'react';
import myInfo from "./my_info";
import myProducts from "./my_products";
import myOrders from "./my_orders";
import Stepper from '../Stepper';
import Navbar from "../NavBar";
import "./profile.css";
import {makeStyles} from '@material-ui/core/styles';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StorefrontIcon from '@material-ui/icons/Storefront';
import InfoIcon from '@material-ui/icons/Info';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {Drawer, List, ListItem,
    ListItemIcon, ListItemText,
    Container, Typography,} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";


export default class Sidebar extends Component {
    constructor(props) {
        super(props);
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
                <h1 className="stepper">My Profile</h1>
            </div>
            <div className="sidebar">
            <Router>
                <div style={{display: 'flex'}}>
                    <Drawer
                        variant="persistent"
                        anchor="left"
                        open={true}
                    >
                        <List>
                            <Link to={this.props.location.pathname} className="sidebar-link">
                                <ListItem button>
                                    <ListItemIcon>
                                        <InfoIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={"My Information"}/>
                                </ListItem>
                            </Link>
                            <Link to={this.props.location.pathname + "/products"} className="sidebar-link">
                                <ListItem button>
                                    <ListItemIcon>
                                        <StorefrontIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={"My Products"}/>
                                </ListItem>
                            </Link>
                            <Link to={this.props.location.pathname + "/orders"} className="sidebar-link">
                                <ListItem button>
                                    <ListItemIcon>
                                        <ShoppingCartIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={"My Orders"}/>
                                </ListItem>
                            </Link>
                        </List>
                    </Drawer>
                    <Switch>
                        <Route path={this.props.location.pathname} exact component={myInfo} />

                        <Route path={this.props.location.pathname + "/products"} exact component={myProducts} />

                        <Route path={this.props.location.pathname + "/orders"} exact component={myOrders} />
                    </Switch>
                </div>
            </Router>
            </div>
                </Grid>
            </ThemeProvider>
        );
    }

}
