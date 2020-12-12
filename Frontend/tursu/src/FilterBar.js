import React, { Component } from "react";
import {Button, fade} from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import './FilterBar.css'
import Select from '@material-ui/core/Select';
import {Link} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import RangeSlider from "./FilterSlider";
import RadioButtons from "./SortOptions";
import {makeStyles} from "@material-ui/core/styles";


// const useStyles = makeStyles((theme)=> ({
//     root:{
//         display: "flex",
//         width:400,
//     },
// }))


class Filter extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            checked: true,
            sortBy: "bestseller",
        };

    }
    render(){
        // const classes = useStyles();
        return (
            <div >
                <div className="col-sm">
                    <RadioButtons/>
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
                <div  className="col-sm">
                    <RangeSlider/>
                </div>
                <div  className="col-sm">
                    <Link to='/search'>
                        <Button className="filter-button" variant="contained" color="secondary" onClick={() => {window.sessionStorage.setItem("sort_by", document.getElementById("sort_by_id").value);
                        }}>
                            Filter
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }
}
export default Filter;
