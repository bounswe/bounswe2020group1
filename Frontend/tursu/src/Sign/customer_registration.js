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
    }
    handleSubmit(event){
        if (this.state.password === this.state.password_confirmation){
            const formData = new FormData();
            formData.append("email", this.state.email);
            formData.append("is_vendor", "False");
            formData.append("first_name", this.state.name);
            formData.append("last_name", this.state.surname);
            formData.append("username", this.state.username);
            formData.append("password", this.state.password);
            formData.append("IBAN", "");
            formData.append("location", "");
            axios.post('http://3.232.20.250/user/signup', formData)
                .then(res =>{
                    console.log(res);
                    console.log(res.data)
                    this.setState({ redirect: "True" });
                })
                .catch(error =>{
                    console.log(error.response.status)
                    alert ("There has been an error. Please try again.");
                })
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
    render() {
        if(this.state.redirect === "False"){
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
        else if (this.state.redirect === "True"){
            window.sessionStorage.setItem("isLogged", "true");
            return (<Redirect to={".."} />)
        }
    }
}
