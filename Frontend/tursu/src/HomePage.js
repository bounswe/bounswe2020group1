import React from 'react';
import './HomePage.css'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Stepper from './Stepper'
import Navbar from "./NavBar";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import GridListTile from "@material-ui/core/GridListTile";
import ProductBox from "./ProductBox";

const theme = createMuiTheme({
    palette:{
        primary:{
            main: "#388e3c",
        },
        secondary:{
            main: "#81c784",
        }
    }
})

const products = [
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
    },
    {
        img: "https://i.ytimg.com/vi/XSqi5s3rfqk/maxresdefault.jpg",
        title: 'tursu',
        author: 'author',
    },
];


// put each div into a grid
// bunu da Product gibi farklı bi js dosyasına(HomeGrid) atıp importlamayı denedim ama beceremedim, ona bi bakmak lazım
class HomePage extends React.Component{
    render(){
        return(
            <ThemeProvider theme={theme} >
                <Grid container direction="column" className="HomePage">
                    <Grid item xs={12}>
                        <Paper>
                            <Navbar />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <Stepper />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} container spacing={6}>
                        {products.map((products) => ( <ProductBox/>))}
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

export default HomePage;

