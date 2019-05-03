import {combineReducers} from "redux";
import user from "./reducers/user";
import list from "./reducers/list";
import todo from "./reducers/todo";
import pass from "./reducers/password";
import time from "./reducers/time";
import note from "./reducers/note";
import tags from "./reducers/tags";
import overview from "./reducers/overview";
import userSettings from "./reducers/userSettings";

export default combineReducers({
    user,
    list,
    todo,
    pass,
    time,
    note,
    tags,
    overview,
    userSettings
});