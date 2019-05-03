import {NOTE_FETCHED, NOTE_CREATE,NOTE_DELETE,NOTE_ORDER,NOTE_UPDATE,ENCRYTION_KEY} from "../types";
import {EncryptionMiddle,DecryptFieldMiddlePhrase} from "../utils/EncryptionMiddle";

export default function lists (state = [], action = {}) {
    switch(action.type){
        case NOTE_FETCHED:
            
            return state.concat([{id: action.data.id,data:action.data.data}])
            
        case NOTE_CREATE:

            return  state.map((e)=>{
                    if(e.id !== action.data.listId) return e;

                    return{
                        ...e,
                        data: e.data.concat([action.data])
                    }
                })

        case NOTE_DELETE:
            return state.map((ele)=>{
                    if(ele.id !== action.data.id) return ele;

                    return{
                        ...ele,
                        data: ele.data.filter(e =>e._id !== action.data.noteId)
                    }
                })
        case NOTE_ORDER:
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

        case NOTE_UPDATE:

                return state.map(e =>{
                        if(e.id !== action.data.id) return e;

                        return {
                            ...e,
                            data: e.data.map(_e => {
                                if(!action.data.data[_e._id]) return _e;

                                return{
                                    ..._e,
                                    note: action.data.data[_e._id]
                                }
                            })
                        }
                    })
        case ENCRYTION_KEY:{
            let {listId,phrase} = action.data;
            if(!phrase) return state;

            return state.map(e => {
                    if(e.id !== listId) return e;
                    return{
                        ...e,
                        data:e.data.map(x => {
                            return DecryptFieldMiddlePhrase(phrase, x,["note"]);
                        })
                    }
                })
            }

        default:
            return state;
    }
}

