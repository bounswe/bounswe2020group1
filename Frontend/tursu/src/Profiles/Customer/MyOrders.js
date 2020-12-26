import React, { Component} from 'react';
import Order from "./Order";
import axios from 'axios';

export default class myOrders extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order_list : []
        }

    }
    componentDidMount() {
            console.log('componentDidMount() lifecycle');
            var token = sessionStorage.getItem("authToken");
            axios.get('http://3.232.20.250/order/get_orders', {headers: {Authorization: 'Token ' + token}})
            .then(res => {
                console.log(res)
                this.setState({ order_list: res.data});
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
                        <Order order={order}/>

                    ))}

                </div>
            );


    }
}
