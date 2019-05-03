import axios from "axios";
import api from "../api";
import {TIME_FETCHED,TIME_ACTIVE_FETCHED, TIME_START, TIME_CONTINUE, TIME_RENAME, TIME_DELETE, TIME_STOP,
    TIME_CREATED, TIME_SPAN_CREATED, TIME_SPAN_EDIT,TIME_SPAN_DELETE, TIME_OVERVIEW_FETCHED} from "../types";
import {EncryptFieldMiddle, DecryptFieldMiddle} from "../utils/EncryptionMiddle";



const timeFetched = data =>({
    type: TIME_FETCHED,
    data 
});

const timeActiveFetched = data =>({
    type: TIME_ACTIVE_FETCHED,
    data 
});

const timeStarted = data =>({
    type: TIME_START,
    data
});

const timeContinued = data =>({
    type: TIME_CONTINUE,
    data
});

const timeStopped = data =>({
    type: TIME_STOP,
    data
});

const timeDeleted = data =>({
    type: TIME_DELETE,
    data
});

const timeRenamed = data =>({
    type: TIME_RENAME,
    data
});

const timeCreated = data =>({
    type: TIME_CREATED,
    data
});

const timeSpanCreated = data =>({
    type: TIME_SPAN_CREATED,
    data
})

const timeSpanEdit = data =>({
    type: TIME_SPAN_EDIT,
    data
});

const timeSpanDeleted = data =>({
    type: TIME_SPAN_DELETE,
    data
});


export const fetchTime = data => dispatch =>{
    api.time
    .fetch(data)
    .then(lists => dispatch(timeFetched({
        ...lists,
        data: lists.data.map(x => DecryptFieldMiddle(x.listId,x,["name"]))
    })));
}

export const fetchActiveTime = data => dispatch =>{
    api.time
    .fetchActive(data)
    .then(data => dispatch(timeActiveFetched(DecryptFieldMiddle(data.listId,data,['name']))));
}

export const startTime = (id,value) => dispatch => {
    let obj = EncryptFieldMiddle(id,{id,value},["value"]);
    api.time.start(obj).then(list => dispatch(timeStarted({...list,time:{
        ...list.time,
        name: value
    }})));
}

export const continueTime = (id, timeId) => dispatch => {
    api.time.continue(id,timeId).then(list => dispatch(timeContinued(list)));
}

export const stopTime = (spanId) => dispatch=>{
    api.time.stop(spanId).then(data => dispatch(timeStopped(data)))
}

export const renameTime = (id,timeId,value) => dispatch =>{
    let obj = EncryptFieldMiddle(id,{id,timeId,value},["value"]);
    api.time.rename(obj).then(change => dispatch(timeRenamed({...change,name:value})));
}

export const deleteTime = (id, timeId) => dispatch => {
    api.time.delete(id,timeId).then(id => dispatch(timeDeleted(id)));
}

export const createTime = (id, value) => dispatch => {
    let obj = EncryptFieldMiddle(id,{id,value},["value"]);
    api.time.create(obj).then(data => dispatch(timeCreated({
        ...data,
        time:{
            ...data.time,
            name:value
    }})))
}

export const createTimeSpan = (id, value) => dispatch =>{
    api.time.span.create(id,value).then(data => dispatch(timeSpanCreated(data)));
}

export const editTimeSpan = (id,timeId, spanId, value) => dispatch => {
    api.time.span.edit(id,timeId,spanId,value).then(data => dispatch(timeSpanEdit(data)))
}

export const removeTimeSpan = (value) => dispatch => {
    api.time.span.delete(value).then(data => dispatch(timeSpanDeleted(data)))
}