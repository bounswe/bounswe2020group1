import React, { Component} from 'react';
import Grid from "@material-ui/core/Grid";
import InfoBox from "./InfoBox"
import EditInfoBox from "./EditInfoBox"
import axios from 'axios';


export default class myInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name : "",
            username : "",
            email : "",
            latitude: "",
            longitude: "",
            iban: "",
            rating: 0.0,
            editName: "false",
            editIban: "false",
            editPassword: "false",
        }
        this.routeName = this.routeName.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.ibanChange = this.ibanChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
    componentDidMount() {
        console.log('componentDidMount() lifecycle');
        var token = sessionStorage.getItem("authToken");
        axios.get('http://3.232.20.250/vendorpage', {headers: {Authorization: 'Token ' + token}})
        .then(res => {
            console.log(res)

            this.setState({ name: res.data.first_name});
            this.setState({ email: res.data.email});
            this.setState({ username: res.data.username});
            this.setState({ latitude: res.data.latitude});
            this.setState({ longitude: res.data.longitude});
            this.setState({ iban: res.data.iban});
            this.setState({ rating: res.data.rating});

        })
        .catch(error =>{
            if (error.response){
                console.log(error.response.message);
            }
        })
    }
    nameChange(){
        if (this.state.editName==="false"){
            this.setState({editName:"true"})
        }
        else{
            this.setState({editName:"false"})
        }
    }
    ibanChange(){
        if (this.state.editIban==="false"){
            this.setState({editIban:"true"})
        }
        else{
            this.setState({editIban:"false"})
        }
    }
    passwordChange(){
        if (this.state.editPassword==="false"){
            this.setState({editPassword:"true"})
        }
        else{
            this.setState({editPassword:"false"})
        }
    }
    routeName(field){
        switch (field.key) {
            case "Name":
                if (this.state.editName === "false"){
                    return <InfoBox field={field} edit={this.nameChange}/>
                }
                else{
                    return <EditInfoBox field={field} edit={this.nameChange} change={this.handleEdit}/>
                }
            case "IBAN":
                if (this.state.editIban === "false"){
                    return <InfoBox field={field} edit={this.ibanChange}/>
                }
                else{
                    return <EditInfoBox field={field} edit={this.ibanChange} change={this.handleEdit}/>
                }
            case "Password":
                if (this.state.editPassword === "false"){
                    return <InfoBox field={field} edit={this.passwordChange}/>
                }
                else{
                    return <EditInfoBox field={field} edit={this.passwordChange} change={this.handleEdit}/>
                }
        }
    }
    handleEdit(key,value){
        var token = sessionStorage.getItem("authToken");
        var bodyFormData = new FormData();
        //alert(key);
        if (key==="Name"){
                bodyFormData.append('first_name', value);}
        else if (key=== "IBAN"){
                bodyFormData.append('iban', value)}
        else if (key==="Password"){
                bodyFormData.append('password', value);
        }
        axios({
            method: 'post',
            url: 'http://3.232.20.250/user/edit_profile',
            data: bodyFormData,
            headers: {Authorization: 'Token ' + token}
            })
        .then(res => {
            console.log(res)
        })
        .catch(error =>{
            if (error.response){
                console.log(error.response.message);
            }
        })
        window.location.href = window.location.href
    }

    render() {
        var fields = [
        {key: 'Name',
            value: this.state.name,
            editable : 'True'},
        {key: 'Username',
            value: this.state.username,
            editable : 'False'},
        {key: 'Email',
            value: this.state.email,
            editable : 'False'},
        {key: 'IBAN',
            value: this.state.iban,
            editable : 'True'},
        {key: 'Latitude',
            value: this.state.latitude,
            editable : 'False'},
        {key: 'Longitude',
            value: this.state.longitude,
            editable : 'False'},
        {key: 'Rating',
            value: this.state.rating,
            editable : 'False'},
        {key: 'Password',
            value: '****',
            editable : 'True'}
        ];
        return(
            <Grid item>
                <div>
                    {this.routeName(fields[0])}
                    <InfoBox field={fields[1]}/>
                    <InfoBox field={fields[2]}/>
                    {this.routeName(fields[3])}
                    <InfoBox field={fields[4]}/>
                    <InfoBox field={fields[5]}/>
                    <InfoBox field={fields[6]}/>
                    {this.routeName(fields[7])}
                </div>
            </Grid>
        )
    }
}
