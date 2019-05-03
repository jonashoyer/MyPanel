import React, { Component } from 'react';
import { connect } from 'react-redux';

import {orderTodo} from "../actions/todo";


export const todoReset = connect(
    (state)=>{
    return {
      todo: state.todo,
    }
  },
  {orderTodo}
)(({listId,todo,orderTodo}) => {

    let list = todo.find(x=>x.id === listId);

    if(list){
        orderTodo({api:GetChangeArray(list.data)})
    }
})


const GetChangeArray = (list) =>{

    let changes = [];
    for(let i = 0,len = list.length;i<len;i++){
        let nextId = list[i+1];
        if(!nextId) nextId = null;
        changes.push({
            _id: list[i]._id, 
            nextId
        });
    }
    return changes;
}