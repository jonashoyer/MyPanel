import React, {Component} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import {changeListSelect} from "../../actions/list";

const PrivateRoute = ({ isAuthenticated, component: Component, ...rest }) => (
  <Route
    {...rest}
    render = {props =>
      isAuthenticated ? <Wrap props={props} Component={Component} /> : <Redirect to="/" />}
  />
);


const wrap = ({Component,props,changeListSelect}) =>{
  
  const {id} = props.match.params;
  if(id && id !== props.selected){
    changeListSelect(id);
    const path = props.match.path.split('/')[3];
    // props.history.push("/project/"+id+"/"+path);
  }
  
  return <Component {...props} />
}

const Wrap = connect(null,{changeListSelect}) (wrap);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.user.token,
    selected: state.list.index
  };
}

export default connect(mapStateToProps)(PrivateRoute);