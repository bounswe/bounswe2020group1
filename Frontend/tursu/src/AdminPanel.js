import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import {fade} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Axios from "axios";
import FormControlLabel from "@material-ui/core/FormControlLabel";






function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

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

class AdminPanel extends React.Component{

    componentDidMount() {
        console.log("girdi")
        Axios.get('http://3.232.20.250/admin/verificationpending/products/',{
        })
            .then(res => {
                console.log(res)
                console.log("girdi2")
                this.setState({nonverified_list: res.data})
            })
    }


    constructor(props) {
        super(props);

        this.state = {
            value: null,
            nonverified_list: [0]
        };

    }

    handleChange = (event, newValue) => {
        this.setState({value: newValue})
    };

    render(){

        return(
            <ThemeProvider theme={theme} >
                <div >
                    <AppBar position="center">
                        <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example">
                            <Tab label="Verify Vendor" {...a11yProps(0)} />
                            <Tab label="Verify Product" {...a11yProps(1)} />
                            <Tab label="Ban User" {...a11yProps(2)} />
                            <Tab label="Delete Product" {...a11yProps(3)} />
                            <Tab label="Delete Comment" {...a11yProps(4)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={this.state.value} index={0}>
                        Item One
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
                        {this.state.nonverified_list.map((product) => (
                            <Typography>{product.name}</Typography>

                        ))}
                    </TabPanel>
                    <TabPanel value={this.state.value} index={2}>
                        Item Three
                    </TabPanel>
                    <TabPanel value={this.state.value} index={3}>
                        <br/><br/>
                        <form noValidate autoComplete="off">
                            Enter ID of the product that you wished to delete<br/><br/>
                            <TextField id="outlined-basic" label="Product ID" variant="outlined" />
                        </form>
                    </TabPanel>
                    <TabPanel value={this.state.value} index={4}>
                        Item Three
                    </TabPanel>
                </div>
            </ThemeProvider>

        );
    }
}

export default AdminPanel
