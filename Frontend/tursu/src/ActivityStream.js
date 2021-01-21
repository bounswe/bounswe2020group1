import React from 'react';
import './HomePage.css'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Stepper from './Stepper'
import Navbar from "./NavBar";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ProductBox from "./ProductBox";
import Axios from "axios";
import {Typography} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Footer from "./Footer";
import axios from "axios";

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';



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


class ActivityStream extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            vendor: "",
            vendorList: [],
            stream: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
      axios({
            method: 'get',
            url: 'http://3.232.20.250/helper/allvendors/',
            })
        .then(res => {
            console.log(res)
            this.setState({vendorList: res.data})
        })
        .catch(error =>{
            if (error.response){
                console.log(error.response.message);
            }
      })
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
        console.log(event.target.value)

        axios({
            method: 'get',
            url: 'http://3.232.20.250/as/vendor?vendor_name=' + event.target.value,
        })
        .then(res => {
            console.log(res.data)
            console.log( JSON.stringify(res.data, null, 2))
            this.setState({stream: JSON.stringify(res.data, null, 2)})
            document.getElementById("act_stream").innerHTML = '<pre style="color:green; font-size: 15px; font-weight: bold;">' + JSON.stringify(res.data, undefined, 1) +'</pre>'
            //reference: https://www.geeksforgeeks.org/how-to-pretty-print-json-string-in-javascript/
        })
        .catch(error =>{
            if (error.response){
                console.log(error.response.message);
            }
        })
        console.log(this.state.stream)
    }

    render(){


        return(
            <ThemeProvider theme={theme} >
                <Grid container direction="column" className="HomePage" spacing={4}>
                    <Grid item xs={12}>
                        <Paper>
                            <Navbar />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className="stepper">
                            <Typography>Select the vendor whose activity stream you would like to view.</Typography>
                        </Paper>
                    </Grid>

                    <FormControl>
                    <InputLabel htmlFor="age-native-simple">Vendor</InputLabel>
                    <Select
                      native
                      value={this.state.vendor}
                      onChange={this.handleChange}
                      inputProps={{
                        name: 'vendor',
                        id: 'vendor',
                      }}
                    >
                      <option aria-label="None" value="" />
                      {this.state.vendorList.map((list_item) => (
                        (<option value={list_item}>{list_item}</option>)
                      ))}
                    </Select>
                  </FormControl>
                  <br/>

                </Grid>
                <div id="act_stream">
                </div>
                <Footer/>
            </ThemeProvider>
        );
    }
}

export default ActivityStream;

