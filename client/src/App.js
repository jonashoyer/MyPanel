import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, withStyles,withTheme } from '@material-ui/core/styles';
import {connect} from "react-redux";


import { BrowserRouter as Router, Route, Switch,Link, Redirect} from "react-router-dom";
import SideBar from "./sidebar";
import './styles/App.scss';

import home from "./routes/home";
import todo  from "./routes/todo";
import note from "./routes/note";
import passwords  from "./routes/passwords";
import timers  from "./routes/timers";
import settings from "./routes/settings";
import login from "./routes/login";
import plans from "./routes/plans";
import ovTimer from "./routes/overviews/timer";
import overview from "./routes/overview";
import projSettings from "./routes/projectSettings";

import PrivateRoute from "./routes/types/PrivateRoute";

import themes from "./Components/Themes";


const App = ({location,themeName,theme}) => (
  <MuiThemeProvider theme={themes(themeName)} style={{color:theme.palette.text.primary}}>
    <SideBar>
      <Switch>
          <Route exact location={location} path="/" component={home} />

          <PrivateRoute exact location={location} path="/project/:id/overview" component={overview} />

          <PrivateRoute exact location={location} path="/project/:id/todo" component={todo} />
          <PrivateRoute exact location={location} path="/project/:id/sticky-notes" component={note} />
          <PrivateRoute exact location={location} path="/project/:id/passwords" component={passwords} />

          <PrivateRoute exact location={location} path="/project/:id/timers" component={timers}/>
          <PrivateRoute exact location={location} path="/project/:id/settings" component={projSettings} />      

          <PrivateRoute exact location={location} path="/user/overview" component={ovTimer} />
          <PrivateRoute exact location={location} path="/settings" component={settings} />      

          <Route exact location={location} path="/login" component={login} />
          <Route exact location={location} path="/signup" component={login} />

          <Route exact location={location} path="/plans" component={plans} />                    
      </Switch>    
    </SideBar>
  </MuiThemeProvider>
)

const mapStateToProps = (state)=>{
  return {
      themeName: state.userSettings.settings.theme
  }
}

export default connect(mapStateToProps) (withTheme() (App));