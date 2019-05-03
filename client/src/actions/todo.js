import axios from "axios";
import api from "../api";
import {TODO_FETCHED,TODO_CREATED,TODO_SET_STATE,TODO_DELETE,TODO_RENAME,TODO_ORDER,TODO_TAG_ADDED,TODO_TAG_REMOVED,TODO_SET_NOTE} from "../types";
import {EncryptFieldMiddle, DecryptFieldMiddle} from "../utils/EncryptionMiddle";


const todoFetched = data =>({
    type: TODO_FETCHED,
    data 
});

const todoCreated = data =>({
    type: TODO_CREATED,
    data
});

const todoSetState = data =>({
    type: TODO_SET_STATE,
    data
});

const todoDelete = data =>({
    type: TODO_DELETE,
    data
});

const todoRename = data =>({
    type: TODO_RENAME,
    data
});

const todoOrder = data =>({
    type: TODO_ORDER,
    data
});


export const fetchTodo = data => dispatch =>{
    api.todo
    .fetch(data)
    .then(lists => dispatch(todoFetched({
        ...lists,
        data: lists.data.map(x =>
            DecryptFieldMiddle(x.listId,x,["name","notes"]))
    })));
}

export const setTodoState = (id,todoId,value) => dispatch => {
    api.todo.setState(id,todoId,value).then(list => dispatch(todoSetState(list)));
}

export const createTodo = (id,name,parentId=undefined) => dispatch => {
    let obj = EncryptFieldMiddle(id,{id,name,parentId},["name"]);
    api.todo.create(obj).then((list) => dispatch(todoCreated({todo:{...list.todo,name}})));
}

export const deleteTodo = (id, todoId) => dispatch => {
    api.todo.delete(id,todoId).then(id => dispatch(todoDelete(id)));
}

export const renameTodo = (id,todoId,value) => dispatch =>{
    let obj = EncryptFieldMiddle(id,{id,todoId,value},["value"]);
    api.todo.rename(obj).then(change => dispatch(todoRename({...change,name:value})));
}

// export const getNote = (listId, todoId) =>{
//     api.todo.fetchNote(listId, todoId).then(v => {return v});
// }

export const setNote = (id, todoId, value) => dispatch =>{

    let obj = EncryptFieldMiddle(id,{id,todoId,value},["value"]);

    api.todo.setNote(obj).then();
    dispatch({
        type: TODO_SET_NOTE,
        data: {id,todoId,value}
    })
}

export const orderTodo = (changes) => dispatch => {
    api.todo.order(changes.api);
    
    if(changes.client){
        dispatch(todoOrder(changes.client));
    }
}

export const addTagTodo = (id, todoId, tagId) => dispatch => {

    const data = {id,todoId,tagId};
    api.todo.addTag(data);
    
    dispatch({
        type: TODO_TAG_ADDED,
        data
    });
} 

export const removeTagTodo = (id,todoId,tagId) => dispatch =>{

    const data = {id,todoId,tagId};
    api.todo.removeTag(data);

    dispatch({
        type:TODO_TAG_REMOVED,
        data
    });
}