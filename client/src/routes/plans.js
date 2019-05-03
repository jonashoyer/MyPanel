import React, { Component } from 'react';
import {connect} from "react-redux";
import {List, ListItem} from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';


const Plans = () => (
    <div>
        <PlanItem title="Premium" subtitle="Get extra features!" info={'Get My Panel Premium for $9/month! \n - Get extra feature!'} color="#505050"/>
        <PlanItem title="Free" subtitle="Why pay?" info={'Get My Panel for $0! \n - Get all '} color="#02bcd4"/>
    </div>
);

class PlanItem extends Component{
    // constructor(props){
    //     super(props);
    // }

    render(){
        return(
            <Paper zDepth={2} className="plan-card">
                <div className="plan-card-header" style={{backgroundColor:this.props.color}}>
                    <h3>{this.props.title}</h3>
                    <h4>{this.props.subtitle}</h4>
                </div>
                <div className="plan-card-content">
                    <p>{this.props.info}</p>
                    <Button variant="fab" label={"Upgrade to "+this.props.title} backgroundColor={this.props.color} labelColor="white" />
                </div>
            </Paper>
        );
    }
}

export default Plans;
