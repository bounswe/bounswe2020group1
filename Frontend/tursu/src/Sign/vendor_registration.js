import React, { Component} from 'react';
import "./sign_components.css";
import axios from "axios";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";

const clientId = '872287604811-526a3ojjpf2ugpn2bsq0ov3ho952cg39.apps.googleusercontent.com';

const responseGoogleFailure = response => {
    console.log(response)
    console.log("FAILURE")
    //alert("There has been an error with the Google Sign In")
}

export default class Vendor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            password_confirmation: "",
            user_type: "vendor",
            name: "",
            surname: "",
            username: "",
            iban: "",
            location:"",
            longitude:"",
            latitude:"",
            redirect: "False",
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
    }
    handleSubmit(event){
        if (this.state.password === this.state.password_confirmation){
            var strength = this.checkPassword(this.state.password)
            if (strength==="ok"){
                const formData = new FormData();
                formData.append("email", this.state.email);
                formData.append("is_vendor", "True");
                formData.append("first_name", this.state.name);
                formData.append("last_name", this.state.surname);
                formData.append("username", this.state.username);
                formData.append("password", this.state.password);
                formData.append("IBAN", this.state.iban);
                formData.append("latitude", this.state.latitude);
                formData.append("longitude", this.state.longitude);
                formData.append("city", this.state.location);
                axios.post('http://3.232.20.250/user/signup', formData)
                    .then(res =>{
                        console.log(res);
                        console.log(res.data);
                        this.props.setU(this.state.email)
                        this.props.setP(this.state.password)
                        this.props.setM("We have sent you a verification code to verify your email. Please enter the code in the field below.")
                        this.props.verif()
                    })
                    .catch(error =>{
                        alert ("There has been an error. Please try again.");
                    })
            }
            else{
                alert(strength)
            }
        }
        else{
            alert("Password confirmation does not match password. Please type passwords again.");
        }
        event.preventDefault();
    }
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
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
    responseGoogleSuccess = response => {
        console.log("here i come")
        console.log(response)
        console.log(response.tokenId)
        const formData = new FormData();
        formData.append("is_vendor", "1")
        formData.append("tokenId", response.tokenId)
        formData.append("IBAN", "TR730006271333541288459635")
        formData.append("latitude", "40.095397")
        formData.append("longitude", "31.229421")
        formData.append("city", "Istanbul/Turkey")

        axios.post('http://3.232.20.250/user/signup/google', formData)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                window.sessionStorage.setItem("authToken", res.data.auth_token);
                alert ("You have successfully signed up! Please sign in.");
                this.props.login()

            })
            .catch(error =>{
                if (error.response){
                    if (error.response.status == 400){
                        alert ("You have already signed up using Google. Please Sign In.");
                    }
                    else{
                        alert ("There has been an error. Please try again.");
                    }
                }
            })
    }
    render() {

            return(
                <div className="registration">

                    <form onSubmit={this.handleSubmit}>
                        <input className="tursu_input" type="text" name="name" id="name" placeholder="Name" value={this.state.name} onChange={this.handleChange} required />
                        <input className="tursu_input" type="text" name="surname" id="surname" placeholder="Surname" value={this.state.surname} onChange={this.handleChange} required />
                        <br/>
                        <input className="tursu_input" type="text" name="iban" id="iban" placeholder="IBAN" value={this.state.iban} onChange={this.handleChange} required />
                        <input className="tursu_input" type="text" name="location" id="location" placeholder="City" value={this.state.location} onChange={this.handleChange} required />
                        <br/>
                        <input className="tursu_input" type="text" name="latitude" id="latitude" placeholder="latitude" value={this.state.latitude} onChange={this.handleChange} required />
                        <input className="tursu_input" type="text" name="longitude" id="longitude" placeholder="longitude" value={this.state.longitude} onChange={this.handleChange} required />
                        <br/>
                        <input className="tursu_input" type="text" name="username" id="username" placeholder="Username" value={this.state.username} onChange={this.handleChange} required />

                        <input className="tursu_input" type="email" name="email" id="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} required />
                        <br/>

                        <input className="tursu_input" type="password" name="password" id="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} required />


                        <input className="tursu_input" type="password" name="password_confirmation" id="password_confirmation" placeholder="Password Confirmation" value={this.state.password_confirmation} onChange={this.handleChange} required />
                        <br/>

                        <button type="submit" className="tursu_button">Sign Up</button>
                    </form>
                    <br/>
                    <div>
                        <GoogleLogin
                            clientId='872287604811-526a3ojjpf2ugpn2bsq0ov3ho952cg39.apps.googleusercontent.com'
                            buttonText='Sign Up with Google'
                            onSuccess={this.responseGoogleSuccess}
                            onFailure={responseGoogleFailure}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>

                </div>
            )

    }
}
