import axios from "axios";
import api from "../api";
import {PASS_FETCHED,PASS_CREATED,PASS_DELETE,PASS_EDIT,PASS_PHRASE,PASS_ORDER} from "../types";
import {EncryptFieldMiddle, DecryptFieldMiddle} from "../utils/EncryptionMiddle";


const passFetched = data =>({
    type: PASS_FETCHED,
    data 
});

const passCreated = data =>({
    type: PASS_CREATED,
    data
});

const passEdit = data =>({
    type: PASS_EDIT,
    data
});

const passDelete = data =>({
    type: PASS_DELETE,
    data
});

const passPhrase = data =>({
    type: PASS_PHRASE,
    data
});

export const fetchPass = data => dispatch =>{
    api.pass
    .fetch(data)
    .then(lists => {

        let d = {
            ...lists,
            data: lists.data.map(x => {
                return DecryptFieldMiddle(x.listId,x,["name","username","password"]);
            })
        }
        
        dispatch(passFetched(d))
    });
}

export const createPass = (id,title,username,password) => dispatch => {

    let obj = EncryptFieldMiddle(id,{id,title,username,password},["title","username","password"]);
    api.pass.create(obj).then(list => dispatch(passCreated({
        ...list.pass,
        name: title,
        username,
        password
    })));
}

export const editPass = (id,passId,title,username,password) => dispatch => {

    let obj = EncryptFieldMiddle(id,{
        id,
        passId,
        title,
        username,
        password
    },["title","username","password"]);

    api.pass.edit(obj).then(change => dispatch(passEdit({
        ...change,
        title,
        username,
        password
    })));
}

export const deletePass = (id, passId) => dispatch => {
    api.pass.delete(id,passId).then(id => dispatch(passDelete(id)));
}

export const ChangePhrase = (value)=>dispatch=>{
    dispatch(passPhrase(value));
}

export const orderPass = (changes) => dispatch => {
    api.pass.order(changes.api);
    dispatch({type:PASS_ORDER,data:changes.client});
}

// export const FetchEncrytionKey = (id) => dispatch => {
//     api.pass.fetchEncryptionKey(id).then( data => {
//         dispatch({
//             type:PASS_ENCRYTION_KEY,
//             data
//         })
//     })
// }
