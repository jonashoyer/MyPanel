import axios from "axios";
import api from "../api";
import {ADD_USER,OVERVIEW_FETCHED,REMOVE_USER} from "../types";

const fetched = data => ({
    type:OVERVIEW_FETCHED,
    data
})

const userAdded = data =>({
    type: ADD_USER,
    data 
});

const userRemoved = data =>({
    type:REMOVE_USER,
    data
})

export const fetch = (id) => dispatch =>{
    api.overview.fetch(id)
    .then(res => dispatch(fetched(res)));
}

export const addUser = (id,userId,setDialog) => dispatch => {
    api.lists
    .addUser({id,userId})
    .then((res)=>{
        // setDialog("USERS_ADDED",res.userAdded);
        dispatch(userAdded(res));
    })
}

export const removeUser = (id,userId) => dispatch =>{
    api.lists.removeUser({id,userId})
    .then(res => dispatch(userRemoved(res)))
}