import React, { Component} from 'react';
import "./sign_components.css";
import logo from '../NavigationBar/rsz_11logo.png';
import Customer from "./customer_registration";
import Vendor from "./vendor_registration";
import Typography from "@material-ui/core/Typography";



export default class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_type: "customer"
        }

        this.handleChangeCustomer = this.handleChangeCustomer.bind(this);
        this.handleChangeVendor = this.handleChangeVendor.bind(this);
        this.goToLogin = this.goToLogin.bind(this);
        this.goToVerif = this.goToVerif.bind(this);
    }

    handleChangeCustomer(event){
        this.setState({
            user_type: "vendor"
        });
    }
    handleChangeVendor(event){
        this.setState({
            user_type: "customer"
        });
    }
    goToLogin(){
        this.props.onLoginChange();
    }
    goToVerif(){
        this.props.onVerifChange();
    }
    render() {
        if (this.state.user_type === "customer"){
            return(
                <div className="customerRegistration">
                    <br/>

                    <div className="radio">
                        <a>Please select your user type: </a>
                        <input className="radio"  type="radio" id="customer" name="user-type" value="customer" checked></input>
                        <label className="radio" htmlFor="customer">Customer</label>
                        <input className="radio" type="radio" id="vendor" name="user-type" value="vendor" onChange={this.handleChangeCustomer}></input>
                        <label className="radio"  htmlFor="vendor">Vendor</label>
                    </div>
                    <br/>
                    <div>
                    <img src={logo} alt="Tursu Logo"></img>
                    <Typography variant={"h4"}>Sign Up for Customers</Typography>
                    </div>
                    <Customer login={this.goToLogin} verif={this.goToVerif} setM={this.props.setM} setP={this.props.setP} setU={this.props.setU}/>
                    <button type="button" onClick={this.goToLogin} className="smallButton">Already have an account? Sign in.</button>


                </div>
            )
        }
        else if (this.state.user_type === "vendor"){
            return(
                <div className="vendorRegistration">
                    <br></br>

                    <div className="radio">
                        <a>Please select your user type: </a>
                        <input className="radio"  type="radio" id="customer" name="user-type" value="customer" onChange={this.handleChangeVendor}></input>
                        <label className="radio" htmlFor="customer">Customer</label>
                        <input className="radio" type="radio" id="vendor" name="user-type" value="vendor" checked></input>
                        <label className="radio"  htmlFor="vendor">Vendor</label>
                    </div>
                    <br/>
                    <div>
                        <img src={logo} alt="Tursu Logo"></img>
                        <Typography variant={"h4"}>Sign Up for Vendors</Typography>
                    </div>
                    <Vendor login={this.goToLogin} verif={this.goToVerif} setM={this.props.setM} setP={this.props.setP} setU={this.props.setU}/>
                    <button type="button" onClick={this.goToLogin} className="smallButton">Already have an account? Sign in.</button>


                </div>
            )
        }

    }
}
