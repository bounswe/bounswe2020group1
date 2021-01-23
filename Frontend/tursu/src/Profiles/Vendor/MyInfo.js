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
            password: "****",
            editName: "false",
            editIban: "false",
            editPassword: "false",
            fields : [
                    {key: 'Name',
                        value: "",
                        editable : 'True'},
                    {key: 'Username',
                        value: "",
                        editable : 'False'},
                    {key: 'Email',
                        value: "",
                        editable : 'False'},
                    {key: 'IBAN',
                        value: "",
                        editable : 'True'},
                    {key: 'Latitude',
                        value: "",
                        editable : 'False'},
                    {key: 'Longitude',
                        value: "",
                        editable : 'False'},
                    {key: 'Rating',
                        value: 0.0,
                        editable : 'False'},
                    {key: 'Password',
                        value: '****',
                        editable : 'True'}
            ],
        }
        this.checkPassword = this.checkPassword.bind(this);
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
            this.setState({fields : [
                    {key: 'Name',
                        value: res.data.first_name,
                        editable : 'True'},
                    {key: 'Username',
                        value: res.data.username,
                        editable : 'False'},
                    {key: 'Email',
                        value: res.data.email,
                        editable : 'False'},
                    {key: 'IBAN',
                        value: res.data.iban,
                        editable : 'True'},
                    {key: 'Latitude',
                        value: res.data.latitude,
                        editable : 'False'},
                    {key: 'Longitude',
                        value: res.data.longitude,
                        editable : 'False'},
                    {key: 'Rating',
                        value: res.data.rating,
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
    checkPassword(password){
        if(password.length < 8){
            return "Your password is too short, it should at least be 8 characters long!"
        }
        if(!(password.match(/[a-z]+/) && password.match(/[A-Z]+/) && password.match(/[0-9]+/))){
            return "This password is too weak. Your password should include one uppercase letter, one lowercase letter and one digit."
        }
        else{
            return "ok"
        }
        //thanks to: https://stackoverflow.com/questions/50547523/how-can-i-use-javascript-to-test-for-password-strength-in-a-way-that-returns-the
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
        var isAlright = true
        var token = sessionStorage.getItem("authToken");
        var bodyFormData = new FormData();
        //alert(key);
        if (key==="Name"){
                bodyFormData.append('first_name', value);}
        else if (key=== "IBAN"){
                bodyFormData.append('iban', value)}
        else if (key==="Password"){
                bodyFormData.append('password', value);
                var m = this.checkPassword(value)
                if (m != "ok"){
                    isAlright = false
                    this.passwordChange()
                    alert(m)
                }
        }
        if (isAlright){
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
                else if (key=== "IBAN"){
                     this.setState({iban: "value"})
                     var newFields = this.state.fields
                     newFields[3].value = value
                     this.setState({fields: newFields})
                     this.ibanChange()
                }
                else if (key==="Password"){
                     this.setState({password: "****"})
                     var newFields = this.state.fields
                     newFields[7].value = "****"
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
    }

    render() {
        return(
            <Grid item>
                <div>
                    {this.routeName(this.state.fields[0])}
                    <InfoBox field={this.state.fields[1]}/>
                    <InfoBox field={this.state.fields[2]}/>
                    {this.routeName(this.state.fields[3])}
                    <InfoBox field={this.state.fields[4]}/>
                    <InfoBox field={this.state.fields[5]}/>
                    <InfoBox field={this.state.fields[6]}/>
                    {this.routeName(this.state.fields[7])}
                </div>
            </Grid>
        )
    }
}
