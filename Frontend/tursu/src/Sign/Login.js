import React, { Component} from 'react';
import "./sign_components.css";
import logo from '../rsz_11logo.png';
import axios from 'axios';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.goToRegistration = this.goToRegistration.bind(this);
        this.goToForgotP = this.goToForgotP.bind(this);
    }
    handleSubmit(event){
        console.log("form submitted");
        console.log(this.state.email);
        console.log(this.state.password);
        const user = {
            email: this.state.email,
            password: this.state.password
        };
        axios.post('http://3.232.20.250/user/login', { user })
            .then(res => {
                console.log(res);
                console.log(res.status);
                if(res.status!=200){
                    if(res.status==401){
                        alert("The email or password you have entered are incorrect, please try again.");
                    }
                    else {
                        alert("There has been an error, please try again.");
                    }
                }
                else{
                    //redirect
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
}