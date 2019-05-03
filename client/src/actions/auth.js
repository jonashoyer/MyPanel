import axios from "axios";
import api from "../api";
import {USER_LOGGED_IN,USER_LOGGED_OUT} from "../types";
import setAuthHeader from "../utils/setAuthHeader";

export const userLoggedIn = (user) =>({
    type: USER_LOGGED_IN,
    user
});

export const userLoggedOut = () =>({
    type: USER_LOGGED_OUT
});

export const loginAuth = data => dispatch =>
    api.user.login(data).then(user => {
        localStorage.jwt = user.token;
        setAuthHeader(user.token);
        dispatch(userLoggedIn(user));
    });

export const logout = () => dispatch => {
    localStorage.removeItem("jwt");
    setAuthHeader();
    dispatch(userLoggedOut());
}

export const confirm = token => dispatch =>
  api.user.confirm(token).then(user => {
    localStorage.jwt = user.token;
    dispatch(userLoggedIn(user));
});

export const signup = data => dispatch =>
  api.user.signup(data).then(user => {
    localStorage.jwt = user.token;
    dispatch(userLoggedIn(user));
});