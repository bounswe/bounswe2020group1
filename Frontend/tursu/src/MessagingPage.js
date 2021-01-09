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
import FormDialog from "./NewChatPopUp"
import NonverifiedProductBox from "./NonverifiedProductBox";
import InputBase from "@material-ui/core/InputBase";
import Navbar from "./NavBar";
import "./NavBar.css";

class MessagingPage extends React.Component{

    state = {
        flows : [],
        selected_flow_id: null,
        message : null,
    }

    componentDidMount() {
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
    handleChangeFlow = (flow_id) => {
        this.setState({selected_flow_id: flow_id})
        console.log(flow_id)

    };

    handleSendMessage = (flow_id) => {
        console.log(flow_id)
        console.log(this.state.message)
    };

    handleChangeStr = (event) => {
        this.setState({message: event.target.value})

    };

    createFlow = () => {
          console.log("New flow created.")
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
                    <Grid item xs={14} >
                        <FormDialog onSubmit={this.createFlow}/>
                    </Grid>
                </Grid>
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
                                <ListItemText primary="John Wick"></ListItemText>
                            </ListItem>
                        </List>
                        <Divider />
                        <Grid item xs={12} style={{padding: '10px'}}>
                            <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                        </Grid>
                        <Divider />
                        <List>
                            {this.state.flows.map((flow) => (
                                <ListItem button onClick={() => this.handleChangeFlow(flow.id)}>
                                    <ListItemIcon>
                                        <Avatar alt={flow.vendor_name}  src="https://material-ui.com/static/images/avatar/2.jpg" />
                                    </ListItemIcon>
                                    <ListItemText primary={flow.vendor_name}>{flow.vendor_name}r</ListItemText>
                                </ListItem>
                            ))}

                        </List>
                    </Grid>
                    <Grid item xs={9}>
                        <List>
                            <ListItem key="1">
                                <Grid container>
                                    <Grid item xs={12}>
                                        <ListItemText align="right" primary={this.state.selected_flow_id}></ListItemText>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ListItemText align="right" secondary="09:30"></ListItemText>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </List>
                        <Divider />
                        <Grid container style={{padding: '20px'}}>
                            <Grid item xs={11}>
                                <InputBase placeholder="Type Something" onChange={this.handleChangeStr}/>
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
