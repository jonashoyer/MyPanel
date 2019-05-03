import {OVERVIEW_FETCHED, ADD_USER,REMOVE_USER} from "../types";

export default function lists (state = {}, action = {}) {
    switch(action.type){
        case OVERVIEW_FETCHED:
            return action.data;
            
        case ADD_USER:

            return {
                ...state,
                list: {
                    ...state.list,
                    userIds: state.list.userIds.concat(action.data.users)
                }
            };

        case REMOVE_USER:

            return {
                ...state,
                list: {
                    ...state.list,
                    userIds: state.list.userIds.filter(x => x._id !== action.data.userId)
                }
            }

        default:
            return state;
    }
}

