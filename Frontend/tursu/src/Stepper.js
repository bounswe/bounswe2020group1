import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const products = [
    {
        label: 'Apple Macbook Pro Touch Bar',
        imgPath:
            'https://productimages.hepsiburada.net/s/32/375/10354045517874.jpg',
    },
    {
        label: 'Samsung Galaxy S10',
        imgPath:
            'https://productimages.hepsiburada.net/s/25/500/10107307622450.jpg',
    },
    {
        label: 'Nike Air Max 270 Unisex',
        imgPath:
            'https://cdn-ss.akinon.net/products/2019/11/22/176133/5f94a5dd-c875-4858-8f9a-fed16b5e74fb_size1400x1400_quality85_cropCenter.jpg',
    },
    {
        label: 'Ironing Table',
        imgPath:
            'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.singeryetkilisatici.com%2Fimages_buyuk%2Ff48%2FSinger-SB2040-Rezistansli-Fanli-_48_1.jpg&f=1&nofb=1',
    },
    {
        label: 'Voit Pilates Ball',
        imgPath:
            'https://aknbarcin.b-cdn.net/products/2020/01/13/86119/5cb857d7-523b-4f21-976c-26997c4863e2.jpg',
    },
];

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 400,
        flexGrow: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
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

function SwipeableTextMobileStepper() {
    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = products.length;

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
            <Paper square elevation={2} className={classes.header}>
                <Typography align="center">{products[activeStep].label}</Typography>
            </Paper>
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {products.map((step, index) => (
                    <div key={step.label}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <img className={classes.img} src={step.imgPath} alt={step.label} />
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

export default SwipeableTextMobileStepper;
