import React, { Component} from 'react';
import "./sign_components.css";
import logo from '../rsz_11logo.png';
import axios from 'axios';
import { Redirect } from "react-router-dom";


export default class Verification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            code: "",
            redirect: "False",
            user_type: null,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.resendCode = this.resendCode.bind(this);
        this.goToRegistration = this.goToRegistration.bind(this);
    }
    handleSubmit(event){
        const formData = new FormData();
        formData.append("email", this.props.username);
        formData.append("password", this.props.password);
        formData.append("verification_code", this.state.code);
        axios.post('http://3.232.20.250/user/login',  formData)
            .then(res => {

                console.log("result:", res);
                console.log("status: ", res.status);
                console.log("type: ", res.data.user_type);
                this.setState({ user_type: res.data.user_type });


                window.sessionStorage.setItem("authToken", res.data.auth_token);
                window.sessionStorage.setItem("first_name", res.data.first_name);
                window.sessionStorage.setItem("last_name", res.data.last_name);
                window.sessionStorage.setItem("user_type", res.data.user_type);


                this.setState({ redirect: "True" });

            })
            .catch(error =>{
                    alert ("There has been an error. Please try again.");
            })
        event.preventDefault();
    }
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    goToRegistration(){
        this.props.onRegistrationChange();
    }
    resendCode(){
        console.log(this.props.username)
        const formData = new FormData();
        formData.append("email", this.props.username);
        axios.post('http://3.232.20.250/user/resend_verification_code',  formData)
            .then(res => {
                console.log(res)
            })
            .catch(error =>{
               alert ("There has been an error. Please try again.");
            })
    }
    render() {
        if(this.state.redirect === "False"){
            return(
                <div className="login">
                    <img src={logo} alt="Tursu Logo"></img>
                    <h4 className="messages">{this.props.message}</h4>
                    <form onSubmit={this.handleSubmit}>
                        <input className="tursu_input" type="text" name="code" id="code" placeholder="Verification Code" value={this.state.code} onChange={this.handleChange} required />
                        <br/>
                        <button type="submit" className="tursu_button">Verify</button>
                    </form>
                    <button type="button" onClick={this.resendCode} className="smallButton">Cannot find the verification code? Resend.</button>
                    <button type="button" onClick={this.goToRegistration} className="smallButton">Sign up for a new account</button>

                </div>
                )
        }

        else if (this.state.redirect === "True"){
            window.sessionStorage.setItem("isLogged", "true");
            return (<Redirect to={".."} />)
        }

    }
}