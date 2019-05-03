import React, { Component } from 'react';
import {connect} from "react-redux";
import {List, ListItem} from '@material-ui/core/List';

import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';

// import Icon from "@material-ui/core/Icon";
// import MoreVertIcon from '@material-ui/core/svg-icons/navigation/more-vert';

import { Link } from "react-router-dom";
import UserHome from "./userHome";

// import image from "../assets/frontpage.png";

import Typography from '@material-ui/core/Typography';

// import {addList} from "./Components/listAction";






const Home = ({isAuthenticated}) => (
  <div>
    {isAuthenticated ? <UserHome /> : <GuestPage />}
  </div>
);

const style = {
  backgroundFront: {
    // backgroundImage:`url(${image})`,
    height: "100vh",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center !important",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "absolute",
    left:0,
    top:0,
    right:0,
    bottom:0,
    zIndex:-1
  },
  item:{
    width:"25%"
  }
}

const GuestPage = () =>(
  <div>
    <div style={{
       top:"50%",
       transform: "translate(0,-50%)",
       position:"absolute",
       left:0,
       right: 0,
       textAlign:"center"
    }}>
      <Typography style={{marginTop:-12,color:"#F73B7D",marginRight:24,textDecoration: "underline"}} variant="headline" gutterBottom>CLOSED TESTING</Typography>
      <Typography style={{marginBottom:6}} variant="display3" gutterBottom>My Panel</Typography>
      <Typography variant="headline" gutterBottom>The project management tool you need!</Typography>
      <div style={{marginTop:36,display:"flex",justifyContent:"center"}}>
        
        <Link to="/signup">
          <a style={{
            border:"2px solid #F73B7D",
            padding:"16px 32px",
            color:"#F73B7D",
            borderRadius:25,
            marginRight:24
          }}>Sign up</a>
        </Link>

        <Link to="/login">
          <a style={{
            border:"2px solid #F73B7D",
            padding:"16px 32px",
            color:"#F73B7D",
            borderRadius:25,
          }}>Login</a>
        </Link>
      </div>
      <div style={{margin:"auto", marginTop:128, display:"flex",justifyContent:"space-around", maxWidth:1000}}>
          <div style={style.item}>
            <Typography variant="headline">Todo</Typography>
            <Typography variant="subheading">Keep a todo list of all task for your project</Typography>
          </div>
          <div style={style.item}>
            <Typography variant="headline">Password</Typography>
            <Typography variant="subheading">Keep all your passwords in one place</Typography>
          </div>
          <div style={style.item}>
            <Typography variant="headline">Sticky note</Typography>
            <Typography variant="subheading">Keep notes for your project</Typography>
          </div>
          <div style={style.item}>
            <Typography variant="headline">Timer</Typography>
            <Typography variant="subheading">Keep track of your time spent on project task</Typography>
          </div>
      </div>
    </div>
    <div style={style.backgroundFront} />
  </div>
);





const mapStateToProps = (state)=>{
  return {
    isAuthenticated: !!state.user.token
  }
}

export default connect(mapStateToProps)(Home);