import React, { Component} from 'react';
import logo from '../NavigationBar/rsz_11logo.png';
import "../Sign/sign_components.css";

export default class Acknowledgements extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return(
            <div className="third-component">
                <div className="acknowledgements">
                    <img src={logo} alt="Tursu Logo"></img>
                    <h1>Third Party Software Acknowledgements of Turşu</h1>
                    <ul className="lst">
                        <li><a href="https://github.com/axios/axios">Axios</a></li>
                        <li><a href="https://material-ui.com/">Material UI</a></li>
                        <li><a href="https://www.datamuse.com/api/">Datamuse API</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}
