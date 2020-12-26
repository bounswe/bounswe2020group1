import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        width: 300,
    },
});

function valuetext(value) {
    return {value};
}

export default function RangeSlider( props ) {
    const classes = useStyles();
    const [value, setValue] = React.useState([20, 8000]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        props.parentCallback(newValue);
    };


    return (
        <div className={classes.root}>
            <Typography id="range-slider" gutterBottom>
                Price range(₺)
            </Typography>
            <Slider
                value={value}
                onChangeCommitted={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={valuetext}
                max={10000}

            />
        </div>
    );
}

