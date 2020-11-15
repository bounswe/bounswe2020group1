import React, { Component} from 'react';
import "./sign_components.css";
import Registration from "./Registration";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";

export default class Sign extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sign : "registration"
        }
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handleRegistrationChange = this.handleRegistrationChange.bind(this);
        this.handleForgotPChange = this.handleForgotPChange.bind(this);
    }
    handleLoginChange(){
        this.setState({
            sign:"login"
        });
    }
    handleRegistrationChange(){
        this.setState({
            sign:"registration"
        });
    }
    handleForgotPChange(){
        this.setState({
            sign:"forgot_password"
        });
    }
    render() {
        if (this.state.sign === "registration"){
            return(
                <div className="sign-component">
                    <Registration onLoginChange={this.handleLoginChange}/>
                </div>
            )
        }
        else if (this.state.sign === "login"){
            return(
                <div className="sign-component">
                    <Login onRegistrationChange={this.handleRegistrationChange} onForgotPChange={this.handleForgotPChange}/>
                </div>
            )
        }
        else if (this.state.sign == "forgot_password"){
            return(
                <div className="sign-component">
                    <ForgotPassword onLoginChange={this.handleLoginChange}/>
                </div>
            )
        }
    }
}