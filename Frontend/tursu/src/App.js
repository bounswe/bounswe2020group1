import './App.css';
import HomePage from "./HomePage";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Category from "./Category";
import Sign from "./Sign/Sign";
import ProductDetailPage from "./ProductDetailPage";
import SearchPage from "./Search";

function App() {
    return (
        <Router>
            <div className="App">
                <Route path="/" exact component={HomePage} />
                <Route path="/categories/:category" exact component={Category} />
                <Route path="/signIn" exact component={Sign} />
                <Route path="/product/:id"  component={ProductDetailPage} />
                <Route path="/search/:search_string/:search_type/:fprice_lower?/:fprice_upper?/:fvendor_name?/:fcategory?/:sort_by?"  component={SearchPage} />
            </div>
        </Router>
    );
}

export default App;
