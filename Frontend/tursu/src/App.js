import './App.css';
import HomePage from "./HomePage";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Category from "./Category";
import Sign from "./Sign/Sign";
import ProductDetailPage from "./ProductDetailPage";
import SearchPage from "./Search";
import ShoppingCart from "./ShoppingCart"


function App() {
    return (
        <Router>
            <div className="App">
                <Route path="/" exact component={HomePage} />
                <Route path="/categories/:category" exact component={Category} />
                <Route path="/signIn" exact component={Sign} />
                <Route path="/product" exact component={ProductDetailPage} />
                <Route path="/search" exact component={SearchPage} />
                <Route path="/shoppingCart" exact component={ShoppingCart} />
            </div>
        </Router>
    );
}

export default App;
