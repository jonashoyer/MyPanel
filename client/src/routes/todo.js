import React, { Component } from 'react';
import {connect} from "react-redux";
import ReactDOM from 'react-dom';
// import MobileTearSheet from '../../../MobileTearSheet';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';

import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import Button from '@material-ui/core/Button';
import Icon from "@material-ui/core/Icon";
import ListSelect from "../Components/listSelect";

import Tags from "../Components/Tags";

import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
// import ContentAdd from '@material-ui/core/svg-icons/content/add';
// import MoreVertIcon from '@material-ui/core/svg-icons/navigation/more-vert';

import DialogView from "../Components/dialog";
import {fetchTodo,setTodoState, orderTodo,addTagTodo,removeTagTodo,createTodo,setNote} from "../actions/todo";
import {startTime} from "../actions/time";
import {fetchTags} from "../actions/tags";
import TaskMenu from "../Components/taskMenu";
import {Redirect} from "react-router-dom";

import SortableList from "../Components/SortableList";
import DragHandle from "../Components/Tools/DragHandle";
import OnSortFunc from "../utils/OnSort";
import TextField from '@material-ui/core/TextField';
import Snackbar from "../Components/snackbar";
import {EmptyContent,EncryptedContent} from "../Components/projectStateContent";

import LinkPopover from "../Components/LinkPopover";

import {SetUserSetting} from "../actions/userSettings";

const listItemPadding = {
    paddingTop: 14,
    paddingRight: 56,
    paddingBottom:10,
    paddingLeft: 56
};

const buttonStyle={
    marginLeft: 5,
    marginRight: 5,
};

const listItemStyle={
    borderBottom:"1px solid rgb(224, 224, 224)",
    paddingTop: 1,
    paddingBottom: 1
}

const btnAbs= {
    position: 'fixed',
    right: 24,
    bottom: 16,
    zIndex: 1000
}

const searchTags = {
    1:{
        color:8,
        name:"Checked",     
        _id:"1"
    },
    0:{
        color:0,
        name:"Unchecked",
        _id:"0"
    }
}

const buttonView = {
    padding: 7.5,
    minWidth: 36
}

const extendButton={
    btn:{
        display: "inline-flex",
        background: "#2a62ff",
        borderRadius: 8,
        color: "#fff",
        height: 16,
        padding: "0 8px 0 2px",
        // marginTop: -10,
        marginLeft:64,
        cursor:"pointer",
        zIndex:5
    },
    icon:{
        marginTop: -3,
        fontSize: 22,
        marginRight: -4
    }
}

class Todo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 1,
            dialog: "",
            dialogValue: "",
            extraMenu: null,
            editMode: false,
            loading: false,
            filter:[],
        };

        this.setPopperTarget = this.setPopperTarget.bind(this);
        this.urlPopperClose = this.urlPopperClose.bind(this);
    }
    noteData={}

    componentDidMount() {
        window.addEventListener("beforeunload", this.PostAllNotes);
    }
    
    componentWillUnmount(){
        this.PostAllNotes();
        window.removeEventListener("beforeunload", this.PostAllNotes);
    }

    urlPopperClose(){
        this.setState({anchorEl:undefined});
    }

    setPopperTarget(t){
        const { currentTarget } = t.event;
        this.setState({
            anchorEl: currentTarget,
            url:t.url
        });
    }

    setDialog = (v = "", value = "") => {
        this.setState({dialog: v, dialogValue: value});
    }

    setExtraMenu = (b)=>{
        this.setState({extraMenu: b});
    }

    setLoadState = (b) => {
        if(b === this.state.loading) return;
        this.setState({loading:b})
    }

    redirect=(path)=>{
        this.setState({redirect:path});
    }

    setViewMode = type => {
        this.props.SetUserSetting("todo_viewmode",type,true);
    }
    setOpenedTodo = _id => this.setState({
        OpenedTodo: _id !== this.state.OpenedTodo ? _id : undefined
    });

    AddSubTodo = (event,mainId) => {
        event && event.preventDefault();
        const name = this.state.newTodoName;
        this.props.createTodo(this.props.selected,name,mainId);
        this.setState({
            newTodoName: ""
        })
    }

    GetSubtodos = (todos, mainTodoId) => {

        const {filter,editMode,OpenedTodo} = this.state;
        const {selected} = this.props;

        const isOpen = OpenedTodo === mainTodoId;

        if(isOpen) var addSubTodo = (e) => this.AddSubTodo(e,mainTodoId);


        return <div style={{marginBottom: isOpen ? 16 : 0}}>
            {/* <SortableList onSortEnd={()=>{}}>*/}
            {todos.map( e => {
                return <ListItem style={{paddingLeft:44,paddingRight:22, paddingTop:0,paddingBottom:0,display:"flex"}}>
                        {editMode && filter.length === 0 && <DragHandle style={{marginTop:14}} />}
                        <Checkbox checked={e.state} onChange={(event,b)=>this.props.setTodoState(selected, e._id, b)} />
                        <div style={{padding:"7.5px 0", display:"flex"}}>
                            <span style={{padding:"0 5px", fontSize:16,lineHeight:1.5}}>{e.name}</span>
                        </div>

                        <ListItemSecondaryAction>
                            <div style={{display:"flex",justifyContent:"flex-start"}}>
                                {!editMode && <div>
                                    <Tooltip title="Start Timer">
                                        <IconButton mini color="primary" style={{marginRight:15}} onClick={()=>{
                                            this.redirect("/project/"+selected+"/timers");
                                            startTime(selected,e.name);
                                        }}>
                                            <Icon>play_arrow</Icon>
                                        </IconButton>
                                    </Tooltip>
                                </div>}
                                {editMode && (
                                    <TaskMenu items={[
                                        ["Rename", () => this.setDialog("TODO_RENAME",{id: e._id,name:e.name,listId:selected}) ],
                                        ["Delete", () => this.setDialog("TODO_DELETE",{id: e._id,listId:selected}) ]
                                    ]}/>
                                )}
                            </div>
                        </ListItemSecondaryAction>
                    </ListItem>
                })} 
                
                
                {isOpen && <div style={{paddingLeft:44,paddingRight:22, paddingTop:0,paddingBottom:0}}>
                    <form onSubmit={addSubTodo}>
                        <Button variant="fab" color="primary" style={{marginRight:15,width:16,height:16,minHeight:"unset"}} onClick={()=>addSubTodo}>
                            <Icon style={{fontSize:16}}>add</Icon>
                        </Button>
                        <TextField style={{padding:0}} inputProps={{style:{padding:0}}} onChange={(e)=>this.setState({newTodoName:e.target.value}) } placeholder="Add todo" value={this.state.newTodoName} />
                    </form>
                </div>}
                {/* </SortableList> */}
            </div>

    }

    NoteUpdate = (note,todoId) => {

        if(!this.noteData[todoId]) this.noteData[todoId] = {};

        const {timeout} = this.noteData[todoId];

        if(timeout) clearTimeout(timeout);

        let listId = this.props.selected;

        this.noteData[todoId] = {
            ...this.noteData[todoId],
            value:note,
            listId,
            isDirty: true
        };

        this.noteData[todoId].timeout = setTimeout(() => {
            this.PostNoteUpdate(todoId);
        },2000);        
    }

    PostAllNotes = () => {
        
        for(let key  in this.noteData){
            this.PostNoteUpdate(key);
        }
    }

    PostNoteUpdate = todoId => {

        const {value,listId,isDirty} = this.noteData[todoId];
        if(!isDirty) return;
        
        this.props.setNote(listId,todoId,value);
        this.noteData[todoId].isDirty = false;
    }

    OpenEncryptionUnlock = () => {
        const {selected,list} = this.props;
    
        const _list = list.find(e => e._id === selected);
      
        if(_list && _list.encryption && _list.encryption.cipher){
          this.setDialog("UNLOCK_KEY",{..._list.encryption,listId:selected});
        }
      }

    render() {

        
        
        const {filter,editMode,loading,currSelected} = this.state;
        const {tags,selected,todo,orderTodo,list} = this.props;
        const _tags = tags[selected];
        const filterTags = {..._tags,...searchTags};
        const viewMode = this.props.userSettings["todo_viewmode"];
        
        if(this.state.redirect){
            return <Redirect to={(this.state.redirect ) } />;
        }
        
        const index = todo.findIndex((e)=>{return e.id === selected});

        const onSort = ({oldIndex, newIndex}) => 
            OnSortFunc(oldIndex,newIndex,todo[index].data,selected,orderTodo);

        if(index > -1){
            var arr = todo[index].data;
            var mainTodos = arr.filter(x => !x.parentId);
            this.setLoadState(false);

            var filterOn = filter.indexOf("1") > -1;
            var filterOff = filter.indexOf("0") > -1;

            var filterState = (filterOn && filterOff) || (!filterOn && !filterOff) ? null : filterOff;
            var _filterTags = filter.filter(x => x !== "0" || x!=="1");
        } else {
            if(loading) return null;
            this.setLoadState(true);
            this.props.fetchTodo(selected);
            this.props.fetchTags(selected);
        }

        if(list.length){

            const _list = list.find(e => e._id === selected);
            var hasEncryption = _list && (_list.encryptionStatus == "encrypting" || _list.encryptionStatus == "encrypted");
            var hasPhrase = _list && _list.encryption && !!_list.encryption.phrase;
      
      
            if( currSelected !== selected){
              if(_list && hasEncryption && !hasPhrase){
                this.setDialog("UNLOCK_KEY",{..._list.encryption,listId:selected});
              }
        
              this.setState({
                currSelected: selected,
              })
            }
        }

        const isUnlocked = (hasPhrase || !hasEncryption);


        return (
            <div>

                <LinkPopover onClose={this.urlPopperClose} anchorEl={this.state.anchorEl} url={this.state.url} />

                {!loading &&
                    <div style={btnAbs}>
                        {!editMode &&
                            <Tooltip title="Add Todo">
                                <Button color="primary" variant="fab" lassName="list-action-button" style={buttonStyle} disabled={!isUnlocked} onClick={()=>{this.setDialog("TODO_ADD",this.props.selected)}}>
                                    <Icon>add</Icon>
                                </Button>
                            </Tooltip>
                        }
                        <Tooltip title="Edit mode">
                            <Button color="secondary" variant="fab" className="list-action-button" style={buttonStyle} disabled={!isUnlocked}  onClick={()=>{this.setState({editMode: !this.state.editMode})}}>
                                <Icon>{editMode ? "done" : "edit"}</Icon>
                            </Button>
                        </Tooltip>
                    </div>}
                <DialogView setDialog={this.setDialog} dialog={this.state.dialog} dialogValue={this.state.dialogValue} />
                <Paper zDepth={2} style={{padding:1}}>
                    <div className="list-header">
                        <h3>Todos</h3>
                        <div style={{marginTop:32,display:"inline-flex"}}>

                            <div style={{border:"2px solid rgba(0, 0, 0, 0.54)",borderRadius:15,display: "inline-flex",padding:"0 7.5px",minHeight: 33,marginRight:12}}>
                                <IconButton color={ viewMode  !== "headline" ? "default" : "primary"} variant="text" style={buttonView} onClick={()=>this.setViewMode("headline")}>
                                    <Icon>view_headline</Icon>
                                </IconButton>
                                <IconButton color={ viewMode  !== "list" ? "default" : "primary"} variant="text" style={buttonView} onClick={()=>this.setViewMode("list")}>
                                    <Icon>view_list</Icon>
                                </IconButton>
                                <IconButton color={ viewMode  !== "stream" ? "default" : "primary"} variant="text" style={buttonView} onClick={()=>this.setViewMode("stream")}>
                                    <Icon>view_stream</Icon>
                                </IconButton>
                            </div>

                            <div style={{border:"2px solid rgba(0, 0, 0, 0.54)",borderRadius:15,display: "inline-flex",padding:"7.5px 0",minHeight: 33}}>
                                <Icon style={{marginTop: 6, marginLeft: 25}}>filter_list</Icon>
                                {/* {!filter.length && <span style={{margin: "7.5px 15px 0 10px", fontSize: 16}}></span>} */}
                                <Tags tags={filterTags} setDialog={this.setDialog} style={{marginTop:5}} tagStyle={{marginBottom:5}} activeTags={filter} edit={true} onAdd={(tagId)=>this.setState({filter:filter.concat([tagId])})} onRemove={(tagId)=> this.setState({filter:filter.filter(e=>e !== tagId)})}  />
                            </div>
                        </div>
                    </div>
                    {loading && (<div className="load-spinner" />)}
                    {!loading && !isUnlocked && <EncryptedContent onClick={this.OpenEncryptionUnlock}/> }
                    {isUnlocked && index > -1 && <div>
                        {mainTodos.length === 0 && EmptyContent({buttonText:"Create a new todo",onClick:()=>this.setDialog("TODO_ADD",selected)})}
                        <SortableList onSortEnd={onSort}>
                            {mainTodos.map((e) =>{

                                if(filter.length && !e.tags.some(v => _filterTags.includes(v)) && (!filterState || filterState === e.state)) return null;
                                const children = arr.filter(x => x.parentId === e._id);

                                const noteTxt = (this.noteData[e._id] && this.noteData[e._id].value) || e.notes || "";
                                
                                return <div key={e._id} style={listItemStyle}>
                                    <ListItem style={{paddingLeft:12, paddingTop:0,paddingBottom:0}}>
                                        {editMode && filter.length === 0 && <DragHandle style={{marginTop:14}} />}
                                        <Checkbox checked={e.state} onChange={(event,b)=>this.props.setTodoState(selected, e._id, b)} />
                                        <div style={{padding:"7.5px 0", display:"flex"}}>
                                            <span style={{padding:"0 5px", fontSize:16,lineHeight:1.5}}>{e.name}
                                            <Tags tags={_tags} setDialog={this.setDialog} activeTags={e.tags} edit={editMode} onAdd={(tagId)=>this.props.addTagTodo(selected,e._id,tagId)} onRemove={(tagId)=> this.props.removeTagTodo(selected,e._id,tagId)} />
                                            </span>
                                        </div>

                                        <ListItemSecondaryAction>
                                            <div style={{display:"flex",justifyContent:"flex-start"}}>
                                                {!editMode && <div>
                                                    <Tooltip title="Start Timer">
                                                        <IconButton mini color="primary" style={{marginRight:15}} onClick={()=>{
                                                            this.redirect("/project/"+selected+"/timers");
                                                            startTime(selected,e.name);
                                                        }}>
                                                            <Icon>play_arrow</Icon>
                                                        </IconButton>
                                                    </Tooltip>

                                                    {/* <IconButton variant="fab" style={e.notes ? {color:"#3f51b5"} : {color:"#00000054"} }  aria-label="notes" mini onClick={() => this.setDialog("TODO_OPEN_NOTE",{id: e._id,name:e.name,listId:selected})}>
                                                        <Icon>{e.notes ? "mode_comment" : "add_comment"}</Icon>
                                                    </IconButton> */}
                                                </div>}
                                                {editMode && (
                                                    <TaskMenu items={[
                                                        ["Rename", () => this.setDialog("TODO_RENAME",{id: e._id,name:e.name,listId:selected}) ],
                                                        ["Delete", () => this.setDialog("TODO_DELETE",{id: e._id,listId:selected}) ]
                                                    ]}/>
                                                )}
                                            </div>
                                        </ListItemSecondaryAction>
                                                    
                                        
                                    </ListItem>


                                    {(viewMode !== "headline" || this.state.OpenedTodo == e._id)  && this.GetSubtodos(children,e._id)}
                                    {(viewMode == "stream" || this.state.OpenedTodo == e._id) && <ContentEditable onChange={(txt)=>this.NoteUpdate(txt,e._id)} html={ noteTxt} setTarget={this.setPopperTarget} className="todo-note-content" />}
                                    
                                    <div style={extendButton.btn} onClick={() => this.setOpenedTodo(e._id)}>
                                        <Icon style={extendButton.icon}>{this.state.OpenedTodo !== e._id ? "arrow_drop_down" : "arrow_drop_up"}</Icon>
                                        <Icon style={extendButton.icon}>more_horiz</Icon>
                                    </div>

                                </div>}
                                )
                            }
                        </SortableList>
                    </div>}
                </Paper>
            </div>
        );
    }
}

const urlRegexp = /(https?:\/\/[^\s]+)/g;

//setTarget, onChange, className, html
class ContentEditable extends Component{
    
    state={}


    shouldComponentUpdate = (nextProps) => {
        // console.log(nextProps.html)
        return nextProps.html !== ReactDOM.findDOMNode(this).innerText;
    }

    emitChange = () => {

        const node = ReactDOM.findDOMNode(this);

        let txt = node.innerText;
        if (this.props.onChange && txt !== this.lastHtml) {
            this.props.onChange( txt );
            this.lastHtml = txt;
        }
    }

    render(){

        const {className, html} = this.props;

        let jsx = [];
        ///(\r\n|\n|\r)/gm
        if(html){
            console.log(html);
            const lines = html.split('\n');
            // lines.pop();
            const lineCount = lines.length - 1;
            lines.map((e,i)=>{
    
                const txts = e.split(urlRegexp);
                if(txts.length > 1){
                    
                    for(let _i = 0,len = txts.length;_i<len;_i++){
                        const txt = txts[_i];
                        (txt.search(urlRegexp) > -1) ?
                        jsx.push(<a href={txt} onClick={(e)=>{this.props.setTarget({event:e,url:txt})}}>{txt}</a>)
                        :
                        jsx.push(txt);
                    }
                }else{
                    jsx.push(e);
                }
    
                i !== lineCount && jsx.push(<br />);
            })
        }

        // jsx.push(html);

        // html = html.replace(/(https?:\/\/[^\s]+)/g,(url)=>{
        //     return '<a target="_blank" href="'+url+'">'+url+"</a>"
        // })
        
        return (
            <div 
                className={className}
                onInput={this.emitChange} 
                onBlur={this.emitChange}
                contentEditable
                placeholder="Enter notes here..."
                >
                {jsx}
            </div>
        );
    }
};

const mapStateToProps = (state)=>{
    return {
      selected: state.list.index,
      list: state.list.lists,
      todo: state.todo,
      tags: state.tags,
      userSettings:state.userSettings.settings
    }
  }

export default connect(mapStateToProps,{fetchTodo,setTodoState,orderTodo,fetchTags,addTagTodo,removeTagTodo,startTime,createTodo,setNote,SetUserSetting})(Todo);