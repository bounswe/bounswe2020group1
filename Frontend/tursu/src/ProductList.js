import React from 'react';
import './HomePage.css'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Stepper from './Stepper'
import ProductGrid from './ProductGrid'
import Navbar from "./NavBar";
//import HomeGrid from "./HomeGrid";
import {ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 1000,
        height: 900,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
}));

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */

// TODO: get the data from backend instead of dummy data *important*

const tileData = [
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
 ];


// cellHeight'ın ayarlanması gerekebilir, salladım
export default function TitlebarGridList() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <GridList cellHeight={400} className={classes.gridList}>

                {tileData.map((tile) => (
                    <GridListTile key={tile.img}>
                        <img src={tile.img} alt={tile.title} />
                        <GridListTileBar
                            title={tile.title}
                            subtitle={<span>by: {tile.author}</span>}
                            actionIcon={
                                <Link to='/'>
                                    <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                                        <InfoIcon />
                                    </IconButton>
                                </Link>
                            }
                        />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}
