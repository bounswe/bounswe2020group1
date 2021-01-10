import React, {useEffect} from "react"
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import Navbar from "./NavBar";
import {Tooltip, Typography} from "@material-ui/core";
import axios from "axios";
import Accordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import withStyles from "@material-ui/core/styles/withStyles";
import Rating from "@material-ui/lab/Rating";
import {Link} from "react-router-dom";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';


const vendorProfileStyles = makeStyles((theme)=>({
    root:{

    },
    mostOuterGrid:{
        marginTop: "250px",

        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    innerGrid:{
        display: "flex",
        flexDirection: "column"
    },
    typography: {
        productListing:{
            fontSize: theme.typography.pxToRem(15),
        }
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}))

/**
 * @brief Public profile page of the vendor.
 *        It is displayed to other users, not to the vendor itself.
 */
export default function VendorPublicProfile(props){
    const classes = vendorProfileStyles()
    const [vendorInfo, setVendorInfo] = React.useState([])

    /**
     * It is used for centralizing text in the AccordionSummary.
     */
    const AccordionSummary = withStyles({
        content: {
            flexGrow: 0
        }
    })(MuiAccordionSummary);

    useEffect(() => {
        axios.get("http://3.232.20.250/vendorpage/public",{
            params: {
                vendor_name: props.match.params.vendor_name
            }
        }).then(res =>{
            setVendorInfo(res.data)
        })
    }, [])

    return(
        <div className={classes.root}>
            <Navbar/>
            <Grid container className={classes.mostOuterGrid}>
                <Grid container item className={classes.innerGrid}>
                    <Grid item>
                        <Typography variant="h4">
                            {vendorInfo.username}
                        </Typography>
                        <Tooltip title={"Verified Vendor"}>
                            <VerifiedUserIcon style={{color: "#388e3c"}}/>
                        </Tooltip>
                        <Typography>
                            Istanbul/Turkey<br/><br/>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Rating
                            value = {vendorInfo.rating}
                            readOnly
                        />
                    </Grid>
                </Grid>
                <Grid container item style={{marginTop:"30px"}}>
                    <Accordion style={{width:"1000px", margin: "0 auto"}} elevation={3} defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon = {<ExpandMoreIcon/>}
                        >
                            <Typography className={classes.typography.productListing}>Products of the Vendor</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container item>
                            { vendorInfo.length === 0 ? <div></div>:
                                vendorInfo.products.map((product) => (
                                    <ListedProduct product = {product}/>
                                    ))
                            }
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </div>
    );
}

const listedProductStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        position: "relative"
    },
    paper:{
        marginLeft: 100,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(8),
        width: 700,
        height: 90,
    },
    grid: {
        paddingLeft: theme.spacing(1),
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        // alignItems: "center"
    },
    imageContainer: {
        width: 128,
        height: 128,
    },
    image: {
        width: "50%",
        height: "40px",
        marginTop: "12px"
    },
    productName: {
        flex: "0 0 150px",
        textAlign: "left"
    },
    price: {
        flex: "0 0 100px",
        textAlign: "left"
    },
    brandName: {
        flex: "0 0 100px",
        textAlign: "left",
    },
    marginInsideGrid: {
        marginBottom:  35,
    },
}));

function ListedProduct(props) {
    const classes = listedProductStyles()
    const id = props.product.id;

    return(
        <div className={classes.root}>
            <Link to={`/product/${props.product.id}`}>
                <Paper className={classes.paper} elevation={5}>
                    <Grid container item className={classes.grid} alignItems="center" spacing={4}>
                        <Grid item className={classes.imageContainer}>
                            <img
                                src={props.product.photo_url}
                                alt={props.product.name}
                                className={classes.image}/>
                        </Grid>
                        <Grid item className={[classes.marginInsideGrid, classes.productName].join(" ") }>
                            <Typography variant="subtitle2">
                                {props.product.name}
                            </Typography>
                        </Grid>
                        <Grid item className={[classes.marginInsideGrid, classes.price].join(" ")}>
                            <Typography variant="body2">
                                <Box fontWeight="fontWeightBold">
                                    {props.product.price} ₺
                                </Box>
                            </Typography>
                        </Grid>
                        <Grid item className={[classes.marginInsideGrid, classes.brandName].join(" ")}>
                            <Typography variant="caption">
                                Rating: {props.product.rating}
                            </Typography>
                        </Grid>
                        <Grid item className={[classes.marginInsideGrid, classes.brandName].join(" ")}>
                            <Typography variant="caption">
                                {props.product.category}
                            </Typography>
                        </Grid>

                        <Grid item className={[classes.marginInsideGrid, classes.brandName].join(" ")}>
                            <Typography variant="caption">
                                {props.product.stock}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Link>
        </div>
    );
}

