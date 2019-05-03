import {TODO_FETCHED, TODO_CREATED,TODO_DELETE,TODO_RENAME, TODO_SET_STATE,TODO_ORDER,TODO_TAG_ADDED, TODO_TAG_REMOVED,TODO_SET_NOTE,ENCRYTION_KEY} from "../types";
import chainlink from "../utils/LinkedList";
import {EncryptionMiddle,DecryptFieldMiddlePhrase} from "../utils/EncryptionMiddle";

export default function lists (state = [], action = {}) {
    switch(action.type){
        case TODO_FETCHED:
            return state.concat([{
                ...action.data,
                data: chainlink(action.data.data)
            }]);
            
        case TODO_CREATED:
            return state.map(e =>{
                if(e.id !== action.data.todo.listId) return e;
                
                return{
                    ...e,
                    data: e.data.concat([action.data.todo])
                }
            })

        case TODO_DELETE:
            return state.map(e=>{
                if(e.id !== action.data.id) return e;

                return{
                    ...e,
                    data: e.data.filter(x=> x._id !== action.data.todoId )
                }
            })

        case TODO_RENAME:
            return state.map(e => {
                if(e.id !== action.data.id) return e;

                return{
                    ...e,
                    data: e.data.map(_e =>{
                        if(_e._id !== action.data.todoId) return _e;

                        return{
                            ..._e,
                            name: action.data.name
                        }
                    })
                }
            })

        case TODO_SET_STATE:
            return state.map(e => {
                if(e.id !== action.data.id) return e;

                return{
                    ...e,
                    data: e.data.map(_e =>{
                        if(_e._id !== action.data.todoId) return _e;

                        return{
                            ..._e,
                            state: action.data.state
                        }
                    })
                }
            })

        case TODO_ORDER:
            let {oldIndex, newIndex, listId} = action.data;
            
            return state.map((e)=>{
                if(e.id !== listId) return e;
                    let arr = e.data;
                    arr.splice(newIndex, 0, arr.splice(oldIndex, 1 )[0]);
                    return {
                        ...e,
                        data: arr.map(e => e)
                    };
                })

        case TODO_TAG_ADDED:
            let {id,tagId,todoId} = action.data;

            return state.map(e=>{
                if(e.id !== id) return e;

                return {
                    ...e,
                    data:e.data.map(_e=>{
                        if(_e._id !== todoId) return _e;

                        return {
                            ..._e,
                            tags: _e.tags.concat([tagId])
                        }
                    })
                }
            })  

        case TODO_TAG_REMOVED:{

            let {id,tagId,todoId} = action.data;

            return state.map(e=>{
                if(e.id !== id) return e;

                return {
                    ...e,
                    data:e.data.map(_e=>{
                        if(_e._id !== todoId) return _e;

                        return {
                            ..._e,
                            tags: _e.tags.filter(ele=>ele !== tagId)
                        }
                    })
                }
            })
        }

        case TODO_SET_NOTE:{
            let {listId,todoId,value} = action.data;

            return state.map( e => {
                if(e.id !== listId) return e;

                return {
                    ...e,
                    data:e.data.map( _e => {
                        if(_e._id !== todoId) return _e;

                        return {
                            ..._e,
                            notes: value
                        }
                    })
                }
            })
        }

        case ENCRYTION_KEY:{
            let {listId,phrase} = action.data;
            if(!phrase) return state;

            return state.map(e => {
                    if(e.id !== listId) return e;
                    return{
                        ...e,
                        data:e.data.map(x => {
                            return DecryptFieldMiddlePhrase(phrase, x,["name","notes"]);
                        })
                    }
                })
            }
        
        default:
            return state;
    }
}

