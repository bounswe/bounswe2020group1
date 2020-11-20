import logo from './logo.svg';
import './App.css';
import HomePage from "./HomePage";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Electronics from "./categories/Electronics"
import Cosmetics from "./categories/Cosmetics"
import Fashion from "./categories/Fashion"
import Home from "./categories/Home"
import Office from "./categories/Office"
import Sports from "./categories/Sports"

function App() {
  return (
      <Router>
        <div className="App">
            <Route path="/" exact component={HomePage} />
            <Route path="/electronics" exact component={Electronics} />
            <Route path="/fashion" exact component={Fashion} />
            <Route path="/home" exact component={Home} />
            <Route path="/office" exact component={Office} />
            <Route path="/sports" exact component={Sports} />
            <Route path="/cosmetics" exact component={Cosmetics} />
        </div>
      </Router>
  );
}

export default App;
