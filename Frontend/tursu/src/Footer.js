import React from "react"
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";


const footerStyles = makeStyles((theme)=>({
    root:{
        backgroundColor: "#388e3c",
        width: "100%",
        height: "220px",
    },
    gridStructure:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: "40px",
        marginTop: "50px"
    },
    logo: {
        height: theme.spacing(13),
        width: theme.spacing(13),
    }
}))


/**
 * @brief It is used instead of the standard Typography component.
 */
const CustomTypography = withStyles({
    root: {
        color: "#f5f8f5"
    }
})(Typography);


/**
 * @brief The footer of the application.
 *        It is placed at the bottom of every page.
 */
export default function Footer(props){
    const classes = footerStyles()

    return(
        <div className={classes.root}>
            <Grid list className={classes.gridStructure}>
                <Grid item>
                    <img src="https://raw.githubusercontent.com/bounswe/bounswe2020group1/master/images/logo.PNG"
                         alt="logo"
                         className={classes.logo}/>
                     <CustomTypography variant="caption">
                         <br/>
                         All right reserved.<br/>
                         Copyright © Tursu
                     </CustomTypography>
                </Grid>
                <Grid item>
                    <CustomTypography variant="h5">
                        About Us!
                    </CustomTypography>
                    <CustomTypography>
                        It is a school project that is developed for <br/>
                        CMPE 352 & 451 courses, at Bogazici University.
                    </CustomTypography>
                </Grid>
            </Grid>
        </div>
    );
}
