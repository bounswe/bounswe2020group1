import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import Axios from "axios";

import NonverifiedProductBox from "./NonverifiedProductBox";
import InputBase from "@material-ui/core/InputBase";
import Navbar from "./NavBar";
import "./NavBar.css";

class MessagingPage extends React.Component{

    state = {
        flows : [],
        customer_flows : [],
        admin_flows : [],
        selected_flow_id: null,
        message : null,
        message_info_list : [],
        sent: false,
        to_admin : null,
        toadmin_message_info_list: [],
    }

    componentDidMount() {
        // her user type için ayrı request atılacak
        console.log(window.sessionStorage.getItem("user_type"))
        if(window.sessionStorage.getItem("user_type")==="customer"){
            Axios.get('http://3.232.20.250/message/flow/customer/',{
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            })
                .then(res => {
                    console.log(res)
                    this.setState({flows: res.data})
                })
        }
        if(window.sessionStorage.getItem("user_type")==="vendor"){
            Axios.get('http://3.232.20.250/message/flow/vendor/',{
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            })
                .then(res => {
                    console.log(res.data.customer_flows)
                    console.log(res.data.admin_flows)

                    this.setState({customer_flows: res.data.customer_flows})
                    this.setState({admin_flows: res.data.admin_flows})

                })
        }
        if(window.sessionStorage.getItem("user_type")==="admin"){
            //Get admin flows
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(window.sessionStorage.getItem("user_type")==="customer"){
            if((this.state.selected_flow_id!==prevState.selected_flow_id) || (this.state.sent!==prevState.sent)){
                Axios.get('http://3.232.20.250/message/chat/ofcustomer/',{
                    headers: {
                        'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                    },
                    params: {
                        flow_id : this.state.selected_flow_id,
                    }
                })
                    .then(res => {
                        console.log(res)
                        this.setState({message_info_list: res.data})
                    })
            }
        }
        if(window.sessionStorage.getItem("user_type")==="vendor" && (this.state.to_admin)){
            if((this.state.selected_flow_id!==prevState.selected_flow_id) || (this.state.sent!==prevState.sent) || (this.state.to_admin!==prevState.to_admin)){
                console.log("to admin")

                Axios.get('http://3.232.20.250/message/chat/ofvendor/wadmin/',{
                    headers: {
                        'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                    },
                    params: {
                        flow_id : this.state.selected_flow_id,
                    }
                })
                    .then(res => {
                        console.log(res)
                        this.setState({toadmin_message_info_list: res.data})
                        console.log(res.data)
                    })




        }}
        if(window.sessionStorage.getItem("user_type")==="vendor" && (!this.state.to_admin)){
            console.log("to customer")
            if((this.state.selected_flow_id!==prevState.selected_flow_id) || (this.state.sent!==prevState.sent) || (this.state.to_admin!==prevState.to_admin)){
                Axios.get('http://3.232.20.250/message/chat/ofvendor/wcustomer/',{
                    headers: {
                        'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                    },
                    params: {
                        flow_id : this.state.selected_flow_id,
                    }
                })
                    .then(res => {
                        console.log(res)
                        this.setState({message_info_list: res.data})
                    })
            }
        }
    }

    handleChangeFlow = (flow_id) => {
        this.setState({selected_flow_id: flow_id})
        this.setState({to_admin: false})
    };

    handleChangeAdminFlow = (flow_id) => {
        this.setState({selected_flow_id: flow_id})
        this.setState({to_admin: true})
    };

    handleSendMessage = (flow_id) => {
        // her user type için ayrı request atılacak

        console.log(flow_id)
        console.log(this.state.message)
        if(window.sessionStorage.getItem("user_type")==="customer"){
            const formData = new FormData();
            formData.append("message", this.state.message);
            formData.append("flow_id", flow_id);
            Axios.post('http://3.232.20.250/message/send/customer/tovendor/',formData,{
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            })
                .then(res => {
                    console.log(res)
                    this.setState({sent: !this.state.sent})
                })
                .catch(error =>{
                    console.log(error.response)
                })
        }
        if(window.sessionStorage.getItem("user_type")==="vendor"){
            if(!this.state.to_admin){
                const formData = new FormData();
                formData.append("message", this.state.message);
                formData.append("flow_id", flow_id);
                Axios.post('http://3.232.20.250/message/send/vendor/tocustomer/',formData,{
                    headers: {
                        'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                    }
                })
                    .then(res => {
                        console.log(res)
                        this.setState({sent: !this.state.sent})
                    })
                    .catch(error =>{
                        console.log(error.response)
                    })
            }
            else{
                const formData = new FormData();
                formData.append("message", this.state.message);
                formData.append("flow_id", flow_id);
                Axios.post('http://3.232.20.250/message/send/vendor/toadmin/',formData,{
                    headers: {
                        'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                    }
                })
                    .then(res => {
                        console.log(res)
                        this.setState({sent: !this.state.sent})
                    })
                    .catch(error =>{
                        console.log(error.response)
                    })
            }

        }
        this.setState({message: ""})

    };

    handleChangeStr = (event) => {
        this.setState({message: event.target.value})

    };


    render(){
        return (
            <div>
                <Grid container>
                    <Grid item xs={12}>
                        <Paper>
                            <Navbar />
                        </Paper>
                    </Grid>
                </Grid>
                <div className="stepper">
                    <Grid container>
                        <Grid item xs={12} >
                            <Typography variant="h5" className="header-message">Chat</Typography>
                        </Grid>
                    </Grid>
                    <Grid container component={Paper} >
                        <Grid item xs={3} >
                            <List>
                                <ListItem button key="RemySharp">
                                    <ListItemIcon>
                                        <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                                    </ListItemIcon>
                                    <ListItemText primary={window.sessionStorage.getItem("first_name")}></ListItemText>
                                </ListItem>
                            </List>

                            <Divider />
                            <List>
                                {window.sessionStorage.getItem("user_type")==="customer" && this.state.flows.map((flow) => (
                                    <ListItem button onClick={() => this.handleChangeFlow(flow.id)}>
                                        <ListItemIcon>
                                            <Avatar alt={flow.vendor_name}  src="https://material-ui.com/static/images/avatar/2.jpg" />
                                        </ListItemIcon>
                                        <ListItemText primary={flow.vendor_name}>{flow.vendor_name}</ListItemText>
                                    </ListItem>
                                ))}

                                {window.sessionStorage.getItem("user_type")==="vendor" && this.state.customer_flows.map((flow) => (
                                    <ListItem button onClick={() => this.handleChangeFlow(flow.id)}>
                                        <ListItemIcon>
                                            <Avatar alt={flow.username }  src="https://material-ui.com/static/images/avatar/2.jpg" />
                                        </ListItemIcon>
                                        <ListItemText primary={flow.username }>{flow.username }</ListItemText>
                                    </ListItem>

                                ))}
                                <Divider />
                                {window.sessionStorage.getItem("user_type")==="vendor" && this.state.admin_flows.map((flow) => (
                                    <ListItem button onClick={() => this.handleChangeAdminFlow(flow.id)}>
                                        <ListItemIcon>
                                            <Avatar alt={flow.id }  src="https://material-ui.com/static/images/avatar/2.jpg" />
                                        </ListItemIcon>
                                        <ListItemText primary={"Admin"}></ListItemText>
                                    </ListItem>

                                ))}


                            </List>
                        </Grid>
                        <Grid item xs={9}>
                            <List>
                                <ListItem key="1">
                                    <Grid container>

                                        {(!this.state.to_admin) && this.state.message_info_list.map((message_info) => (
                                            (message_info.sender === "self" &&
                                                <Grid item xs={12}>
                                                    <ListItemText align="right" primary={message_info.message }></ListItemText>
                                                </Grid>) ||
                                            (message_info.sender === "other" &&
                                                <Grid item xs={12}>
                                                    <ListItemText align="left" primary={message_info.message }></ListItemText>
                                                </Grid>)
                                        ))}

                                        {(this.state.to_admin) && this.state.toadmin_message_info_list.map((message_info) => (
                                            (message_info.sender === "self" &&
                                                <Grid item xs={12}>
                                                    <ListItemText align="right" primary={message_info.message }></ListItemText>
                                                </Grid>) ||
                                            (message_info.sender === "other" &&
                                                <Grid item xs={12}>
                                                    <ListItemText align="left" primary={message_info.message }></ListItemText>
                                                </Grid>)
                                        ))}
                                    </Grid>
                                </ListItem>
                            </List>
                            <Divider />
                            <Grid container align="left" style={{padding: '20px'}}>
                                <Grid item xs={11} >
                                    <InputBase style={{width: 400}} placeholder="Type Something" multiline={true} onChange={this.handleChangeStr} value={this.state.message}/>
                                </Grid>
                                <Grid xs={1} align="right">
                                    <Fab color="primary" aria-label="add" onClick={() => this.handleSendMessage(this.state.selected_flow_id)} ><SendIcon /></Fab>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }

}

export default MessagingPage;
