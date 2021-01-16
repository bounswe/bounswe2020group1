import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import OptionList from "./OptionList";
import SearchPage from "./Search";
import Checkbox from '@material-ui/core/Checkbox';

var res = "";
var res2 = "";
var res3 = "";
var res4 = "";


const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);



const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);


export default function RadioButtons(props) {



    const handleChangeSortBy = (event) => {
        props.parentCallbackSB(event.target.value)
    };

    const handleChangeFilterSearchType = (event) => {
        if(event.target.checked)
        {
            res4 = res4.concat(event.target.value);
            res4 = res4.concat("|")
        }
        else{
            var deleted_checkbox = event.target.value.concat("|")
            res4 = res4.replace(deleted_checkbox,'');
        }
        props.parentCallbackST(res4)
    };

    const handleChangeFilterVendor = (event) => {
        console.log(event.target.value)
        if(event.target.checked)
        {
            res2 = res2.concat(event.target.value);
            res2 = res2.concat("|")
        }
        else{
            var deleted_vendor = event.target.value.concat("|")
            res2 = res2.replace(deleted_vendor,'');
        }
        props.parentCallbackFV(res2)
    };
    const handleChangeFilterCategory = (event) => {

        if(event.target.checked)
        {
            res = res.concat(event.target.name);
            res = res.concat("|")
        }
        else{
            var deleted_category = event.target.name.concat("|")
            res = res.replace(deleted_category,'');
        }
        props.parentCallbackFC(res)
    };

    const [state, setState] = React.useState({
        SortBy: false,
        FilterCategory: false,
        FilterVendors: false,
        SearchType: false,
        checkedVendors: [],

    });

    const [lastSelectedRadioButton, setlastSelectedRadioButton] =React.useState();

    const [cat, setCategory] = React.useState({
        gilad: false,
        jason: false,
        antoine: false,
    });


    const handleChange = (event) => {
        setCategory({ ...cat, [event.target.name]: event.target.checked });
    };

    const handleChange2 = (event) => {


        res3 = event.target.name;
        console.log(res3)


    };

    const { Electronics, Fashion, Home, Cosmetics, Sports, Office, vendor, product } = cat;


    const handleChangeSwitch = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });

        if(event.target.name === "FilterCategory")
        {
            props.parentCallbackSC(event.target.checked)

        }
        if(event.target.name === "FilterVendors")
        {
            props.parentCallbackSV(event.target.checked)

        }
    };

    return (

        <div align={"left"}>

            <Switch
                checked={state.SearchType}
                onChange={handleChangeSwitch}
                color="primary"
                name="SearchType"
                inputProps={{ 'aria-label': 'primary checkbox' }}
            ></Switch>Search Type

            {state.SearchType &&
            <br/>}

            {state.SearchType &&
            <FormControl component="fieldset" onChange={handleChangeFilterSearchType}>
                <FormGroup  >
                    <FormControlLabel
                        control={<GreenCheckbox checked={vendor} onChange={handleChange} name="vendor" />}
                        label="Vendor"
                        value={"vendor"}
                    />
                    <FormControlLabel
                        control={<GreenCheckbox checked={product} onChange={handleChange} name="product" />}
                        label="Product"
                        value={"product"}
                    />
                </FormGroup>
            </FormControl>
            }

            <br/>
            <Switch
                checked={state.SortBy}
                onChange={handleChangeSwitch}
                color="primary"
                name="SortBy"
                inputProps={{ 'aria-label': 'primary checkbox' }}
            ></Switch>Sort By

            {state.SortBy &&
            <RadioGroup aria-label="anonymous" name="anonymous" onChange={handleChangeSortBy} row>
                <FormControlLabel name={"bestseller"} value="bestseller" control={<GreenRadio checked={res3.includes("bestseller")} onChange={handleChange2} />} label="Bestseller" />
                <FormControlLabel name={"newest"} value="newest" control={<GreenRadio checked={res3.includes("newest")} onChange={handleChange2}/>} label="Latest" />
                <FormControlLabel name={"priceDesc"} value="priceDesc" control={<GreenRadio checked={res3.includes("priceDesc")} onChange={handleChange2} />} label="Highest price" />
                <FormControlLabel name={"priceAsc"} value="priceAsc" control={<GreenRadio checked={res3.includes("priceAsc")} onChange={handleChange2}/>} label="Lowest price" />
                <FormControlLabel name={"numComments"} value="numComments" control={<GreenRadio checked={res3.includes("numComments")} onChange={handleChange2}/>} label="Most commented" />
            </RadioGroup>}

            {props.inCategory &&
            <br/>}
            {props.inCategory &&
            <Switch
                checked={state.FilterCategory}
                onChange={handleChangeSwitch}
                color="primary"
                name="FilterCategory"
                inputProps={{'aria-label': 'primary checkbox'}}
            ></Switch>} {props.inCategory && "Filter Category"
        }
            {state.FilterCategory &&
            <br/>}
            {props.inCategory && state.FilterCategory &&
            <FormControl component="fieldset" onChange={handleChangeFilterCategory}>
                <FormGroup  >
                    <FormControlLabel
                        control={<GreenCheckbox checked={Electronics} onChange={handleChange} name="Electronics" />}
                        label="Electronics"
                        value={"Electronics"}
                    />
                    <FormControlLabel
                        control={<GreenCheckbox checked={Fashion} onChange={handleChange} name="Fashion" />}
                        label="Fashion"
                        value={"Fashion"}
                    />
                    <FormControlLabel
                        control={<GreenCheckbox checked={Home} onChange={handleChange} name="Home" />}
                        label="Home"
                        value={"Home"}
                    />
                    <FormControlLabel
                        control={<GreenCheckbox checked={Cosmetics} onChange={handleChange} name="Cosmetics" />}
                        label="Cosmetics"
                        value={"Cosmetics"}
                    />
                    <FormControlLabel
                        control={<GreenCheckbox checked={Sports} onChange={handleChange} name="Sports" />}
                        label="Sports"
                        value={"Sports"}
                    />
                    <FormControlLabel
                        control={<GreenCheckbox checked={Office} onChange={handleChange} name="Office" />}
                        label="Office"
                        value={"Office"}
                    />
                </FormGroup>
            </FormControl>
            }

            <br/>
            <Switch
                checked={state.FilterVendors}
                onChange={handleChangeSwitch}
                color="primary"
                name="FilterVendors"
                inputProps={{ 'aria-label': 'primary checkbox' }}
            ></Switch> Filter Vendors

            {state.FilterVendors &&
            <FormControl component="fieldset" onChange={handleChangeFilterVendor}>
                <FormGroup  >

                {props.vendorList.map((vendor) => (
                    <FormControlLabel value= {vendor} control={<GreenCheckbox checked={res2.includes(vendor)}/>} label= {vendor}/>
                ))}
                    </FormGroup>
            </FormControl>
            }

        </div>
    );
}

//
