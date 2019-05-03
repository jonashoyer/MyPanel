import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { BrowserRouter as Router, Route, Switch,Link, Redirect,withRouter} from "react-router-dom";
// import validateInput from "";
import {connect} from "react-redux";
import {login} from "../actions/auth";
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
import {loginAuth,signup} from "../actions/auth";

import {fetchLists} from "../actions/list"
import {fetchActiveTime} from "../actions/time";

const tabStyle = {
    margin: "auto"
}

class Form extends Component{
    constructor(props) {
        super(props);
        this.state = {
          slideIndex: this.props.location.pathname === "/signup" ? 1 : 0,
        };
      }

      handleChange = (value) => {
        this.setState({
          slideIndex: value,
        });
      };
      
    submitLogin = data =>
        this.props.loginAuth(data).then( () => {this.fetchUserData(); setTimeout(()=>this.props.history.push("/"), 250)} );

    submitSignup = data =>
        this.props.signup(data).then( () => {this.fetchUserData(); setTimeout(()=>this.props.history.push("/"), 250)} );

    fetchUserData = () =>{
        const {fetchLists,fetchActiveTime} = this.props;
        fetchLists();
        fetchActiveTime();
    }

    render() {
        return (
            <Paper zDepth={2} style={{padding:1,maxWidth: 450,margin: "auto", marginTop:"20vh"}}>
                <SwipeableViews
                index={this.state.slideIndex}
                onChangeIndex={this.handleChange}
                >
                    <div style={tabStyle}>
                    
                        <Login login={this.submitLogin} />
                        <Button variant="flat" style={{display:"block",margin:"24px auto"}} onClick={()=>this.handleChange(1)} >
                            Create Account
                        </Button>
                        
                    </div>
                    <div style={tabStyle}>

                        <Signup signup={this.submitSignup}/>
                        <Button variant="flat" style={{display:"block",margin:"24px auto"}} onClick={()=>this.handleChange(0)} >
                        Back to Login
                        </Button>

                    </div>
                </SwipeableViews>
            </Paper>
        );
    }
}

export default withRouter(connect(null,{loginAuth,signup,fetchLists,fetchActiveTime})(Form));

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: "",
            password:"",
            errors:{},
            isLoading: false
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        
    }

    validate(){
        const err = {};
        if(!this.state.email) err.email = "Can't be blank";
        if(!this.state.password) err.password = "Can't be blank";
        return err;
    }

    onSubmit = (e)=>{
        e.preventDefault();
        const errors = this.validate();
        this.setState({errors});

        if(Object.keys(errors).length === 0){
            this.props.login(this.state).catch((err) => {this.setState({errors: err.response ? err.response.data.errors : "Error", isLoading: false})});
        }
    }

    onChange = (e)=>{
        this.setState({[e.target.name]: e.target.value});
    }

  render() {
      const {errors, email, password, isLoading} = this.state;

    if(this.state.redircetToReferrer === true){
        return(<Redirect to={(this.props.location || {from: {pathname:"/" } } ) } />);
    }

    return (
        <div className="login-content">
            <h3>My Panel Login</h3>
            <p className="error-text">{this.state.errors.global}</p>
            <form id="login-form" onSubmit={this.onSubmit}>

                <TextField
                name="email"
                style={{display:"block",margin:"auto"}}
                label="Email"
                type="email" 
                value={email}
                fullWidth
                errorText={errors.email}
                onChange={this.onChange}
                />
                
                <TextField
                name="password"
                style={{display:"block",margin:"auto",marginTop:15}}
                label="Password"
                type="password" 
                fullWidth
                value={password}
                errorText={errors.password}
                onChange={this.onChange}
                />          
                <Button variant="raised" type="submit" value="Submit" form="login-form" color="primary" style={{margin:"24px auto",display:"block"}} disabled={isLoading} >
                    Login
                </Button>    
            </form>
        </div>

    );
  }
}

class Signup extends Component {

    constructor(props){
        super(props);
        this.state={
            name: "",
            email:"",
            password:"",
            secpassword:"",
            errors:{},
            isLoading: false
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        
    }

    validate(){
        const err = {};
        if(!this.state.name) err.name = "Can't be blank";
        if(!this.state.password) err.password = "Can't be blank";
        if(this.state.password !== this.state.secpassword) err.password = "Passwords don't match";
        return err;
    }

    onSubmit(e){
        e.preventDefault();
        const errors = this.validate();
        this.setState({errors});

        if(Object.keys(errors).length === 0){
            this.props.signup(this.state).catch((err) => {this.setState({errors:err.response.data.errors, isLoading: false});});
        }
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value});
    }

  render() {
      const {errors, name, email, password, secpassword, isLoading} = this.state;

    if(this.state.redircetToReferrer == true){
        return(<Redirect to={(this.props.location || {from: {pathname:"/" } } ) } />);
    }
    return (

        <div className="login-content">
            <h3>Create account</h3>
            <p className="error-text">{this.state.errors.global}</p>
            <form id="create-form" onSubmit={this.onSubmit}>

            <TextField
            name="name"
            style={{display:"block",margin:"auto"}}
            label="Name"
            value={name}
            fullWidth
            error={errors.name}
            onChange={this.onChange}
            />

            <TextField
            name="email"
            style={{display:"block",margin:"auto", marginTop:15}}
            label="Email"
            type="email"
            value={email}
            fullWidth
            error={errors.email}
            onChange={this.onChange}
            />
            
            <TextField
            name="password"
            style={{display:"block",margin:"auto", marginTop:15}}
            label="Password"
            type="password" 
            value={password}
            fullWidth
            error={errors.password}
            onChange={this.onChange}
            />      

            <TextField
            name="secpassword"
            style={{display:"block",margin:"auto", marginTop:15}}
            label="Confirm Password"
            fullWidth
            type="password" 
            value={secpassword}
            error={errors.password}
            onChange={this.onChange}
            />           

            <Button variant="raised" type="submit" form="create-form" color="primary" style={{margin:"24px auto",display:"block"}} disabled={isLoading} > 
            Create account
            </Button>   
            </form>
        </div>

    );
  }
}


// Login.prototype = {
//     login: React.prototype.func.isRequired
// }

// Login.contextTypes={
//     router:React.prototype.object.isRequired
// }