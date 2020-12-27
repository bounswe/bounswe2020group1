import './App.css';
import HomePage from "./HomePage";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Category from "./Category";
import Sign from "./Sign/Sign";
import ProductDetailPage from "./ProductDetailPage";
import SearchPage from "./Search";
import VendorProfilePage from "./Profiles/Vendor/VendorProfilePage";
import CustomerProfilePage from "./Profiles/Customer/CustomerProfilePage";
import ShoppingCart from "./ShoppingCart"
import ShoppingList from "./ShoppingList";
import AddProduct from "./Profiles/Vendor/AddProduct";
import Checkout from "./Checkout";
import EditProduct from "./Profiles/Vendor/EditProduct";
import DeleteProduct from "./Profiles/Vendor/DeleteProduct";
import AdminPanel from "./AdminPanel"



function App() {
    return (
        <Router>
            <div className="App">
                <Route path="/" exact component={HomePage} />
                <Route path="/categories/:category" exact component={Category} />
                <Route path="/signIn" exact component={Sign} />
                <Route path="/shoppingCart" exact component={ShoppingCart} />
                <Route path="/product/:id"  component={ProductDetailPage} />
                <Route path="/search/:search_string/:search_type/:fprice_lower?/:fprice_upper?/:fvendor_name?/:fcategory?/:sort_by?"  component={SearchPage} />
                <Route path="/vendorProfile" exact component={VendorProfilePage} />
                <Route path="/customerProfile" exact component={CustomerProfilePage} />
                <Route path="/shoppingList/:name" exact component={ShoppingList} />
                <Route path="/addProduct" exact component={AddProduct} />
                <Route path="/editProduct" exact component={EditProduct} />
                <Route path="/deleteProduct" exact component={DeleteProduct} />
                <Route path="/checkout" exact component={Checkout} />
                <Route path="/admin" exact component={AdminPanel} />
            </div>
        </Router>
    );
}

export default App;
