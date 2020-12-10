import React, { Component} from 'react';
import Grid from "@material-ui/core/Grid";


export default class myInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
            return(
                <Grid item>
                    <div>
                        <a>My Info</a> <br/>
                        <a>My Info</a> <br/>
                        <a>My Info</a> <br/><a>My Info</a> <br/><a>My Info</a> <br/><a>My Info</a> <br/><a>My Info</a> <br/><a>My Info</a> <br/>

                    </div>
                </Grid>
            )
    }
}
