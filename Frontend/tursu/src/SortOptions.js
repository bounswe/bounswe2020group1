import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

export default function RadioButtons() {
    const [value, setValue] = React.useState('bestseller');

    const handleChange = (event) => {
        setValue(event.target.value);
        window.sessionStorage.setItem("sort_by", event.target.value)
    };

    return (
        <div>
            <RadioGroup aria-label="anonymous" name="anonymous" value={value} onChange={handleChange} row>
                <FormControlLabel value="bestseller" control={<GreenRadio />} label="Bestseller" />
                <FormControlLabel value="newest" control={<GreenRadio />} label="Latest" />
                <FormControlLabel value="priceDesc" control={<GreenRadio />} label="Highest price" />
                <FormControlLabel value="priceAsc" control={<GreenRadio />} label="Lowest price" />
                <FormControlLabel value="numComments" control={<GreenRadio />} label="Most commented" />
            </RadioGroup>
        </div>
    );
}

//
