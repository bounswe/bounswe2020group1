import React, { Component} from 'react';
import Grid from "@material-ui/core/Grid";
import InfoBox from "./InfoBox"


export default class myInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const fields = [
        {key: 'Name',
            value: 'April',
            editable : 'True'},
        {key: 'Surname',
            value: 'Ludgate',
            editable : 'True'},
        {key: 'Username',
            value: 'April04',
            editable : 'True'},
        {key: 'Email',
            value: 'april.ludgate@mail.com',
            editable : 'False'},
        {key: 'Password',
            value: '****',
            editable : 'True'}
        ];
        return(
            <Grid item>
                <div>
                    <InfoBox field={fields[0]}/>
                    <InfoBox field={fields[1]}/>
                    <InfoBox field={fields[2]}/>
                    <InfoBox field={fields[3]}/>
                    <InfoBox field={fields[4]}/>
                </div>
            </Grid>
        )
    }
}
