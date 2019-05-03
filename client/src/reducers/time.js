import {TIME_FETCHED, TIME_START, TIME_CONTINUE, TIME_RENAME, TIME_DELETE, TIME_STOP,TIME_ACTIVE_FETCHED,TIME_CREATED,
    TIME_SPAN_CREATED,TIME_SPAN_EDIT,TIME_SPAN_DELETE,ENCRYTION_KEY} from "../types";
import {EncryptionMiddle,DecryptFieldMiddlePhrase} from "../utils/EncryptionMiddle";

export default function lists (state = {data:[],ovSpan:7}, action = {}) {
    switch(action.type){
        case TIME_FETCHED:
            return{
                ...state,
                data: state.data.concat([action.data])
            }

        case TIME_ACTIVE_FETCHED:
            
            const act = action.data.active;
            
            const obj = act ? {
                ...act,
                name: act.timer ? act.timer.name : "<unknown>",
                listName: act.timer ? act.timer.listId.name : "<unknown>",
                timer: undefined
            } : {};

            return{
                ...state,
                active: obj
            }
            
        case TIME_START:
            return{
                ...state,
                active: Object.assign(action.data.time.spans[0],{name: action.data.time.name, listName: action.data.listName}),
                data: state.data.map((e)=>{
                    if(e.id != action.data.listId) return e;

                    return {
                        ...e,
                        data: [action.data.time].concat(e.data)
                    }
                })
            }

        case TIME_CONTINUE:            
            return {
                ...state,
                active: Object.assign(action.data.time.spans[0], {name: action.data.time.name, listName: action.data.listName}),
                data: state.data.map((e)=>{
                    if(e.id != action.data.listId) return e;

                    return{
                        ...e,
                        data: e.data.map((_e)=>{
                            if(_e._id != action.data.time._id) return _e;

                            return{
                                ..._e,
                                spans: _e.spans.concat(action.data.time.spans)
                            }
                        })
                    }
                })
            }
        
        case TIME_STOP:
            return {
                ...state,
                active: null,
                data: state.data.map((e)=>{
                        return{
                            ...e,
                            data: e.data.map((_e) =>{
                                if(_e._id != action.data.timeId) return _e;

                                return{
                                    ..._e,
                                    spans: _e.spans.map((ele)=>{
                                        if(ele._id != action.data.spanId) return ele;

                                        return{
                                            ...ele,
                                            end: action.data.end
                                        }
                                    })
                                }
                            })
                        }
                    })
            };

        case TIME_RENAME:
            return{
                ...state,
                data: state.data.map((e)=>{
                    if(e.id != action.data.listId) return e;

                    return{
                        ...e,
                        data: e.data.map((_e)=>{
                            if(_e._id != action.data.timeId) return _e;

                            return{
                                ..._e,
                                name: action.data.name
                            }
                        })
                    }
                })
            }

        case TIME_DELETE:
            return{
                ...state,
                data: state.data.map((e)=>{
                    if(e.id != action.data.listId) return e;

                    return{
                        ...e,
                        data: e.data.filter(e => e._id != action.data.timeId)
                    }
                })
            }
        case TIME_CREATED:
            return {
                ...state,
                data: state.data.map((e)=>{
                    if(e.id != action.data.listId) return e;

                    return {
                        ...e,
                        data: e.data.concat(action.data.time)
                    };
                })
            }
        case TIME_SPAN_CREATED:
            return{
                ...state,
                data: state.data.map((e)=>{
                    if(e.id != action.data.listId) return e;

                    return{
                        ...e,
                        data: e.data.map((_e)=>{
                            if(_e._id != action.data.timeId) return _e;

                            return {
                                ..._e,
                                spans: _e.spans.concat(action.data.span)
                            }
                        })
                    }
                })
            }
        case TIME_SPAN_EDIT:
            return{
                ...state,
                data: state.data.map((e)=>{
                    if(e.id !== action.data.listId) return e;

                    return{
                        ...e,
                        data: e.data.map((_e)=>{
                            if(_e._id !== action.data.timeId) return _e;

                            return {
                                ..._e,
                                spans: _e.spans.map((el)=>{
                                    if(el._id !== action.data.span._id) return el;

                                    return action.data.span;
                                })
                            }
                        })
                    }
                })
            }
        case TIME_SPAN_DELETE:
        return{
            ...state,
            data: state.data.map((e)=>{
                if(e.id != action.data.listId) return e;

                return{
                    ...e,
                    data: e.data.map((_e)=>{
                        if(_e.timeId != action.data.timeId) return _e;

                        return {
                            ..._e,
                            spans: _e.spans.filter(i => i._id != action.data.spanId)
                        }
                    })
                }
            })
        }

        case ENCRYTION_KEY:{
            let {listId,phrase} = action.data;
            if(!phrase) return state;

            return {
                ...state,
                data:state.data.map(e => {
                    if(e.id !== listId) return e;
                    return{
                        ...e,
                        data:e.data.map(x => {
                            return DecryptFieldMiddlePhrase(phrase, x,["name"]);
                        })
                    }
                })
            }
        }

        default:
            return state;
    }
}

