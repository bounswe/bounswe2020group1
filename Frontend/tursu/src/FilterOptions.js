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



    const handleChangeSortBy = (event) => {
        props.parentCallbackSB(event.target.value)
    };

    const handleChangeFilterVendor = (event) => {
        props.parentCallbackFV(event.target.value)
    };
    const handleChangeFilterCategory = (event) => {



        console.log(event.target.name)
        console.log(event.target.checked)

        if(event.target.checked)
        {
            res = res.concat(event.target.name);
            res = res.concat("|")
        }
        else{
            var deleted_category = event.target.name.concat("|")
            res = res.replace(deleted_category,'');
        }
        console.log(res)

        props.parentCallbackFC(res)
    };

    const [state, setState] = React.useState({
        SortBy: false,
        FilterCategory: false,
        FilterVendors: false,

    });
    const [cat, setCategory] = React.useState({
        gilad: false,
        jason: false,
        antoine: false,
    });

    const handleChange = (event) => {
        setCategory({ ...cat, [event.target.name]: event.target.checked });
    };

    const { Electronics, Fashion, Home, Cosmetics, Sports, Office } = cat;

    const handleChangeSwitch = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        console.log(event.target.name)
        console.log(event.target.checked)
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
                        control={<Checkbox checked={Electronics} onChange={handleChange} name="Electronics" />}
                        label="Electronics"
                        value={"Electronics"}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={Fashion} onChange={handleChange} name="Fashion" />}
                        label="Fashion"
                        value={"Fashion"}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={Home} onChange={handleChange} name="Home" />}
                        label="Home"
                        value={"Home"}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={Cosmetics} onChange={handleChange} name="Cosmetics" />}
                        label="Cosmetics"
                        value={"Cosmetics"}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={Sports} onChange={handleChange} name="Sports" />}
                        label="Sports"
                        value={"Sports"}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={Office} onChange={handleChange} name="Office" />}
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
            <RadioGroup aria-label="anonymous" name="anonymous" onChange={handleChangeFilterVendor} row>
                <OptionList vendorList={props.vendorList}/>
            </RadioGroup>}
        </div>
    );
}

//
