import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import OptionList from "./OptionList";
import SearchPage from "./Search";

const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

export default function RadioButtons(props) {
    const [SortValue, setSortValue] = React.useState();
    const [CategoryValue, setCategoryValue] = React.useState();
    const [VendorValue, setVendorValue] = React.useState();



    const handleChangeSortBy = (event) => {
        console.log(event.target.value)
        props.parentCallbackSB(event.target.value)
        console.log(event.target.value)

    };

    const handleChangeFilterVendor = (event) => {
        setVendorValue(event.target.value);
        props.parentCallbackFV(event.target.value)
    };

    const handleChangeFilterCategory = (event) => {
        setCategoryValue(event.target.value);
        props.parentCallbackFC(event.target.value)
    };

    const [state, setState] = React.useState({
        SortBy: false,
        FilterCategory: false,
        FilterVendors: false,

    });

    const handleChangeSwitch = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        console.log(event.target.name)
        console.log(event.target.checked)
        if(event.target.name === "FilterCategory")
        {
            props.parentCallbackSC(event.target.checked)
        }
        // parentCallbackSC
        window.sessionStorage.setItem("isfcategory", state.FilterCategory);
        window.sessionStorage.setItem("isfvendor", state.FilterVendors);
    };

    return (

        <div>
            <Switch
                checked={state.SortBy}
                onChange={handleChangeSwitch}
                color="primary"
                name="SortBy"
                inputProps={{ 'aria-label': 'primary checkbox' }}
            ></Switch>Sort By

            {state.SortBy &&
            <RadioGroup aria-label="anonymous" name="anonymous" onChange={handleChangeSortBy} row>
                <FormControlLabel value="bestseller" control={<GreenRadio />} label="Bestseller" />
                <FormControlLabel value="newest" control={<GreenRadio />} label="Latest" />
                <FormControlLabel value="priceDesc" control={<GreenRadio />} label="Highest price" />
                <FormControlLabel value="priceAsc" control={<GreenRadio />} label="Lowest price" />
                <FormControlLabel value="numComments" control={<GreenRadio />} label="Most commented" />
            </RadioGroup>}

            <br/>
            <Switch
                checked={state.FilterCategory}
                onChange={handleChangeSwitch}
                color="primary"
                name="FilterCategory"
                inputProps={{ 'aria-label': 'primary checkbox' }}
            ></Switch> Filter Category

            {state.FilterCategory &&
            <RadioGroup aria-label="anonymous" name="anonymous" onChange={handleChangeFilterCategory} row>
                <FormControlLabel value="Electronics" control={<GreenRadio />} label="Electronics" />
                <FormControlLabel value="Fashion" control={<GreenRadio />} label="Fashion" />
                <FormControlLabel value="Home" control={<GreenRadio />} label="Home" />
                <FormControlLabel value="Cosmetics" control={<GreenRadio />} label="Cosmetics" />
                <FormControlLabel value="Sports" control={<GreenRadio />} label="Sports" />
                <FormControlLabel value="Office" control={<GreenRadio />} label="Office" />
            </RadioGroup>}

            <br/>
            <Switch
                checked={state.FilterVendors}
                onChange={handleChangeSwitch}
                color="primary"
                name="FilterVendors"
                inputProps={{ 'aria-label': 'primary checkbox' }}
            ></Switch> Filter Vendors

            {/*{state.FilterVendors &&*/}
            {/*<RadioGroup aria-label="anonymous" name="anonymous" onChange={handleChangeFilterVendor} row>*/}
            {/*    <OptionList/>*/}
            {/*</RadioGroup>}*/}
        </div>
    );
}

//
