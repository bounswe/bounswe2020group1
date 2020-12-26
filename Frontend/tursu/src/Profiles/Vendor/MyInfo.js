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
            surname : "",
            username : "",
            money : "",
            email : "",
            editName: "false",
            editSurname: "false",
            editPassword: "false",
        }
        this.routeName = this.routeName.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.surnameChange = this.surnameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
    componentDidMount() {
        console.log('componentDidMount() lifecycle');
        var token = sessionStorage.getItem("auth_token");
        axios.get('http://3.232.20.250/customerpage', {headers: {Authorization: 'Token ' + token}})
        .then(res => {
            console.log(res)

            this.setState({ name: res.data.first_name});
            this.setState({ surname: res.data.last_name});
            this.setState({ username: res.data.username});
            this.setState({ money: res.data.money_spent});
            this.setState({ email: res.data.email});

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
    surnameChange(){
        if (this.state.editSurname==="false"){
            this.setState({editSurname:"true"})
        }
        else{
            this.setState({editSurname:"false"})
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
            case "Surname":
                if (this.state.editSurname === "false"){
                    return <InfoBox field={field} edit={this.surnameChange}/>
                }
                else{
                    return <EditInfoBox field={field} edit={this.surnameChange} change={this.handleEdit}/>
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
        var token = sessionStorage.getItem("auth_token");
        var bodyFormData = new FormData();
        //alert(key);
        if (key==="Name"){
                bodyFormData.append('first_name', value);}
        else if (key=== "Surname"){
                bodyFormData.append('last_name', value)}
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
        {key: 'Surname',
            value: this.state.surname,
            editable : 'True'},
        {key: 'Username',
            value: this.state.username,
            editable : 'False'},
        {key: 'Email',
            value: this.state.email,
            editable : 'False'},
        {key: 'Money spent on Turşu',
            value: this.state.money,
            editable : 'False'},
        {key: 'Password',
            value: '****',
            editable : 'True'}
        ];
        return(
            <Grid item>
                <div>
                    {this.routeName(fields[0])}
                    {this.routeName(fields[1])}
                    <InfoBox field={fields[2]}/>
                    <InfoBox field={fields[3]}/>
                    <InfoBox field={fields[4]}/>
                    {this.routeName(fields[5])}
                </div>
            </Grid>
        )
    }
}
