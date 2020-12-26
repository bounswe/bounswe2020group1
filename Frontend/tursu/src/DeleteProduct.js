import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "./NavBar";
import Axios from "axios";
import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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

export const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary
        // backgroundColor: "#388e3c",
    },
}));


class DeleteProduct extends React.Component{

    constructor(props) {
        super(props)

        this.state = {
            id: 0,
        }
    }

    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    submitHandler = (e) => {
        e.preventDefault()
        console.log("anelka")
        console.log(this.state)
    }



    render(){
        const { id } = this.state
        return(
            <ThemeProvider theme={theme} >
                <Grid container spacing={15} direction="column" className="HomePage">
                    <Grid item xs={12}>
                        <Paper>
                            <Navbar />
                        </Paper>
                    </Grid>

                    <Typography variant="h2" component="h2"  gutterBottom>
                        Delete a Product
                    </Typography>

                    <div>
                        <form style={{width: '600px' }} onSubmit={this.submitHandler}>
                            <Grid item xs={12}>
                                <Paper elevation={15} className={useStyles.paper}>
                                    <br/>
                                    <Button style={{width: '200px', marginRight: '50px'}} variant="contained" color="primary"  >Required ID:</Button>
                                    <Input style={{width: '300px'}} type="number" name="id"  value={id} placeholder="Enter the Product ID..." onChange={this.changeHandler} required />
                                    <br/><br/>
                                </Paper>
                            </Grid>
                            <br/>
                            <Grid item>
                                <Paper elevation={15} className={useStyles.paper}>
                                    <br/>
                                    <Button style={{width: '200px'}} variant="contained" color="primary" type="submit">Submit</Button>
                                    <br/><br/>
                                </Paper>
                            </Grid>
                            <br/><br/>
                        </form>
                    </div>
                </Grid>
            </ThemeProvider>
        );
    }
}

export default DeleteProduct;