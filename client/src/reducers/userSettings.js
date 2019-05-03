import {SET_USER_SETTING} from "../types";

export default function user (state = {settings:{}}, action = {}) {
    switch(action.type){
        case SET_USER_SETTING:

            const {key,value} = action.data;

            return {
                ...state,
                settings:{
                    ...state.settings,
                    [key]:value
                }
            }    
        default:
            return state;
    }
}