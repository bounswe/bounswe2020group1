import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import Avatar from "@material-ui/core/Avatar";


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Turşu
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createMuiTheme({
    palette:{
        primary:{
            main: "#519657",
        },
        secondary:{
            main: "#3CBC8D",
        }
    }
})

const useStyles = makeStyles((theme) => ({

    layout: {

        color: '#388e3c',
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: '50%',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    logo: {
        height: theme.spacing(13),
        width: theme.spacing(13),
    },
    paper: {
        backgroundColor: '#ffffff', /* white or green */
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {

            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        backgroundColor: '#ffffff',
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));

const steps = ['Shipping address', 'Payment details', 'Review your order'];

function getStepContent(step, cardNumber, setCardNumber, cvc, setCvc, expMonth, setExpMonth, expYear, setExpYear, distanceClicked, setDistanceClicked, preClicked, setPreClicked) {
    switch (step) {
        case 0:
            return <AddressForm />;
        case 1:
            return <PaymentForm cardNumber={cardNumber} setCardNumber={setCardNumber}
                                cvc={cvc} setCvc={setCvc}
                                expMonth={expMonth} setExpMonth={setExpMonth}
                                expYear={expYear} setExpYear={setExpYear}
                                distanceClicked={distanceClicked} setDistanceClicked={setDistanceClicked}
                                preClicked={preClicked} setPreClicked={setPreClicked}
            />;
        case 2:
            return <Review />;
        default:
            throw new Error('Unknown step');
    }
}

export default function Checkout() {
    const [cardNumber, setCardNumber] = useState("");
    const [expMonth, setExpMonth] = useState(0);
    const [expYear, setExpYear] = useState(0);
    const [cvc, setCvc] = useState("");
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [distanceClicked, setDistanceClicked] = React.useState(0);
    const [preClicked, setPreClicked] = React.useState(0);

    const handleNext = () => {
        if (activeStep === 1 && cardNumber.length !== 16){
            alert("Card number must be 16 digits!")
            return;
        } else if (activeStep === 1 && cvc.length !== 3){
            alert("CVV must be 3 digits!")
            return;
        } else if ( (activeStep === 1 && expYear == 2020 && expMonth != 12) || (activeStep === 1 && expYear < 2020) ) {
            alert("Card expired!")
            return;
        } else if ( activeStep === 1 && distanceClicked == 0 ) {
            alert("You must accept the Distance Sale Contract!")
            return;
        } else if ( activeStep === 1 && preClicked == 0 ) {
            alert("You must accept the Pre Information Conditions!")
            return;
        }
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <React.Fragment style={{backgroundColor: '#388e3c'}} >
            <CssBaseline />
            <ThemeProvider theme={theme} >
                <AppBar position="fixed" color="primary" className={classes.appBar}>
                    <Toolbar>
                        <Link to='/'>
                            <Button>
                                <Paper elevation={5}>
                                    <Avatar variant="square" className={classes.logo}>
                                        <img src="https://raw.githubusercontent.com/bounswe/bounswe2020group1/master/images/logo.PNG"
                                             alt="logo"
                                             className={classes.logo}/>
                                    </Avatar>
                                </Paper>
                            </Button>
                        </Link>
                        <Typography variant="h5" color="inherit" noWrap>
                            Thanks for Choosing Turşu!
                        </Typography>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>

            <ThemeProvider theme={theme} >
            <div style={{backgroundColor: '#519657', paddingTop: '150px', minHeight: '100vh'}}>
                <main  className={classes.layout}>
                    <Paper elevation={15} className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            Checkout
                        </Typography>
                        <Stepper activeStep={activeStep} className={classes.stepper}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <React.Fragment>
                            {activeStep === steps.length ? (
                                <React.Fragment>
                                    <Typography variant="h5" gutterBottom>
                                        Thank you for your order.
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        Your order number is #2001539. We have emailed your order confirmation, and will
                                        send you an update when your order has shipped.
                                    </Typography>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {getStepContent(activeStep, cardNumber, setCardNumber, cvc, setCvc, expMonth, setExpMonth, expYear, setExpYear,
                                        distanceClicked, setDistanceClicked, preClicked, setPreClicked)}
                                    <div className={classes.buttons}>
                                        {activeStep !== 0 && (
                                            <Button onClick={handleBack} className={classes.button}>
                                                Back
                                            </Button>
                                        )}
                                        <Button

                                            variant="contained"
                                            color="secondary"
                                            onClick={handleNext}
                                            className={classes.button}
                                        >
                                            {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                                        </Button>
                                    </div>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    </Paper>
                    <Copyright />
                </main>
            </div>
            </ThemeProvider>
        </React.Fragment>
    );
}