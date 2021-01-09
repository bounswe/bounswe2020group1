import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import {IconButton} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Axios from "axios";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ProductListNonverified from "./NonverifiedProductList"
import Grid from "@material-ui/core/Grid";






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
        console.log( window.sessionStorage.getItem("authToken"))
        Axios.get('http://3.232.20.250/admin/verificationpending/products/',{
            headers: {
                'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
            }
        })
            .then(res => {
                console.log(res)
                console.log("girdi2")
                this.setState({nonverified_list: res.data})
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.state.update)
        console.log(prevState.update)

        if(this.state.update!==prevState.update){
            Axios.get('http://3.232.20.250/admin/verificationpending/products/',{
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            })
                .then(res => {
                    console.log(res)
                    this.setState({nonverified_list: res.data})
                })
        }

    }


    constructor(props) {
        super(props);
        console.log( window.sessionStorage.getItem("authToken"))


        this.state = {
            value: null,
            comment_id: null,
            username:null,
            nonverified_list: [],
            update : null
        };

    }

    handleChange = (event, newValue) => {
        this.setState({value: newValue})
    };


    handleDeleteComment = () => {
        console.log(this.state.comment_id)

        const formData = new FormData();
        formData.append("comment_id", this.state.comment_id);
        Axios.post('http://3.232.20.250/admin/deletecomment/',formData,{
            headers: {
                'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
            }
        })
            .then(res => {
                console.log(res)
                console.log("comment deleted?")
            })
            .catch(error =>{
                console.log(error.response)
            })
    };

    handleValueDeleteComment = (event) => {
        this.setState({comment_id: event.target.value})
        console.log(this.state.comment_id)
    };

    handleBanUser = () => {
        const formData = new FormData();
        formData.append("username", this.state.username);
        Axios.post('http://3.232.20.250/admin/banuser/',formData,{
            headers: {
                'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
            }
        })
            .then(res => {
                console.log(res)
                console.log("user banned")
            })
            .catch(error =>{
                console.log(error.response)
            })
    };

    handleValueBanUser = (event) => {
        this.setState({username: event.target.value})
    };

    handleUpdateList = (childData) => {
        this.setState({update:childData})
    };
    render(){
        console.log(this.state.update)

        return(

            <ThemeProvider theme={theme} >
                <div >
                    <AppBar position="center">
                        <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example">
                            <Tab label="Verify Vendor" {...a11yProps(0)} />
                            <Tab label="Verify Product" {...a11yProps(1)} />
                            <Tab label="Ban User" {...a11yProps(2)} />
                            <Tab label="Delete Comment" {...a11yProps(3)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={this.state.value} index={0}>
                        Item One
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
                        <ProductListNonverified products={this.state.nonverified_list} callbackUpdate={this.handleUpdateList}/>
                    </TabPanel>
                    <TabPanel value={this.state.value} index={2}>
                        <br/><br/>
                        <form noValidate autoComplete="off">
                            Enter username of the user that you wished to comment<br/><br/>
                            <TextField id="outlined-basic" label="Username" variant="outlined" value={this.state.username}  onChange={this.handleValueBanUser}/>
                            <IconButton onClick={this.handleBanUser}>
                                <DeleteOutlinedIcon/>
                            </IconButton>
                        </form>
                    </TabPanel>
                    <TabPanel value={this.state.value} index={3}>
                        <br/><br/>
                        <form noValidate autoComplete="off">
                            Enter ID of the comment that you wished to delete<br/><br/>
                            <TextField id="outlined-basic" label="Comment ID" variant="outlined" value={this.state.comment_id}  onChange={this.handleValueDeleteComment}/>
                            <IconButton onClick={this.handleDeleteComment}>
                                <DeleteOutlinedIcon/>
                            </IconButton>
                        </form>
                    </TabPanel>
                </div>
            </ThemeProvider>

    );
    }
    }

    export default AdminPanel
