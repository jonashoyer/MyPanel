import axios from "axios";
import api from "../api";
// import {USER_LOGGED_IN,USER_LOGGED_OUT} from "../types";
// import setAuthHeader from "../utils/setAuthHeader";

// const userLoggedIn = (user) =>({
//     type: USER_LOGGED_IN,
//     user
// });

// const userLoggedOut = () =>({
//     type: USER_LOGGED_OUT
// });

export const addList = data => api.lists.create(data);
    // api.user.login(data).then(user => {
    //     console.log("Token: " + user.token);
    //     localStorage.jwt = user.token;
    //     setAuthHeader(user.token);
    //     dispatch(userLoggedIn(user))
    // });

// export const logout = () => dispatch => {
//     localStorage.removeItem("jwt");
//     setAuthHeader();
//     dispatch(userLoggedOut());
// }

// export const confirm = token => dispatch =>
//   api.user.confirm(token).then(user => {
//     localStorage.jwt = user.token;
//     dispatch(userLoggedIn(user));
// });



// export const signup = data => dispatch =>
//   api.user.signup(data).then(user => {
//     localStorage.jwt = user.token;
//     dispatch(userLoggedIn(user));
// });