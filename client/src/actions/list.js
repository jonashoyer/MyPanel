import axios from "axios";
import api from "../api";
import {SELECTED_LIST_CHANGED, LISTS_FETCHED,LIST_CREATED,LIST_DELETE,LIST_RENAME,LIST_ORDER,LIST_VISIBLE,ENCRYTION_KEY} from "../types";


const selectedListChanged = (index) => ({
    type: SELECTED_LIST_CHANGED,
    index
});

const listsFetched = data =>({
    type: LISTS_FETCHED,
    data 
});

const listCreated = data =>({
    type: LIST_CREATED,
    data
});

const ListDelete = data =>({
    type: LIST_DELETE,
    data
});

const ListRename = data =>({
    type: LIST_RENAME,
    data
});

const ListOrder = data =>({
    type: LIST_ORDER,
    data
});

export const changeListSelect = (index) => dispatch=>{
    localStorage.listSelected = index;
    dispatch(selectedListChanged(index));
}

export const fetchLists = () => dispatch =>{
    api.lists
    .fetchAll()
    .then(lists => dispatch(listsFetched(lists)));
}

export const createList = data => dispatch => {
    api.lists.create(data).then(list => dispatch(listCreated(list)));
}

export const deleteList = data => dispatch => {
    api.lists.delete(data).then(id => dispatch(ListDelete(id)));
}

export const renameList = (id,value) => dispatch =>{
    api.lists.rename(id,value).then(change => dispatch(ListRename(change)));
}

export const orderList = (changes) => dispatch => {
    api.lists.order(changes.api);
    dispatch(ListOrder(changes.client));
}

export const visible = (id,state) => dispatch => {
    api.lists.setVisibility(id,state).then(data =>{
        dispatch({
            type:LIST_VISIBLE,
            data
        })
    })
}



export const CreateEncrytionKey = (id, key) => dispatch => {
    api.lists.createEncrytionKey(id,key).then( data => {
        dispatch({
            type:ENCRYTION_KEY,
            data
        })
    })
}

export const ConfirmeEncryptionKey = data => dispatch => {
    api.lists.confirmeEncryptionKey(data.listId,data.key).then( data => {
        // dispatch({

        // })
    })
}

export const RemoveEncryptionKey = data => dispatch => {
    api.lists.removeEncryptionKey(data.listId,data.key).then( data => {
        dispatch({
            type: ENCRYTION_KEY,
            data
        })
    })
} 


export const UnlockEncryptionKey = data => dispatch => {
    dispatch({
        type: ENCRYTION_KEY,
        data
    })
}