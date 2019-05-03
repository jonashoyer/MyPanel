import axios from "axios";
import api from "../api";
import {NOTE_FETCHED,NOTE_CREATE,NOTE_DELETE,NOTE_ORDER,NOTE_UPDATE} from "../types";
import {EncryptFieldMiddle, DecryptFieldMiddle} from "../utils/EncryptionMiddle";



const fetched = data =>({
    type: NOTE_FETCHED,
    data 
});

const created = data =>({
    type: NOTE_CREATE,
    data
});


const _delete = data =>({
    type: NOTE_DELETE,
    data
});

export const fetch = data => dispatch =>{
    api.note
    .fetch(data)
    .then(lists => {
        let data = {
            ...lists,
            data: lists.data.map( x => DecryptFieldMiddle(x.listId,x,["note"]))
        }
        dispatch(fetched(data))
    });
}

export const createNote = (id) => dispatch => {
    api.note.create(id).then(note => dispatch(created(note)));
}

export const deleteNote = (id, noteId) => dispatch => {
    api.note._delete({id,noteId}).then(data => dispatch(_delete(data)));
}

export const setNote = (id, noteId, value) => {
    let obj = EncryptFieldMiddle(id,{id,noteId,value},['value']);
    console.log(obj['value']);
    api.note.setNote(obj);   
}

export const updateNotes = (id,data) => dispatch => {
    dispatch({
        type:NOTE_UPDATE,
        data:{id,data}
    })
}

export const orderNote = (data) => dispatch => {
    // api.todo.order(changes.api);
    api.note.order(data);
    dispatch({
        type:NOTE_ORDER,
        data
    })
}