import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Avatar from "@material-ui/core/Avatar";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Navbar from "./NavBar";

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




export default function ComplexGrid() {
    return (
        <ThemeProvider theme={theme} >

            <Grid container spacing={15} direction="column" className="DetailPage">
                <Grid item xs={12}>
                    <Paper>
                        <Navbar />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <ProductDetail />
                    </Paper>
                </Grid>

            </Grid>


        </ThemeProvider>
    );
}

class ProductDetail extends React.Component{



    render(){
        return(
            <div >
                <Grid container  item xs={24} spacing={3}>


                            <Grid item xs={8   }>
                                <ButtonBase >
                                    <img  alt="complex" src="https://www.upsieutoc.com/images/2020/06/27/img1.jpg" />
                                </ButtonBase>
                                </Grid>
                    <Grid item xs={8}>
                        <Typography>
                            HERE is the description description  description  description  description  description  description  description  description  description  description  description  description  description  description
                        </Typography>

                        <Typography >
                            Product Name
                        </Typography>
                        <Typography >
                            Vendor
                        </Typography>
                    </Grid>

                            <Grid item xs={4} >
                                <Grid item xs container direction="column" spacing={2}>
                                    <Grid item>
                                        <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                            <Button variant="contained" color="primary">
                                                Add To Cart
                                            </Button>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1">$23.00</Typography>
                                </Grid>
                            </Grid>

                    <Grid item xs={6}>
                        <Paper>
                            <Avatar alt="Remy Sharp" src="https://www.upsieutoc.com/images/2020/06/27/img1.jpg" />
                            <Typography variant="body2" color="textPrimary" align="left">
                                I bought this sneakers and I am satisfied with it.
                            </Typography>

                        </Paper>
                    </Grid>

                    <Grid item xs={6}>
                        <Paper >

                            <Typography variant="body2" color="textPrimary" align="left">
                                <Avatar alt="Al" >Al
                                </Avatar>
                                Some more comments
                            </Typography>

                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}


