import React, { Component} from 'react';
import logo from './rsz_11logo.png';
import "./Sign/sign_components.css";

export default class Acknowledgements extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return(
            <div className="sign-component">
                <div className="customerRegistration">
                    <img src={logo} alt="Tursu Logo"></img>
                    <h1>Third Party Software Acknowledgements of Turşu</h1>

                </div>
            </div>
        )
    }
}
