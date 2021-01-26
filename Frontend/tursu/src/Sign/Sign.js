import React, { Component} from 'react';
import "./sign_components.css";
import Registration from "./Registration";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import Verification from "./EmailVerification";

export default class Sign extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sign : "login",
            message : "",
            saved_u : "",
            saved_p : "",
        }
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handleVerificationChange = this.handleVerificationChange.bind(this);
        this.handleRegistrationChange = this.handleRegistrationChange.bind(this);
        this.handleForgotPChange = this.handleForgotPChange.bind(this);
        this.setMessage = this.setMessage.bind(this);
        this.setP = this.setP.bind(this);
        this.setU = this.setU.bind(this);
    }
    handleLoginChange(){
        this.setState({
            sign:"login"
        });
    }
    handleVerificationChange(){
        this.setState({
            sign:"verification"
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
    setMessage(m){
        this.setState({message:m});
    }
    setU(u){
        this.setState({saved_u:u});
    }
    setP(p){
        this.setState({saved_p:p});
    }
    render() {
        if (this.state.sign === "registration"){
            return(
                <div className="sign-component">
                    <Registration onLoginChange={this.handleLoginChange} onVerifChange={this.handleVerificationChange} setM={this.setMessage} setP={this.setP} setU={this.setU}/>
                </div>
            )
        }
        else if (this.state.sign === "login"){
            return(
                <div className="sign-component">
                    <Login onRegistrationChange={this.handleRegistrationChange} onForgotPChange={this.handleForgotPChange} onVerifChange={this.handleVerificationChange} setM={this.setMessage} setP={this.setP} setU={this.setU}/>
                </div>
            )
        }
        else if (this.state.sign === "forgot_password"){
            return(
                <div className="sign-component">
                    <ForgotPassword onLoginChange={this.handleLoginChange}/>
                </div>
            )
        }
        else if (this.state.sign === "verification"){
            return(
                <div className="sign-component">
                    <Verification onRegistrationChange={this.handleRegistrationChange} message={this.state.message} username={this.state.saved_u} password={this.state.saved_p}/>
                </div>
            )
        }
    }
}
