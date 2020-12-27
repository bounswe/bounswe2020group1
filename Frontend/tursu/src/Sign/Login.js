import React, { Component} from 'react';
import "./sign_components.css";
import logo from '../rsz_11logo.png';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";

const clientId = '872287604811-526a3ojjpf2ugpn2bsq0ov3ho952cg39.apps.googleusercontent.com';


const responseGoogleFailure = response => {
    console.log(response)
    console.log("FAILURE")
    alert("There has been an error with the Google Sign In")
}

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            redirect: "False",
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.goToRegistration = this.goToRegistration.bind(this);
        this.goToForgotP = this.goToForgotP.bind(this);
    }
    handleSubmit(event){
        const formData = new FormData();
        formData.append("email", this.state.email);
        formData.append("password", this.state.password);
        axios.post('http://3.232.20.250/user/login',  formData)
            .then(res => {
                console.log("result:", res);
                console.log("status: ", res.status);
                this.setState({ redirect: "True" });

                window.sessionStorage.setItem("authToken", res.data.auth_token);
                window.sessionStorage.setItem("first_name", res.data.first_name);
                window.sessionStorage.setItem("last_name", res.data.last_name);
                window.sessionStorage.setItem("user_type", res.data.user_type);

                
                console.log("auth_token: ", window.sessionStorage.getItem("authToken"));

            })
            .catch(error =>{
                if (error.response){
                    if (error.response.status === 401){
                        alert ("The email or password you have entered is incorrect. Please try again.");
                    }
                    else{
                        console.log(error.response.message);
                        alert ("There has been an error. Please try again.");
                    }
                }
                else{
                    alert ("There has been an error. Please try again.");
                }

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
    goToForgotP(){
        this.props.onForgotPChange();
    }
    responseGoogleSuccess = response => {
        console.log(response)
        this.setState({ redirect: "True" });
    }
    render() {
        if(this.state.redirect === "False"){
            return(
                <div className="login">
                    <img src={logo} alt="Tursu Logo"></img>
                    <h1>Sign In</h1>
                    <form onSubmit={this.handleSubmit}>
                        <input className="tursu_input" type="text" name="email" id="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} required />
                        <br/>

                        <input className="tursu_input" type="password" name="password" id="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} required />

                        <br/>
                        <button type="submit" className="tursu_button">Sign In</button>
                    </form>
                    <button type="button" onClick={this.goToRegistration} className="smallButton">New to Turşu? Sign up.</button>
                    <button type="button" onClick={this.goToForgotP} className="smallButton">I forgot my password.</button>
                    <div>
                        <GoogleLogin
                            clientId='872287604811-526a3ojjpf2ugpn2bsq0ov3ho952cg39.apps.googleusercontent.com'
                            buttonText='Login'
                            onSuccess={this.responseGoogleSuccess}
                            onFailure={responseGoogleFailure}
                            cookiePolicy={'single_host_origin'}
                            />
                    </div>
                </div>
                )
        }
        else if (this.state.redirect === "True"){
            if(this.state.user_type=="admin"){
                return (<Redirect to={"admin/"} />)
            }
            window.sessionStorage.setItem("isLogged", "true");
            return (<Redirect to={".."} />)
        }
    }
}
