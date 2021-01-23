import React, { Component} from 'react';
import Grid from "@material-ui/core/Grid";
import axios from 'axios';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import {Tooltip} from "@material-ui/core";


export default class EditInfoBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: props.field.key,
            value: "",
            type: "text",
            show: props.field.value,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount(){
        if (this.props.field.key==="Password"){
            this.setState({type:"password"})
        }
    }
    handleChange(event){
        this.setState({
            value: event.target.value
        });
    }
    handleSubmit(event){
        this.props.change(this.state.key,this.state.value)
    }
    render() {
        // editable text field
        return(
        <div style={{flexGrow: 1,}}>
        <Paper style={{marginLeft: 100,marginBottom: 30,width: 350,height: 60,}} elevation={5}>
            <Grid container item style={{paddingLeft: 5,
                                                   width: "100%",
                                                   height: "100%",
                                                   justifyContent: "space-between",}} alignItems="center" spacing={4}>
                <Grid item >
                    <nobr><input type={this.state.type} name={this.state.key} id={this.state.key} placeholder={this.state.show} value={this.state.value} onChange={this.handleChange} required /></nobr>
                </Grid>
                <Grid>
                <Tooltip title="Edit">
                    <IconButton size="small" onClick={this.handleSubmit}><CheckCircleIcon/></IconButton>
                </Tooltip>
                </Grid>
                <Grid >
                <Tooltip title="Cancel">
                    <IconButton size="small" onClick={this.props.edit}><CancelIcon/></IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </Paper>
        </div>
        )
    }
}
