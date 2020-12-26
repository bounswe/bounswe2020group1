import React, { Component} from 'react';
import Order from "./Order";


export default class myOrders extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }

    }

    render() {
        return(
            <div>
            <Order />
            <br/>
            <Order />
            <br/>
            <Order />
            <br/>
            <Order />
            <br/>
            </div>
        )


    }
}
