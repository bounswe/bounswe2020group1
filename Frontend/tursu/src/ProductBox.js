// import and use productGrid
import React from "react";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import {makeStyles} from "@material-ui/core/styles";


class ProductBox extends React.Component {

    render() {
        console.log(this.props)
        return(
            <GridListTile key={this.props.product.img}>
                <img src={this.props.product.img} alt={this.props.product.title} />
                <GridListTileBar
                    title={this.props.product.title}
                    subtitle={<span>by: {this.props.product.author}</span>}
                    actionIcon=
                        {
                            <IconButton aria-label={`info about ${this.props.product.title}`}>
                                <InfoIcon />
                            </IconButton>
                        }
                />
            </GridListTile>
        );
    }
}
export default ProductBox;