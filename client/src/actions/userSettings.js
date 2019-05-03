import {SET_USER_SETTING} from "../types";

export const SetUserSetting = (key,value,useLocalStorage=false) => dispatch => {
    if(useLocalStorage) localStorage[key] = value;
    dispatch({
        type:SET_USER_SETTING,
        data:{key,value}
    })
}