import React from 'react';
import Grid from "@material-ui/core/Grid";
import NonverifiedProductBox from "./NonverifiedProductBox";




export default function ProductListNonverified(props) {

    const handlecallbackUpdateList = (childData) =>{
        props.callbackUpdate(childData)
    }
    console.log(props.callbackUpdate)
    return (
        <Grid item container spacing={6}>
            {props.products.map((product) => (
                <NonverifiedProductBox product={product} callbackUpdateList={handlecallbackUpdateList}/>
            ))}
        </Grid>
    );
}
