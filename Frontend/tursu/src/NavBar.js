// import and use AppBar.js here, can be changed tho
import React from "react";
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar";
import {Button, ButtonGroup, IconButton} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import InputBase from "@material-ui/core/InputBase";


const styles = {
    customizeToolbar:{
        minHeight: '100px'
    }
}

class Navbar extends React.Component{
    render(){
        return(
            <div className="Navbar">
                <AppBar style={styles.customizeToolbar}>
                    <Toolbar>
                        <Icon>
                            <img src="https://raw.githubusercontent.com/bounswe/bounswe2020group1/master/images/logo.PNG"
                                 alt="logo"
                                 className="image"/>
                        </Icon>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button variant="contained">
                                    Electronics
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained">
                                    Fashion
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained">
                                    Home
                                </Button>
                            </Grid>
                        </Grid>
                        <InputBase placeholder="Search"/>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default Navbar;