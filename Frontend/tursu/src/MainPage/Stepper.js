import React, {useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Axios from "axios";
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 400,
        flexGrow: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor: theme.palette.background.grey,
    },
    name :{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor: theme.palette.background.default,
    },
    img: {
        // height: 255,
        // display: 'block',
        // maxWidth: 400,
        // overflow: 'hidden',
        // width: '100%',
        width: "auto",
        height: "130px",
        marginTop: "7px"
    },
}));

function Stepper() {
    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const [productNames, setProductNames] = React.useState([]);
    const [productIDS, setProductIDS] = React.useState([]);
    const [productImages, setProductImages] = React.useState([]);
    const maxSteps = productNames.length;

    //ComponentDidMount
    useEffect(() => {
        Axios.get('http://3.232.20.250/recommendation/bestseller')
            .then(res => {
                let tempName = []
                let tempImage = []
                let tempID = []
                for(let i=0; i<res.data.length; i++)
                {
                    tempName.push(res.data[i].name)
                    tempImage.push(res.data[i].photo_url)
                    tempID.push(res.data[i].id)
                }
                console.log("IMAGES", tempImage)
                setProductNames(tempName)
                setProductImages(tempImage)
                setProductIDS(tempID)
        })
    }, [])

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };


    return (
        <div className={classes.root}>
            <Paper square elevation={3} className={classes.header}>
                <Typography align="center">
                    <Box fontWeight="fontWeightBold"> BEST SELLERS </Box>
                </Typography>
            </Paper>
            <Paper square elevation={0} className={classes.name}>
                <Typography align="center">{productNames[activeStep]}</Typography>
            </Paper>
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {productImages.map((step, index) => (
                    <div>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <Link to={`/product/${productIDS[activeStep]}`}>
                                <Paper elevation={5}>
                                    <img className={classes.img} src={step} alt={"photo"} />
                                </Paper>
                            </Link>
                        ) : null}
                    </div>
                ))}
            </AutoPlaySwipeableViews>
            <MobileStepper
                steps={maxSteps}
                position="static"
                variant="text"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                        Next
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        Back
                    </Button>
                }
            />
        </div>
    );
}

export default Stepper;
