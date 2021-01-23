import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from "axios";
import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputAdornment from "@material-ui/core/InputAdornment";




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

/*

POST request: adds product to the systems (form data can be preffered)
		req parameters:
category:string
name:string
description:string
brand: string
stock: int
price: float
opt parameters:
photo: Image file
		response:
			success or fail messages

axios.post('http://3.232.20.250/product/add/', formData)
 */

let token;
token = window.sessionStorage.getItem("authToken")

class AddProduct extends React.Component{

    constructor(props) {
        super(props)

        this.state = {
            category: '',
            name: '',
            description: '',
            brand: '',
            stock: 0,
            price: 0.00,
            Image: '',
        }
    }

    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    fileHandler = (e) => {
        let file = e.target.files[0]
        this.setState({Image: file})
        console.log("file is " , file)
    }


    submitHandler = (e) => {
        if(this.state.price < 0){
            alert("Please enter a valid price!")
            return ;
        }
        if(this.state.stock < 0){
            alert("Please enter a valid stock!")
            return ;
        }
        const newToken = window.sessionStorage.getItem("authToken")
        const formData = new FormData();
        e.preventDefault()
        console.log("anelka")
        console.log(this.state)
        let file = this.state.Image
        formData.append("category", this.state.category);
        formData.append("name", this.state.name);
        formData.append("description", this.state.description);
        formData.append("brand", this.state.brand);
        formData.append("stock", this.state.stock);
        formData.append("price", this.state.price);
        formData.append("photo", file);

        axios
            .post("http://3.232.20.250/product/add/", formData, {
                headers: {
                    'Authorization': "Token " + newToken //the token is a variable which holds the token
                },
            }).then((response) => {

            if (response.status === 200) {
                alert("Product added!");
                console.log(response)
            }
        })
            .catch((err) => {
                if (err.response.status === 400) {
                    alert(err.response.data);
                }

            });

    }



    render(){
        const { category, name, description, brand, stock, price } = this.state
        return(
            <ThemeProvider theme={theme} >
                <Grid item>
                    <form style={{width: '600px' }} onSubmit={this.submitHandler}>
                        <Grid item xs={12}>
                            <Paper elevation={15} className={useStyles.paper}>
                                <br/>
                                <Button style={{width: '200px', marginRight: '50px'}} variant="contained" color="primary"  >Category:</Button>
                                <Input style={{width: '300px'}} type="text" name="category"  value={category} placeholder="Enter the Product Category..." onChange={this.changeHandler} required />
                                <br/><br/>
                            </Paper>
                        </Grid>
                        <br/>
                        <Grid item>
                            <Paper elevation={15} className={useStyles.paper}>
                                <br/>
                                <Button style={{width: '200px', marginRight: '50px'}} variant="contained" color="primary"  >Name:</Button>
                                <Input style={{width: '300px'}} type="text" name="name"  value={name} placeholder="Enter the Product Name..." onChange={this.changeHandler} required />
                                <br/><br/>
                            </Paper>
                        </Grid>
                        <br/>
                        <Grid item>
                            <Paper  elevation={15} className={useStyles.paper}>
                                <br/>
                                <Button style={{width: '200px', marginRight: '50px', marginTop: '20px'}} variant="contained" color="primary"  >Description:</Button>
                                <Input style={{width: '300px'}} type="text" name="description"  multiline='true' rows='3' value={description} placeholder="Enter the Product Description..." onChange={this.changeHandler} required />
                                <br/><br/>
                            </Paper>
                        </Grid>
                        <br/>
                        <Grid item>
                            <Paper elevation={15} className={useStyles.paper}>
                                <br/>
                                <Button style={{width: '200px', marginRight: '50px'}} variant="contained" color="primary"  >Brand:</Button>
                                <Input style={{width: '300px'}} type="text" name="brand" value={brand} placeholder="Enter the Product Brand..." onChange={this.changeHandler} required />
                                <br/><br/>
                            </Paper>
                        </Grid>
                        <br/>
                        <Grid item>
                            <Paper elevation={15} className={useStyles.paper}>
                                <br/>
                                <Button style={{width: '200px', marginRight: '50px'}} variant="contained" color="primary" >Stock:</Button>
                                <Input  style={{width: '300px'}} type="number" step="1" min="0" name="stock" value={stock} placeholder="Stock" onChange={this.changeHandler} required />
                                <br/><br/>
                            </Paper>
                        </Grid>
                        <br/>
                        <Grid item>
                            <Paper elevation={15} className={useStyles.paper}>
                                    <br/>
                                    <Button style={{width: '200px', marginRight: '50px'}} variant="contained" color="primary"  >Price:</Button>
                                    <Input style={{width: '300px'}} startAdornment={<InputAdornment position="start">₺</InputAdornment>} type="number" step="0.01" min="0" name="price" value={price} placeholder="Price" onChange={this.changeHandler} required />
                                    <br/><br/>
                            </Paper>
                        </Grid>
                        <br/>
                        <Grid item>
                            <Paper elevation={15} className={useStyles.paper}>
                                <br/>
                                <Button style={{width: '200px', marginRight: '50px'}} variant="contained" color="primary"  >Add Image:</Button>

                                <Button style={{width: '300px'}} variant="contained" component="label" >
                                    Upload File
                                    <input type="file" onChange={this.fileHandler} hidden/>
                                </Button>
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

                </Grid>
            </ThemeProvider>
        );
    }
}

export default AddProduct;