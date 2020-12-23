import React, { Component } from "react";
import {Button, fade} from "@material-ui/core";
import './FilterBar.css'
import {Link} from "react-router-dom";
import RangeSlider from "./FilterSlider";
import RadioButtons from "./FilterOptions";
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from '@material-ui/icons/Clear';



class Filter extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            checked: true,
            sortBy: "bestseller",
            dataSortBy : null,
            dataFilterCategory : null,
            dataFilterVendor : null,
            dataSlider : []
        };

    }

    handleCallbackdataSortBy = (childData) =>{
        this.setState({dataSortBy: childData})
        this.props.callbackSort(childData)
    }

    handleCallbackdataFilterCategory = (childData) =>{
        this.props.callbackCategory(childData)
        this.setState({dataFilterCategory: childData})
    }
    handleCallbackdataFilterVendor = (childData) =>{
        this.setState({dataFilterVendor: childData})
        this.props.callbackVendor(childData)
    }

    handleCallbackSlider = (childData) =>{
        this.props.callbackRange(childData)
        this.setState({dataSlider: childData})
    }
    handleCallbackCategorySwitch = (childData) =>{
        this.props.callbackCategorySwitch(childData)
    }

    handleCallbackVendorSwitch = (childData) =>{
        this.props.callbackVendorSwitch(childData)
    }

    render(){
        return (
            <div >
                <div className="col-sm">
                    <RadioButtons parentCallbackSB = {this.handleCallbackdataSortBy} parentCallbackFC = {this.handleCallbackdataFilterCategory} parentCallbackFV = {this.handleCallbackdataFilterVendor}  parentCallbackSC = {this.handleCallbackCategorySwitch} parentCallbackSV = {this.handleCallbackVendorSwitch} vendorList={this.props.vendorList}/>
                </div>
                <div  className="col-sm">
                    <RangeSlider parentCallback = {this.handleCallbackSlider}/>
                </div>
                <Link to={`/search/${window.sessionStorage.getItem("searched")}/${window.sessionStorage.getItem("search_type")}/${this.state.dataSlider[0]}/${this.state.dataSlider[1]}/${this.state.dataFilterVendor}/${this.state.dataFilterCategory}/${this.state.dataSortBy}`}>
                    <IconButton >
                        <FilterListIcon/>
                    </IconButton>
                </Link>
                <Link to={`/search/${window.sessionStorage.getItem("searched")}/${window.sessionStorage.getItem("search_type")}`}>
                    <IconButton >
                        <ClearIcon />
                    </IconButton>
                </Link>

            </div>
        );
    }
}
export default Filter;
