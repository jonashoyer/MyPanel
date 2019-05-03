import {TAG_FETCHED, TAG_CREATED,TAG_DELETED} from "../types";

export default function lists (state = {}, action = {}) {
    switch(action.type){

        case TAG_FETCHED:
            
            let data = action.data.data;
            let obj = {};

            for(let i = 0,len = data.length;i<len;i++){
                obj[data[i]._id] = data[i];
            }

            return {...state, [action.data.id]:obj};
            
        case TAG_CREATED:

            return {...state,
                [action.data.tag.listId]:{
                    ...state[action.data.tag.listId],
                    [action.data.tag._id]:action.data.tag
            }}

        case TAG_DELETED:

            return {...state,
                [action.data.id]:{
                    ...state[action.data.id],
                    [action.data.tagId]: undefined
            }}

        default:
            return state;
    }
}

