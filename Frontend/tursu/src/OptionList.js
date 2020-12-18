import React from 'react';
import './HomePage.css'
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Axios from "axios";


const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);



const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-st1art',
        alignItems: 'flex-start',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function OptionList() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        vendors: []

    });
//  This part should be done in the parent class
//     Axios.get('http://3.232.20.250/helper/allvendors',{
//
//     })
//         .then(res => {
//             console.log(res)
//             setState({vendors: res.data})
//         })
// //

    return (
        <div>
            {state.vendors.map((vendor) => (
                <FormControlLabel value= {vendor} control={<GreenRadio />} label= {vendor}/>
            ))}
        </div>
    );
}
