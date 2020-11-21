import logo from './logo.svg';
import './App.css';
import HomePage from "./HomePage";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Category from "./Category";

function App() {
  return (
      <Router>
        <div className="App">
            <Route path="/" exact component={HomePage} />
            <Route path="/categories/:category" exact component={Category} />
        </div>
      </Router>
  );
}

export default App;
