import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import {Button, Typography} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {palette} from "@material-ui/system";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from "@material-ui/core/Menu";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import { Alert } from '@material-ui/lab';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from "@material-ui/core/Snackbar";
import {unmountComponentAtNode} from "react-dom";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        // backgroundColor: "#388e3c",
        height: 300,
        width: 220
    },
}));


export default function ProductBox(props) {

    const classes = useStyles()

    const handleClickOnOptionsIcon = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    return(
        <Grid item xs={3}>
            <Link to={`/product/${props.product.id}`}>
                <Button variant="contained">
                    <Paper className={classes.paper}>
                        <div className="ProductInfo" >
                            <img
                                src={props.product.photo_url}
                                alt={props.product.name}
                                className="responsiveImage"/>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'nowrap',
                                justifyContent: 'center',
                                marginLeft: '50px',
                                paddingTop: 10
                            }}>
                                <text>
                                    <div style={{
                                        height: "75px",
                                        alignText: "center",
                                        width: "150px"
                                    }}>
                                        <br/>
                                        <Typography variant="subtitle2">
                                            {props.product.name}
                                        </Typography>
                                        <br/>
                                    </div>
                                    <div style={{
                                        position: "absolute",
                                        left: "38%",
                                        top: "260px",
                                    }}>
                                        <Typography variant="body2">
                                            <Box fontWeight="fontWeightBold">
                                                {props.product.price} ₺
                                            </Box>
                                        </Typography>
                                        <Typography variant="caption">
                                            {props.product.vendor_name}
                                        </Typography>
                                    </div>
                                </text>
                                <div onClick={handleClickOnOptionsIcon}>
                                    {LongMenu(props)}
                                </div>
                            </div>
                        </div>
                    </Paper>
                </Button>
            </Link>
        </Grid>
    );
}

function LongMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isListOpen, SetIsListOpen]  = React.useState(false);
    const [isAlertOpen, SetIsAlertOpen]  = React.useState(false);
    // const [selectedValue, setSelectedValue] = React.useState();

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const addToShoppingCart = () => {
        handleClose()

        console.log(props.product.id)
        const formData = new FormData();
        formData.append("product_id", props.product.id);
        console.log("Token " + window.sessionStorage.getItem("authToken"))
        axios.post('http://3.232.20.250/shoppingcart/add',
            formData, {
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            })
            .then(res => {
                console.log(res);
                console.log(res.status);
                if(res.status === 200){
                    // alert("Product is successfully added to the shopping cart.");
                    SetIsAlertOpen(true);
                    // <Alert severity="success">This is a success alert — check it out!</Alert>
                }
            })
            .catch(error =>{
                console.log(error)
                alert ("There has been an error. Please try again.");
            })
    }

    const addToShoppingList = () => {
        SetIsListOpen(true);
    }

    const handleListsClose = () => {
        SetIsListOpen(false)
    }

    const handleAlertClose = () => {
        SetIsAlertOpen(false)
    }

    return (
        <div>
            <IconButton
                onClick={handleClick}
                name="optionsButton"
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        marginTop: 40,
                        maxHeight: 45 * 4.5,
                        width: '30ch',
                    },
                }}
            >
                <Tooltip title={window.sessionStorage.getItem("isLogged") ?"" : "You need to login."}
                         placement={"top"}>
                    <span>
                        <MenuItem onClick={addToShoppingCart}
                                  disabled={!window.sessionStorage.getItem("isLogged")}>
                            <ListItemIcon>
                                <ShoppingCartIcon> </ShoppingCartIcon>
                            </ListItemIcon>
                            <Typography>Add to Shopping Cart</Typography>
                        </MenuItem>
                    </span>
                </Tooltip>
                <Tooltip title={window.sessionStorage.getItem("isLogged") ? "":"You need to login."}>
                    <span>
                        <MenuItem onClick={addToShoppingList}
                                  disabled={!window.sessionStorage.getItem("isLogged")}>
                            <ListItemIcon>
                                <PlaylistAddIcon> </PlaylistAddIcon>
                            </ListItemIcon>
                            <Typography>Add to Shopping List</Typography>
                        </MenuItem>
                    </span>
                </Tooltip>
            </Menu>
            {isListOpen? (
                <ListsDialog open={isListOpen} productId={props.product.id} onClose={handleListsClose}/>
            ):(
                <div></div>
            )}
            <Snackbar open={isAlertOpen} autoHideDuration={2000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="success">
                    Product is added to shopping cart.
                </Alert>
            </Snackbar>
        </div>
    );
}

const listsDialogStyles =  makeStyles((theme) => ({
    //style for font size
    textField:{
        fontSize:15
    },
}));

function ListsDialog(props){
    const classes = listsDialogStyles()

    const { open, onClose} = props;
    const [isCreatingNewList, setIsCreatingNewList] = React.useState(false);
    const [lists, setLists] = React.useState([])
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [nameOfNewList, setNameOfNewList] = React.useState("")

    //[list_name, is product in the list]
    const [isInList, setIsInList] = React.useState(new Map())

    //ComponentDidMount
    useEffect(() => {
        console.log("DIDMOUNT")
        if(open && !isLoaded)
        {
            setIsLoaded(true)
            axios.get("http://3.232.20.250/shoppinglist/getlists/",{
                headers: {
                    'Authorization': "Token " + window.sessionStorage.getItem("authToken")
                }
            }).then(res =>{
                setLists(res.data)
                console.log("SHOPPING LISTS:", res.data)
                console.log("SHOPPING LISTS lists:", lists)
                fillIsInList(res.data);
            })
        }
    }, [])


    function fillIsInList(tmpList){
        console.log("Icerideyim.", tmpList.length)
        for(let i=0; i<tmpList.length; i++)
        {
            let productsInShoppingList = [];

            console.log("List name:", tmpList[i])

            const formData = new FormData();
            formData.append("list_name", tmpList[i])

            axios.post("http://3.232.20.250/shoppinglist/products/",
                formData,
                {
                    headers: {
                        'Authorization': "Token " + window.sessionStorage.getItem("authToken")
                    }
                }).then(res => {
                console.log("PRODUCTS IN THE SHOPPING LIST")
                console.log(res.data);
                productsInShoppingList = res.data;

                for(let j=0; j<productsInShoppingList.length; j++){
                    console.log("ID:", productsInShoppingList[j].id)
                    console.log("Self ID:", props.productId)
                    if(props.productId === productsInShoppingList[j].id){
                        setIsInList(new Map(isInList.set(tmpList[i], true)));
                        console.log("UPDATED")
                    }
                }
                if(!isInList.has(tmpList[i])){
                    setIsInList(new Map(isInList.set(tmpList[i], false)));
                    console.log("UPDATED")
                }
                console.log("IsInList", isInList)
            })
        }
    }

    const handleClose = () => {
        setIsCreatingNewList(false)
        setIsLoaded(false)
        onClose();
    };

    // const handleListItemClick = (value) => {
    //     onClose(value);
    // };

    const ChangeStateToCreateNewList = () => {
        setIsCreatingNewList(true);
    }

    const createNewList = () => {

        const formData = new FormData();
        formData.append("list_name", nameOfNewList);
        setNameOfNewList("")

        axios.post("http://3.232.20.250/shoppinglist/createlist/",
            formData, {
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            }
        ).then(res =>{
            console.log("New Shopping list is added:", res)
            setIsCreatingNewList(false)
            setIsLoaded(false)
        }).catch( error => {
                if(error.response){
                    if(error.response.status === 400){
                        alert("A list with the same name already exists.")
                    }
                }
            }
        )
    }

    function handleChangeInNameOfNewList(event){
        setNameOfNewList(event.target.value)
    }

    function handleCheckboxChange(event){
        console.log("YETER", event.target.checked)
        if(event.target.checked){
            addProductToList(event.target.name)
            setIsInList(new Map(isInList.set(event.target.name, true)))
        }
        else{
            removeProductFromList(event.target.name)
            setIsInList(new Map(isInList.set(event.target.name, false)))
        }
        event.stopPropagation(event.target.name)
    }

    function addProductToList(listName){
        const formData = new FormData();
        formData.append("list_name", listName);
        formData.append("product_id", props.productId);

        axios.post('http://3.232.20.250/shoppinglist/addtolist/',
            formData, {
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            })
            .then(res => {
                console.log(res);
                console.log(res.status);
            })
            .catch(error =>{
                console.log(error)
            })
    }

    function removeProductFromList(listName){
        const formData = new FormData();
        formData.append("list_name", listName);
        formData.append("product_id", props.productId);

        console.log("Deleting the product from the list.")
        axios.post('http://3.232.20.250/shoppinglist/deletefromlist/',
            formData, {
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            })
            .then(res => {
                console.log(res);
                console.log(res.status);
            })
            .catch(error =>{
                console.log(error)
            })
    }

    let temp = true
    return (
        <Dialog open={open} onClose={handleClose}>
            <div style={{
                display: "flex",
                flexWrap: 'nowrap',
                justifyContent: 'space-around',
                height: "auto",
                width: "200px",

            }}>
                <DialogTitle>
                    <Typography>Save to:</Typography>
                </DialogTitle>
                <IconButton onClick={handleClose}>
                    <CloseIcon/>
                </IconButton>
            </div>
            <Divider/>
            <List>
                {lists.map((shoppingListName) => (
                  <ListItem>
                      {temp = isInList.get(shoppingListName)}
                      <Checkbox checked={temp}
                                onClick={handleCheckboxChange}
                                name={shoppingListName.toString()}/>
                      {console.log("RERENsDERD")}
                      {console.log(temp)}
                      <Typography variant={"body2"}>{shoppingListName.toString()}</Typography>
                  </ListItem>
                ))}
            </List>
            <Divider/>
            {isCreatingNewList ? (
                <div style={{
                    marginLeft: "15px",
                    marginTop: "10px"
                }}>
                    <List>
                        <ListItem>
                            <Typography variant={"body2"}>Name</Typography>
                        </ListItem>
                        <ListItem>
                            <TextField style={{
                                marginTop: "-5px",
                                marginBottom: "15px",
                                width:"130px",
                                paddingRight:"10px"}}
                                       placeholder={"Enter list name..."}
                               InputProps={{
                                   classes: {
                                       input: classes.textField,
                                   },
                               }}
                                value={nameOfNewList}
                                onChange={handleChangeInNameOfNewList}
                            />
                        </ListItem>
                        <ListItem>
                            <Button variant={"outlined"}
                                    onClick={createNewList}
                                    size={"small"}
                                    style={{
                                       position: "absolute",
                                       right: 25,
                                       marginBottom: 10,
                                    }}
                            >
                                <Typography style={{fontSize: 12}}>Create</Typography>
                            </Button>
                        </ListItem>
                    </List>
                </div>
            ) : (
                <Button style={{textTransform: "none"}} onClick={ChangeStateToCreateNewList}>
                    <div style={{
                        padding: "5px",
                        paddingLeft: "20px",
                        paddingRight: "30px",
                        display: "flex",
                        flexWrap: "nowrap",
                        alignItems: "center"
                    }}>
                        <AddIcon color={"action"} style={{paddingRight:"5px"}}/>
                        <Typography variant={"body2"}>Create a new list</Typography>
                    </div>
                </Button>
            )}
        </Dialog>
    )
}

const horizontalStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper:{
        marginLeft: 100,
        marginTop: 50,
        marginBottom: 1,
        width: 700,
    },
    grid: {
        paddingLeft: theme.spacing(1),
        width: "100%",
        height: 110,
        justifyContent: "space-between"
    },
    imageContainer: {
        width: 128,
        height: 128,
    },
    image: {
        width: "50%",
        height: "auto",
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
    productCountBox: {
        width: 45,
        height: 64,
    },
    productCountNumber:{
        // marginBottom: 10
    },
    marginInsideGrid: {
        marginBottom:  20,
    }
}));

export function ProductBoxHorizontal(props) {
    const classes = horizontalStyles()
    const [count, setCount] = React.useState(props.quantity);
    const [render, setRender] = React.useState(true)

    function handleDelete(){
        console.log("Product ID:", props.product.id);
        console.log("Token: " + window.sessionStorage.getItem("authToken"))

        const formData = new FormData();
        formData.append("product_id", props.product.id);

        axios.post('http://3.232.20.250/shoppingcart/delete',
            formData,{
                headers: {
                    'Authorization': "Token " + window.sessionStorage.getItem("authToken"),
                }
            })
            .then(res => {
                console.log(res);
                console.log(res.status);
                props.onCountChange(-count, props.product.price);
                setRender(false);
            })
            .catch(error =>{
                console.log(error.response)
                console.log(error.response.request.response)
                console.log(error.request)
                console.log(error.message)
                alert ("There has been an error. Please try again.");
            })

    }

    function handleCountChange(change){
        const newCount = Math.max(count + change, 0);
        setCount(newCount);

        if(count <= 0 && change < 0)
        {
            //TODO: Delete items when its quantity is set to zero.
            return;
        }

        console.log("Product Id", props.product.id)
        console.log("Token " + window.sessionStorage.getItem("authToken"))

        const formData = new FormData();
        formData.append("product_id", props.product.id);
        formData.append("quantity", newCount.toString());

        axios.post('http://3.232.20.250/shoppingcart/add',
            formData, {
                headers: {
                    'Authorization' : "Token " + window.sessionStorage.getItem("authToken")
                }
            })
            .then(res => {
                console.log(res);
                console.log(res.status);
            })
            .catch(error =>{
                console.log(error)
            })

        props.onCountChange(change, props.product.price);
    }

    if(render === false)
    {
        return null;
    }
    return(
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={5}>
                <Grid container item className={classes.grid} alignItems="center" spacing={4}>
                    <Grid item className={classes.imageContainer}>
                        <img
                            src={props.product.photo_url}
                            //src="https://grandstream.pl/wp-content/uploads/2016/03/left-e1456834177965.png"
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
                            {props.product.vendor_name}
                        </Typography>
                    </Grid>
                    <Grid item className={classes.marginInsideGrid}>
                        <ButtonGroup orientation={"vertical"} size={"small"}>
                            <IconButton
                                aria-label="increase"
                                onClick={() => {
                                    handleCountChange(1)
                                }}
                                variant
                            >
                                <AddIcon fontSize="small"/>
                            </IconButton>
                            <Typography className={classes.productCountNumber}>
                                <Box fontWeight="fontWeightBold">
                                    {count}
                                </Box>
                            </Typography>
                            {count<=1 ? (
                                <div/>
                            ) : (
                                <IconButton
                                    aria-label="reduce"
                                    onClick={() => {
                                        handleCountChange(-1)
                                    }}
                                >
                                    <RemoveIcon fontSize="small"/>
                                </IconButton>
                            )}
                        </ButtonGroup>
                    </Grid>
                    <Grid className={classes.marginInsideGrid}>
                        <IconButton size="small">
                            <DeleteOutlineIcon color="error" onClick={handleDelete}/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

