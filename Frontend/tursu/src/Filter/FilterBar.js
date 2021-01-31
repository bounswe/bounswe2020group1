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

    componentDidMount() {
        this.setState({reset: true})    }

    constructor(props) {
        super(props);
        this.state = {
            checked: true,
            sortBy: "bestseller",
            dataSortBy : null,
            dataFilterCategory : null,
            dataFilterVendor : null,
            dataSlider : [],
            reset: null,
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

    handleCallbackSearchType = (childData) =>{
        this.props.callbackSearchType(childData)
    }

    handleCallbackSwitchType = (childData) =>{
        this.props.callbackSwitchType(childData)
    }

    render(){
        return (
            <div >
                <div className="col-sm">
                    <RadioButtons reset={this.state.reset} inCategory={this.props.inCategory} parentCallbackSB = {this.handleCallbackdataSortBy} parentCallbackFC = {this.handleCallbackdataFilterCategory} parentCallbackFV = {this.handleCallbackdataFilterVendor}  parentCallbackSC = {this.handleCallbackCategorySwitch} parentCallbackSV = {this.handleCallbackVendorSwitch} parentCallbackST = {this.handleCallbackSearchType} parentCallbackSwitchType={this.handleCallbackSwitchType} vendorList={this.props.vendorList}/>
                </div>
                <div  className="col-sm">
                    <RangeSlider parentCallback = {this.handleCallbackSlider}/>
                </div>
            </div>
        );
    }
}
export default Filter;
