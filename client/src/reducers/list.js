import {SELECTED_LIST_CHANGED, LISTS_FETCHED,LIST_CREATED,LIST_DELETE,LIST_RENAME,LIST_ORDER,ENCRYTION_KEY} from "../types";
import chainlink from "../utils/LinkedList";

export default function lists (state = {lists:[]}, action = {}) {
    switch(action.type){
        case SELECTED_LIST_CHANGED:
            return{
                ...state,
                index: action.index
            }
        case LISTS_FETCHED:
            return {
                ...state,
                lists: chainlink(action.data)
            }

        case LIST_CREATED:
            return{
                ...state,
                lists: state.lists.concat(action.data)
            }

        case LIST_DELETE:
            return{
                ...state,
                lists: state.lists.filter((e)=> {return e._id != action.data})
            }
        case LIST_RENAME:
            
            let _state = state.lists.filter(e => {return e._id != action.data.id}) || [];
            let _list = state.lists.find(e => {return e._id == action.data.id});
            _list.name = action.data.name;
            _state.push(_list); 

            return {
                ...state,
                lists: _state
            };

        case LIST_ORDER:

            let {oldIndex, newIndex} = action.data;
            let arr = state.lists;

            arr.splice(newIndex, 0, arr.splice(oldIndex, 1 )[0]);

            return {
                ...state,
                lists: arr.map(e => {return e} )
            }
            
        case ENCRYTION_KEY:{
                let {listId,cipher,phrase} = action.data;
            
                return {
                    ...state,
                    lists: state.lists.map( e => {
                        if(e._id !== listId) return e;

                        return {
                            ...e,
                            encryption:{
                                ...e.encryption,
                                cipher: cipher || e.encryption.cipher,
                                phrase
                            }
                        }
                    })
                }
            }

        default:
            return state;
    }
}
