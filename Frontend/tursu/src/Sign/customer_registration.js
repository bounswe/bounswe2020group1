import React, { Component} from 'react';
import "./sign_components.css";
import axios from "axios";
import { Redirect } from "react-router-dom";

export default class Customer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            password_confirmation: "",
            user_type: "customer",
            name: "",
            surname: "",
            username: "",
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
                formData.append("is_vendor", "");
                formData.append("first_name", this.state.name);
                formData.append("last_name", this.state.surname);
                formData.append("username", this.state.username);
                formData.append("password", this.state.password);
                formData.append("IBAN", "");
                formData.append("latitude", 1.11);
                formData.append("longitude", 1.11);
                formData.append("city", "");
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
                        console.log(error.response.status)
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
    render() {
            return(
                <div>

                    <form onSubmit={this.handleSubmit}>
                        <input className="tursu_input" type="text" name="name" id="name" placeholder="Name" value={this.state.name} onChange={this.handleChange} required />
                        <input className="tursu_input" type="text" name="surname" id="surname" placeholder="Surname" value={this.state.surname} onChange={this.handleChange} required />
                        <br/>

                        <input className="tursu_input" type="text" name="username" id="username" placeholder="Username" value={this.state.username} onChange={this.handleChange} required />

                        <input className="tursu_input" type="email" name="email" id="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} required />
                        <br/>

                        <input className="tursu_input" type="password" name="password" id="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} required />


                        <input className="tursu_input" type="password" name="password_confirmation" id="password_confirmation" placeholder="Password Confirmation" value={this.state.password_confirmation} onChange={this.handleChange} required />
                        <br/>

                        <button type="submit" className="tursu_button">Sign Up</button>
                    </form>

                </div>
            )

    }
}
