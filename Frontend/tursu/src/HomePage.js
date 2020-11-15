import React from 'react';
import './HomePage.css'

class HomePage extends React.Component{
    render(){
        return(
            <div>
                <Navbar />
                <Product name="telefon" price="3600" imageUrl="blbalba"/>
            </div>
        );
    }
}

class Navbar extends React.Component{
    render(){
        return(
            <div className="Navbar">
                <img src = "https://raw.githubusercontent.com/bounswe/bounswe2020group1/master/images/logo.PNG"
                     alt ="logo"
                     className = "logo"
                     />
            </div>
        );
    }
}

class Product extends React.Component {
    render() {
        return(
            <div className="container">
                <div className="ProductInfo">
                    <img
                        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.manufactum.de%2Fis%2Fimage%2FManufactum%2F1000s_shop%2Ftelefon-w-48--67326_01.jpg&f=1&nofb=1"
                        alt={this.props.name}
                        className="responsiveImage"/>
                    <text>
                        <br/>
                        {this.props.name} <br/>
                        {this.props.price}
                    </text>
            </div>
            <div className="ProductInfo">
                <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.manufactum.de%2Fis%2Fimage%2FManufactum%2F1000s_shop%2Ftelefon-w-48--67326_01.jpg&f=1&nofb=1"
                     alt={this.props.name}
                     class="responsiveImage"/>
                <text>
                    <br/>
                    {this.props.name} <br/>
                    {this.props.price}
                </text>
            </div>
            </div>
        );
    }
}

export default HomePage;