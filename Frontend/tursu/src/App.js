import './App.css';
import HomePage from "./MainPage/HomePage";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Category from "./NavigationBar/Category";
import Sign from "./Sign/Sign";
import ProductDetailPage from "./Product/ProductDetailPage";
import SearchPage from "./NavigationBar/Search";
import VendorProfilePage from "./Profiles/Vendor/VendorProfilePage";
import CustomerProfilePage from "./Profiles/Customer/CustomerProfilePage";
import ShoppingCart from "./ShoppingCart-List/ShoppingCart"
import ShoppingList from "./ShoppingCart-List/ShoppingList";
import AddProduct from "./Profiles/Vendor/AddProduct";
import Checkout from "./Order/Checkout";
import EditProduct from "./Profiles/Vendor/EditProduct";
import DeleteProduct from "./Profiles/Vendor/DeleteProduct";
import AdminPanel from "./Admin/AdminPanel"
import VendorPublicProfile from "./Vendor/VendorPublicProfile";
import MessagingPage from "./Messaging/MessagingPage";
import ActivityStream from "./Admin/ActivityStream"
import Acknowledgements from "./Footer/Acknowledgements";



function App() {
    return (
        <Router>
            <div className="App">
                <Route path="/" exact component={HomePage} />
                <Route path="/categories/:category" exact component={Category} />
                <Route path="/signIn" exact component={Sign} />
                <Route path="/shoppingCart" exact component={ShoppingCart} />
                <Route path="/product/"  component={ProductDetailPage} />
                <Route path="/search/:search_string/:search_type/:fprice_lower?/:fprice_upper?/:fvendor_name?/:fcategory?/:sort_by?"  component={SearchPage} />
                <Route path="/vendorProfile" exact component={VendorProfilePage} />
                <Route path="/customerProfile" exact component={CustomerProfilePage} />
                <Route path="/shoppingList/:name" exact component={ShoppingList} />
                <Route path="/addProduct" exact component={AddProduct} />
                <Route path="/editProduct" exact component={EditProduct} />
                <Route path="/deleteProduct" exact component={DeleteProduct} />
                <Route path="/checkout" exact component={Checkout} />
                <Route path="/admin" exact component={AdminPanel} />
                <Route path="/vendorPublicProfile/:vendor_name" exact component={VendorPublicProfile} />
                <Route path="/message" exact component={MessagingPage} />
                <Route path="/activityStream" exact component={ActivityStream} />
                <Route path="/acknowledgement" exact component={Acknowledgements} />
            </div>
        </Router>
    );
}

export default App;

