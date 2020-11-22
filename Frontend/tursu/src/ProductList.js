import React from 'react';
import './HomePage.css'
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import ProductBox from "./ProductBox";
import Grid from "@material-ui/core/Grid";


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

// TODO: get the data from backend instead of dummy data *important*
const products = [
   {
         img: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/HA244?wid=1144&hei=1144&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1596141797000",
         title: 'Macbook',
         author: 'Apple',
   },
    {
        img: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/HA244?wid=1144&hei=1144&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1596141797000",
        title: 'Macbook',
        author: 'Apple',
    },
    {
        img: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/HA244?wid=1144&hei=1144&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1596141797000",
        title: 'Macbook',
        author: 'Apple',
    },
    {
        img: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/HA244?wid=1144&hei=1144&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1596141797000",
        title: 'Macbook',
        author: 'Apple',
    },
    {
        img: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/HA244?wid=1144&hei=1144&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1596141797000",
        title: 'Macbook',
        author: 'Apple',
    },
   {
       img: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone11-select-2019-family_GEO_EMEA?wid=882&amp;hei=1058&amp;fmt=jpeg&amp;qlt=80&amp;op_usm=0.5,0.5&amp;.v=1567022219953",
       title: 'iPhone',
       author: 'Apple',
   },
    {
        img: "https://productimages.hepsiburada.net/s/27/375/10195585695794.jpg",
        title: 'LG TV',
        author: 'LG',
    },
    {
        img: "https://i.ytimg.com/vi/XSqi5s3rfqk/maxresdefault.jpg",
        title: 'tursu',
        author: 'author',
    },
    {
        img: "https://i.ytimg.com/vi/XSqi5s3rfqk/maxresdefault.jpg",
        title: 'tursu',
        author: 'author',
    },
    {
        img: "https://i.ytimg.com/vi/XSqi5s3rfqk/maxresdefault.jpg",
        title: 'tursu',
        author: 'author',
    },{
        img: "https://i.ytimg.com/vi/XSqi5s3rfqk/maxresdefault.jpg",
        title: 'tursu',
        author: 'author',
    },


 ];


export default function ProductsGrid() {
    const classes = useStyles();

    return (
        <Grid item container className={classes.root} spacing={6}>
            {products.map((tile) => (
                <ProductBox />
            ))}
        </Grid>
    );
}
