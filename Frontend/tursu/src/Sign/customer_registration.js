import React, { Component} from 'react';
import "./sign_components.css";
import axios from "axios";


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
            username: ""
            }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleSubmit(event){
        console.log("form submitted");
        if (this.state.password === this.state.password_confirmation){
            const user = {
                email: this.state.email,
                is_vendor: 'False',
                first_name: this.state.name,
                last_name: this.state.surname,
                username: this.state.username,
                password: this.state.password,
                IBAN: '',
                location: ''
            };
            axios.post('http://3.232.20.250/user/signup', { user }).then(res =>{
                    console.log(res);
                    console.log(res.data)
                    if(res.status!=200){
                        alert("There has been an error, please try again.");
                    }
                    else{
                        //redirect
                    }
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