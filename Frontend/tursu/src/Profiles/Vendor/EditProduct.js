import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Navbar from "../../NavBar";
import Axios from "axios";
import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import InputAdornment from '@material-ui/core/InputAdornment';




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

let token;
token = window.sessionStorage.getItem("authToken")

class EditProduct extends React.Component{
    constructor(props) {
        super(props)
        console.log("id is " , props.id)


        this.state = {
            pCategory: '',
            pName: '',
            pDescription: '',
            pBrand: '',
            pStock: '',
            pPrice: '',
            id: 0,
            category: '',
            name: '',
            description: '',
            brand: '',
            stock: '',
            price: '',
            Image: '',
        }

    }


    componentDidMount() {
        axios.get(`http://3.232.20.250/product/`, {

            params: {
                id: this.props.id
            }
        }).then(res =>{
            console.log("res is: ", res)
            this.setState({pCategory: res.data.category});
            this.setState({pName: res.data.name});
            this.setState({pDescription: res.data.description})
            this.setState({pBrand: res.data.brand})
            this.setState({pStock: res.data.stock})
            this.setState({pPrice: res.data.price})

            console.log("category is: ", this.state.pCategory)
            console.log("name is: ", this.state.pName)

        }).catch((error) => {
            alert(error)
        })

    }



    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
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
        const formData = new FormData();
        e.preventDefault()
        formData.append("id", this.props.id);
        if(this.state.category !== '' ) formData.append("category", this.state.category);
        if(this.state.name !== '' ) formData.append("name", this.state.name);
        if(this.state.description !== '' ) formData.append("description", this.state.description);
        if(this.state.brand !== '' ) formData.append("brand", this.state.brand);
        if(this.state.stock !== 0 ) formData.append("stock", this.state.stock);
        if(this.state.price !== 0 ) formData.append("price", this.state.price);
        if(this.state.Image !== '' ) formData.append("photo", this.state.Image);

        axios
            .post("http://3.232.20.250/product/edit/", formData, {
                headers: {
                    'Authorization': "Token " + token //the token is a variable which holds the token
                },
            }).then((response) => {

            if (response.status === 200) {
                alert("Product edited!");
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
        const { id, category, name, description, brand, stock, price } = this.state
        return(
            <ThemeProvider theme={theme} >
                <Grid item>
                    <form style={{width: '600px' }} onSubmit={this.submitHandler}>
                        <Grid item xs={12}>
                            <Paper elevation={15} className={useStyles.paper}>
                                <br/>
                                <Button style={{width: '200px', marginRight: '50px'}} variant="contained" color="primary"  >Category:</Button>
                                <Input style={{width: '300px'}} type="text" name="category"  value={category} placeholder={this.state.pCategory} onChange={this.changeHandler} />
                                <br/><br/>
                            </Paper>
                        </Grid>
                        <br/>
                        <Grid item>
                            <Paper elevation={15} className={useStyles.paper}>
                                <br/>
                                <Button style={{width: '200px', marginRight: '50px'}} variant="contained" color="primary"  >Name:</Button>
                                <Input style={{width: '300px'}} type="text" name="name"  value={name} placeholder={this.state.pName} onChange={this.changeHandler} />
                                <br/><br/>
                            </Paper>
                        </Grid>
                        <br/>
                        <Grid item>
                            <Paper  elevation={15} className={useStyles.paper}>
                                <br/>
                                <Button style={{width: '200px', marginRight: '50px', marginTop: '20px'}} variant="contained" color="primary"  >Description:</Button>
                                <Input style={{width: '300px'}} type="text" name="description"  multiline='true' rows='3' value={description} placeholder={this.state.pDescription} onChange={this.changeHandler} />
                                <br/><br/>
                            </Paper>
                        </Grid>
                        <br/>
                        <Grid item>
                            <Paper elevation={15} className={useStyles.paper}>
                                <br/>
                                <Button style={{width: '200px', marginRight: '50px'}} variant="contained" color="primary"  >Brand:</Button>
                                <Input style={{width: '300px'}} type="text" name="brand" value={brand} placeholder={this.state.pBrand} onChange={this.changeHandler} />
                                <br/><br/>
                            </Paper>
                        </Grid>
                        <br/>
                        <Grid item>
                            <Paper elevation={15} className={useStyles.paper}>
                                <br/>
                                <Button style={{width: '200px', marginRight: '50px'}} variant="contained" color="primary" >Stock:</Button>
                                <Input  style={{width: '300px'}} type="number" step="1" min="0" name="stock" value={stock} placeholder={this.state.pStock} onChange={this.changeHandler} />
                                <br/><br/>
                            </Paper>
                        </Grid>
                        <br/>
                        <Grid item>
                            <Paper elevation={15} className={useStyles.paper}>
                                <br/>
                                <Button style={{width: '200px', marginRight: '50px'}} variant="contained" color="primary"  >Price:</Button>
                                <Input style={{width: '300px'}} startAdornment={<InputAdornment position="start">₺</InputAdornment>} type="number" step="0.01" min="0" name="price" value={price} placeholder={this.state.pPrice} onChange={this.changeHandler} />
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
                                    <input type="file" hidden/>
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

export default EditProduct;