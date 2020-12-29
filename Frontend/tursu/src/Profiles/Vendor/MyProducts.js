import React, { Component} from 'react';
import OfferedProduct from "./OfferedProduct"
import axios from 'axios';

export default class myProducts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            product_list : []
        }

    }
    componentDidMount() {
        console.log('componentDidMount() lifecycle');
        var token = sessionStorage.getItem("authToken");
        axios.get('http://3.232.20.250/vendorpage', {headers: {Authorization: 'Token ' + token}})
        .then(res => {
            console.log(res)
            this.setState({ product_list: res.data.products});

        })
        .catch(error =>{
            if (error.response){
                console.log(error.response.message);
            }
        })
    }

    render() {
        return(
            <div>
                {this.state.product_list.map((product) => (
                    <OfferedProduct handleID={this.props.handleID} edit={this.props.edit} product={product}/>
                ))}
            </div>
        )


    }
}
