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
            password : "****",
            editName: "false",
            editSurname: "false",
            editPassword: "false",
            fields: [
                {key: 'Name',
                    value: "",
                    editable : 'True'},
                {key: 'Surname',
                    value: "",
                    editable : 'True'},
                {key: 'Username',
                    value: "",
                    editable : 'False'},
                {key: 'Email',
                    value: "",
                    editable : 'False'},
                {key: 'Money spent on Turşu',
                    value: "",
                    editable : 'False'},
                {key: 'Password',
                    value: '****',
                    editable : 'True'}
                ],
        }
        this.routeName = this.routeName.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.surnameChange = this.surnameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
    componentDidMount() {
        console.log('componentDidMount() lifecycle');
        var token = sessionStorage.getItem("authToken");
        console.log(token);
        axios.get('http://3.232.20.250/customerpage', {headers: {Authorization: 'Token ' + token}})
        .then(res => {
            console.log(res)

            this.setState({ name: res.data.first_name});
            this.setState({ surname: res.data.last_name});
            this.setState({ username: res.data.username});
            this.setState({ money: res.data.money_spent});
            this.setState({ email: res.data.email});
            this.setState({ fields: [
            {key: 'Name',
                value: res.data.first_name,
                editable : 'True'},
            {key: 'Surname',
                value: res.data.last_name,
                editable : 'True'},
            {key: 'Username',
                value: res.data.username,
                editable : 'False'},
            {key: 'Email',
                value: res.data.email,
                editable : 'False'},
            {key: 'Money spent on Turşu',
                value: res.data.money_spent,
                editable : 'False'},
            {key: 'Password',
                value: '****',
                editable : 'True'}
            ]});

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
        var token = sessionStorage.getItem("authToken");
        var bodyFormData = new FormData();
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
            if (key==="Name"){
                 this.setState({name: value})
                 var newFields = this.state.fields
                 newFields[0].value = value
                 this.setState({fields: newFields})
                 this.nameChange()
            }
            else if (key=== "Surname"){
                 this.setState({surname: value})
                 var newFields = this.state.fields
                 newFields[1].value = value
                 this.setState({fields: newFields})
                 this.surnameChange()
            }
            else if (key==="Password"){
                 this.setState({password: "****"})
                 var newFields = this.state.fields
                 newFields[5].value = "****"
                 this.setState({fields: newFields})
                 this.passwordChange()
            }
        })
        .catch(error =>{
            if (error.response){
                console.log(error.response.message);
            }
        })
    }

    render() {
        return(
            <Grid item>
                <div>
                    {this.routeName(this.state.fields[0])}
                    {this.routeName(this.state.fields[1])}
                    <InfoBox field={this.state.fields[2]}/>
                    <InfoBox field={this.state.fields[3]}/>
                    <InfoBox field={this.state.fields[4]}/>
                    {this.routeName(this.state.fields[5])}
                </div>
            </Grid>
        )
    }
}
