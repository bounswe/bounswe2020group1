import React, {Component} from 'react';
import Navbar from "../NavBar";
import "./profile.css";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Sidebar from "./Sidebar";
import MyInfo from "./MyInfo";


export default class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab : "info"
        }
    }

    SelectPage(){
        switch (this.state.currentTab) {
            case "info":
                return <MyInfo/>
        }
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
                    <Sidebar/>
                    {/*<List>*/}
                    {/*    <Link to={this.props.location.pathname} className="sidebar-link">*/}
                    {/*        <ListItem button>*/}
                    {/*            <ListItemIcon>*/}
                    {/*                <InfoIcon/>*/}
                    {/*            </ListItemIcon>*/}
                    {/*            <ListItemText primary={"My Information"}/>*/}
                    {/*        </ListItem>*/}
                    {/*    </Link>*/}
                    {/*    <Link to={this.props.location.pathname + "/products"} className="sidebar-link">*/}
                    {/*        <ListItem button>*/}
                    {/*            <ListItemIcon>*/}
                    {/*                <StorefrontIcon/>*/}
                    {/*            </ListItemIcon>*/}
                    {/*            <ListItemText primary={"My Products"}/>*/}
                    {/*        </ListItem>*/}
                    {/*    </Link>*/}
                    {/*    <Link to={this.props.location.pathname + "/orders"} className="sidebar-link">*/}
                    {/*        <ListItem button>*/}
                    {/*            <ListItemIcon>*/}
                    {/*                <ShoppingCartIcon/>*/}
                    {/*            </ListItemIcon>*/}
                    {/*            <ListItemText primary={"My Orders"}/>*/}
                    {/*        </ListItem>*/}
                    {/*    </Link>*/}
                    {/*</List>*/}

                    {/*<div className="sidebar">*/}
                    {/*    <Router>*/}
                    {/*        <div style={{display: 'flex'}}>*/}
                    {/*            <Drawer*/}
                    {/*                variant="persistent"*/}
                    {/*                anchor="left"*/}
                    {/*                open={true}*/}
                    {/*            >*/}
                    {/*                <List>*/}
                    {/*                    <Link to={this.props.location.pathname} className="sidebar-link">*/}
                    {/*                        <ListItem button>*/}
                    {/*                            <ListItemIcon>*/}
                    {/*                                <InfoIcon/>*/}
                    {/*                            </ListItemIcon>*/}
                    {/*                            <ListItemText primary={"My Information"}/>*/}
                    {/*                        </ListItem>*/}
                    {/*                    </Link>*/}
                    {/*                    <Link to={this.props.location.pathname + "/products"} className="sidebar-link">*/}
                    {/*                        <ListItem button>*/}
                    {/*                            <ListItemIcon>*/}
                    {/*                                <StorefrontIcon/>*/}
                    {/*                            </ListItemIcon>*/}
                    {/*                            <ListItemText primary={"My Products"}/>*/}
                    {/*                        </ListItem>*/}
                    {/*                    </Link>*/}
                    {/*                    <Link to={this.props.location.pathname + "/orders"} className="sidebar-link">*/}
                    {/*                        <ListItem button>*/}
                    {/*                            <ListItemIcon>*/}
                    {/*                                <ShoppingCartIcon/>*/}
                    {/*                            </ListItemIcon>*/}
                    {/*                            <ListItemText primary={"My Orders"}/>*/}
                    {/*                        </ListItem>*/}
                    {/*                    </Link>*/}
                    {/*                </List>*/}
                    {/*            </Drawer>*/}
                    {/*            <Switch>*/}
                    {/*                <Route path={this.props.location.pathname} exact component={myInfo} />*/}

                    {/*                <Route path={this.props.location.pathname + "/products"} exact component={myProducts} />*/}

                    {/*                <Route path={this.props.location.pathname + "/orders"} exact component={myOrders} />*/}
                    {/*            </Switch>*/}
                    {/*        </div>*/}
                    {/*    </Router>*/}
                    {/*</div>*/}
                </Grid>
            </ThemeProvider>
        );
    }

}
