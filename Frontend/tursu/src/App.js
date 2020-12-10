import './App.css';
import HomePage from "./HomePage";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Category from "./Category";
import Sign from "./Sign/Sign";
import ProductDetailPage from "./ProductDetailPage";
import SearchPage from "./Search";
import Sidebar from "./Profiles/Sidebar";
import ProfilePage from "./Profiles/ProfilePage";

function App() {
    return (
        <Router>
            <div className="App">
                <Route path="/" exact component={HomePage} />
                <Route path="/categories/:category" exact component={Category} />
                <Route path="/signIn" exact component={Sign} />
                <Route path="/product" exact component={ProductDetailPage} />
                <Route path="/search" exact component={SearchPage} />
                <Route path="/profile" exact component={ProfilePage} />
            </div>
        </Router>
    );
}

export default App;
