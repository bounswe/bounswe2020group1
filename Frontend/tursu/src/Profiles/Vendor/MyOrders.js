import React, { Component} from 'react';
import Order from "./Order";
import axios from 'axios';

export default class myOrders extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order_list : [],
            product_list : []
        }

    }
    componentDidMount() {
        console.log('componentDidMount() lifecycle');
        var token = sessionStorage.getItem("authToken");
        axios.get('http://3.232.20.250/vendorpage', {headers: {Authorization: 'Token ' + token}})
        .then(res => {
            console.log(res)
            this.setState({ order_list: res.data.orders});
            this.setState({ product_list: res.data.products});

        })
        .catch(error =>{
            if (error.response){
                console.log(error.response.message);
            }
        })
    }

    render() {

        return (
                <div>
                    {this.state.order_list.map((order) => (
                        <Order order={order} product_list={this.state.product_list}/>
                    ))}
                </div>
            );


    }
}
