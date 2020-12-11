import React, { Component } from "react";
import {Button} from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import './FilterBar.css'
import Select from '@material-ui/core/Select';
import {Link} from "react-router-dom";
import Grid from "@material-ui/core/Grid";



class Filter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: true,
            sortBy: "bestseller"
        };
    }
    render(){


        return (
            <div className="row">
                <div className="col-sm">

                    <label className="filters">
                        <Link to='/search'>
                        <Button className="filter-button" variant="contained" color="secondary" onClick={() => {window.sessionStorage.setItem("sort_by", document.getElementById("sort_by_id").value);
                        }}>
                            Sort by
                        </Button>
                        </Link>
                        &nbsp;
                        <select id="sort_by_id">
                            <option value="bestseller">Sort By</option>
                            <option value="newest">Latest</option>
                            <option value="priceDesc">Highest to lowest price</option>
                            <option value="priceAsc">Lowest to highest price</option>
                            <option value="numComments">Most commented</option>
                        </select>
                    </label>
                </div>
                <div  className="col-sm">
                    <label className="filters">
                        <Checkbox
                            checked={this.state.checked}
                            onChange={() => this.setState({ checked: !this.state.checked  })}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        <Checkbox
                            checked={this.state.checked}
                            onChange={() => this.setState({ checked: !this.state.checked  })}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        <Checkbox
                            checked={this.state.checked}
                            onChange={() => this.setState({ checked: !this.state.checked  })}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        <Checkbox
                            checked={this.state.checked}
                            onChange={() => this.setState({ checked: !this.state.checked  })}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        <Checkbox
                            checked={this.state.checked}
                            onChange={() => this.setState({ checked: !this.state.checked  })}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        <Checkbox
                            checked={this.state.checked}
                            onChange={() => this.setState({ checked: !this.state.checked  })}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </label>
                </div>
            </div>
        );
    }
}
export default Filter;
