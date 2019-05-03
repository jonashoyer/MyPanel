import React, { Component } from 'react';
import {connect} from "react-redux";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import api from "../api";

import {visible} from "../actions/list";
import { Button } from '../../node_modules/@material-ui/core';

import {SetUserSetting} from "../actions/userSettings";

import { MuiThemeProvider, withStyles,withTheme } from '@material-ui/core/styles';


const styles = theme => ({
  item:{
    margin: theme.spacing.unit*2,
    alignSelf: "start"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
})

class Settings extends Component {

  constructor(){
    super();
    this.state = {
      loading:true
    }

    this.handleChange = this.handleChange.bind(this);
    this.submitBetaInvite = this.submitBetaInvite.bind(this);
  }

  componentDidMount(){
    api.lists.getHidden().then(hidden => {
      this.setState({hidden,loading:false});
    });
  }

  onHiddenChange = id => e => {
    const state = e.target.checked;
    this.props.visible(id,!state); 
  }

  handleChange(e){
    this.setState({[e.target.name]:e.target.value});
  }

  submitBetaInvite(){
    this.setState({betaInviteLoading:true});
    api.beta.betaInvite(this.state.betaInvite).then(()=>{
      this.setState({betaInviteLoading:false,betaInvite:""});
    })
  }

  themeHandler = e => {
    this.props.SetUserSetting("theme",e.target.value,true);
  }

  render() {

    const {loading, hidden,betaInvite,betaInviteLoading} = this.state;
    const {list,betaInviter,classes} = this.props;

    let projItems;
    if(hidden && !loading)
      projItems = list.map(e => {return {...e,hidden:false}}).concat(hidden.map(e => {return {...e,hidden:true}}));

    return (
      <div>
        <div className="list-header">
          <h3>Settings</h3>
        </div>
        <div style={{padding:"0 25px 25px",display:"flex"}}>
          
          {betaInviter && <Paper className={classes.item} style={{padding:"15px 30px"}}>
            <Typography variant="title" >
                Beta Invite
            </Typography>
            <TextField
              label="Email"
              name="betaInvite"
              type="email"
              value={betaInvite}
              onChange={this.handleChange}
              margin="normal"
              placeholder="beta@email.com"
              disabled={betaInviteLoading}
            />
            {!betaInviteLoading && <Button style={{display:"block",margin:"auto"}} variant="contained" color="primary" onClick={this.submitBetaInvite}>Add to whitelist</Button>}
          </Paper>}
          
          {!loading && <Paper className={classes.item} style={{maxWidth: 300}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Show
                  </TableCell>
                  <TableCell>
                    Projcet
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                {projItems.map(e => (
                  <TableRow>
                    <TableCell>
                      <Checkbox defaultChecked={!e.hidden} onChange={this.onHiddenChange(e._id)} />
                    </TableCell>
                    <TableCell>
                      {e.name}
                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </Paper>}   
           
          <Paper className={classes.item} style={{padding:"15px 30px"}}>
          
            <Typography variant="title" >
              Theme
            </Typography>

            <FormControl className={classes.formControl}>
              {/* <InputLabel >Theme</InputLabel> */}
              <Select
                value={this.props.theme || "default"}
                onChange={this.themeHandler}
              >
                <MenuItem value="default"> Default </MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="dark pro">Dark Pro</MenuItem>
                <MenuItem value="palenight">Palenight</MenuItem>
              </Select>
            </FormControl>

          </Paper>

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state)=>{
    return {
      list: state.list.lists,
      betaInviter: state.user.betaInviter,
      theme:state.userSettings.settings.theme
    }
}

export default connect(mapStateToProps,{visible,SetUserSetting}) (withStyles(styles) (Settings));
