import axios from "axios";
import api from "../api";
import {TAG_CREATED,TAG_FETCHED,TAG_DELETED} from "../types";

const fetched = data =>({
    type: TAG_FETCHED,
    data 
});

const created = data =>({
    type: TAG_CREATED,
    data
});


const _deleted = data =>({
    type: TAG_DELETED,
    data
});

export const fetchTags = id => dispatch =>{
    api.tag
    .fetch(id)
    .then(lists => dispatch(fetched(lists)));
}

export const createTag = (id,value,colorIndex) => dispatch => {
    api.tag.create({id,value,colorIndex}).then(note => dispatch(created(note)));
}

export const _deleteTag = (id, tagId) => dispatch => {
    api.tag._delete({id,tagId}).then(data => dispatch(_deleted(data)));
}
