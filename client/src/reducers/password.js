import {PASS_FETCHED, PASS_CREATED,PASS_DELETE,PASS_EDIT,PASS_PHRASE,PASS_ORDER,ENCRYTION_KEY} from "../types";
import chainlink from "../utils/LinkedList";
import {EncryptionMiddle,DecryptFieldMiddlePhrase} from "../utils/EncryptionMiddle";

export default (state = [], action = {}) => {
    switch(action.type){
        case PASS_FETCHED:
            return [
                ...state,
                {
                    ...action.data,
                    data:chainlink(action.data.data)
                }
            ]
            
        case PASS_CREATED:{

            const {listId} = action.data;

            return state.map(e => {
                if(e.id != listId) return e;

                return{
                    ...e,
                    data:[
                        ...e.data,
                        action.data
                    ]
                }
            })    
        }
        case PASS_DELETE:{

            const {listId, passId} = action.data;

            return state.map( e=> {
                if(e.id != listId) return e;
                return {
                    ...e,
                    data: e.data.filter(x => x._id != passId)
                }
            })
        }
        case PASS_EDIT:{
        
            const {id,passId,title,username,password} = action.data;

            return state.map(x => {
                    if(x.id !== id) return id;

                    return {
                        ...x,
                        data: x.data.map( e => {
                            if(e._id !== passId) return e;

                            return{
                                ...e,
                                name:title,
                                username,
                                password
                            }
                        })
                    }
                })
            }

        case PASS_ORDER:
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
        
        case ENCRYTION_KEY:{
            let {listId,phrase} = action.data;
            if(!phrase) return state;

            return state.map(e => {
                    if(e.id !== listId) return e;
                    return{
                        ...e,
                        data:e.data.map(x => {
                            return DecryptFieldMiddlePhrase(phrase, x,["name","username","password"]);
                        })
                    }
                })
            }


        default:
            return state;
    }
}

