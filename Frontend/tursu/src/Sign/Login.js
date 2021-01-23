import React, { Component} from 'react';
import "./sign_components.css";
import logo from '../rsz_11logo.png';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const clientId = '872287604811-526a3ojjpf2ugpn2bsq0ov3ho952cg39.apps.googleusercontent.com';


const responseGoogleFailure = response => {
    console.log(response)
    console.log("FAILURE")
    //alert("There has been an error with the Google Sign In")
}

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            redirect: "False",
            user_type: null
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
                console.log("type: ", res.data.user_type);
                this.setState({ user_type: res.data.user_type });


                window.sessionStorage.setItem("authToken", res.data.auth_token);
                window.sessionStorage.setItem("first_name", res.data.first_name);
                window.sessionStorage.setItem("last_name", res.data.last_name);
                window.sessionStorage.setItem("user_type", res.data.user_type);
                if(res.data.user_type === "admin"){
                    window.sessionStorage.setItem("first_name", "Admin");
                }

                this.setState({ redirect: "True" });



            })
            .catch(error =>{
                if (error.response){
                    if (error.response.status == 401){
                        if(error.response.data.error === "Not Verified"){
                            this.props.setU(this.state.email)
                            this.props.setP(this.state.password)
                            this.props.setM("You have not verified your email yet. Please enter the verification code we have sent you to proceed.")
                            this.props.onVerifChange()
                        }
                        else{
                            alert ("The email or password you have entered is incorrect. Please try again.");
                        }
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
        console.log("here i come")
        console.log(response)
        console.log(response.tokenId)
        const formData = new FormData();
        formData.append("tokenId", response.tokenId)

        axios.post('http://3.232.20.250/user/login/google', formData)
            .then(res =>{
                console.log(res);
                console.log(res.data);

                window.sessionStorage.setItem("authToken", res.data.auth_token);
                window.sessionStorage.setItem("first_name", res.data.first_name);
                window.sessionStorage.setItem("last_name", res.data.last_name);
                window.sessionStorage.setItem("user_type", res.data.user_type);


                this.setState({ redirect: "True" });

            })
            .catch(error =>{
                if (error.response){
                    if (error.response.status == 401){
                        alert ("Please sign up with Google before signing in!");
                    }
                    else{
                        alert ("There has been an error. Please try again.");
                    }
                }
            })


    }
    render() {
        if(this.state.redirect === "False"){
            return(
                <div className="login">
                    <img src={logo} alt="Tursu Logo"></img>

                    <Typography variant={"h4"}>Sign In</Typography>
                    <form onSubmit={this.handleSubmit}>

                        <Input style={{borderRadius: '10px',backgroundColor: "#b2fab4"}} className="tursu_input" type="text" name="email" id="email" placeholder="  Email or Username" value={this.state.email} onChange={this.handleChange} required />

                        <br/>

                        <Input style={{borderRadius: '10px',backgroundColor: "#b2fab4"}} className="tursu_input" type="password" name="password" id="password" placeholder="  Password" value={this.state.password} onChange={this.handleChange} required />

                        <br/>
                        <Button  variant="contained" style={{backgroundColor: "#3CBC8D", width:'100px'}} type="submit" className="tursu_button">Sign In</Button>
                    </form>
                    <Button variant="contained"  style={{backgroundColor: "#3CBC8D"}} type="button" onClick={this.goToRegistration} className="smallButton">New to Turşu? Sign up</Button>
                    <Button variant="contained" style={{backgroundColor: "#3CBC8D"}} type="button" onClick={this.goToForgotP} className="smallButton">I forgot my password</Button>
                    <div>
                        <GoogleLogin
                            clientId='872287604811-526a3ojjpf2ugpn2bsq0ov3ho952cg39.apps.googleusercontent.com'
                            buttonText='Sign In with Google'
                            onSuccess={this.responseGoogleSuccess}
                            onFailure={responseGoogleFailure}
                            cookiePolicy={'single_host_origin'}
                            />
                    </div>
                </div>
                )
        }

        else if (this.state.redirect === "True"){
            window.sessionStorage.setItem("isLogged", "true");
            return (<Redirect to={".."} />)
        }

    }
}
