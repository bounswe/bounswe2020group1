import React, { Component} from 'react';
import "./sign_components.css";
import logo from '../rsz_11logo.png';
import axios from 'axios';
import { Redirect } from "react-router-dom";

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
                console.log(res);
                console.log(res.status);
                this.setState({ redirect: "True" });
                window.sessionStorage.setItem("authToken", res.data.auth_token.text);
            })
            .catch(error =>{
                if (error.response){
                    if (error.response.status == 401){
                        alert ("The email or password you have entered is incorrect. Please try again.");
                    }
                    else{
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
    render() {
        if(this.state.redirect === "False"){
            return(
                <div className="login">
                    <img src={logo} alt="Tursu Logo"></img>
                    <h1>Sign In</h1>
                    <form onSubmit={this.handleSubmit}>
                        <input className="tursu_input" type="email" name="email" id="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} required />
                        <br/>

                        <input className="tursu_input" type="password" name="password" id="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} required />

                        <br/>
                        <button type="submit" className="tursu_button">Sign In</button>
                    </form>
                    <button type="button" onClick={this.goToRegistration} className="smallButton">New to Turşu? Sign up.</button>
                    <button type="button" onClick={this.goToForgotP} className="smallButton">I forgot my password.</button>
                </div>
            )
        }
            else if (this.state.redirect === "True"){
                window.sessionStorage.setItem("isLogged", "true");
                return (<Redirect to={".."} />)
            }
        }
    }


