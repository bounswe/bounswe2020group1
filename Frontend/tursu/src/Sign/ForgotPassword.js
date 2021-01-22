import React, { Component} from 'react';
import "./sign_components.css";
import logo from '../rsz_11logo.png';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import axios from 'axios';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: ""
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.goToLogin = this.goToLogin.bind(this);
    }
    handleSubmit(event){
        const formData = new FormData();
        formData.append("email", this.state.email);
        axios.post('http://3.232.20.250/user/forgot_password',  formData)
        .then(res => {
            console.log(res);
        })
        .catch(error =>{
            if (error.response){
                console.log(error.response)
            }
        })
        this.props.onLoginChange();
        event.preventDefault();
    }
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    goToLogin(){
        this.props.onLoginChange();
    }
    render() {
        return(
            <div className="login">
                <img src={logo} alt="Tursu Logo"></img>
                <h1>Reset Password</h1>
                <form onSubmit={this.handleSubmit}>

                    <input className="tursu_input" type="email" name="email" id="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} required />
                    <br/>
                    <br/>
                    <button type="submit" className="tursu_button">Reset Password</button>
                </form>
                    <button type="button" onClick={this.goToLogin} className="smallButton">Remembered the password? Sign in.</button>
            </div>
        )
    }
}
