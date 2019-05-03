import React, {Component} from 'react';
import {connect} from "react-redux";
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Dialog from "./dialogPanel";
import { withStyles } from '@material-ui/core/styles';
// import FlatButton from '@material-ui/core/FlatButton';
// import RaisedButton from '@material-ui/core/RaisedButton';
import {createList, deleteList,renameList,CreateEncrytionKey,UnlockEncryptionKey,RemoveEncryptionKey,ConfirmeEncryptionKey} from "../actions/list";
import {createTodo, deleteTodo,renameTodo, getNote, setNote} from "../actions/todo";
import {createPass,ChangePhrase, editPass, deletePass} from "../actions/password";
import {startTime, renameTime, deleteTime, createTime, createTimeSpan, editTimeSpan, removeTimeSpan} from "../actions/time";
import {deleteNote} from "../actions/note";
import {createTag} from "../actions/tags";
import {addUser,removeUser} from "../actions/overview";
import api from "../api";
import crypto from "crypto";
import crc32 from "buffer-crc32";
import { Paper, withTheme } from '../../node_modules/@material-ui/core';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import TagColor from "../utils/tagColors";

import PasswordEncryptionKeyInput from "./Dialogs/passwordEncryptionKeyInput";
import PasswordEncryptionKeyUnlock from "./Dialogs/passwordEncryptionKeyUnlock";

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginTop: theme.spacing.unit * 2,
  },
  passText:{
    color: "black"
  }
});

export const AddListContent = connect(null,{createList})(({onClose, createList}) => (
  <DialogItem title="Add Project" placeholder="Project Name" text="Create a new Project with a name" buttonText="Create" onSubmit={createList} onClose={onClose} width={400}/>
));

export const RenameListContent = connect(null,{renameList})(({onClose, renameList, value}) => (
  <DialogItem title="Rename Project" placeholder="Project Name" text="Enter a new name for the Project" buttonText="Rename" value={value.name} onSubmit={(v)=>renameList(value.id,v)} onClose={onClose} width={400}/>
));

export const DeleteListContent = connect(null, {deleteList}) (({onClose, deleteList, id})=>(
  <DialogOkay title="Delete Project" text="This action is permanent, and will delete all data associated with this Project!" buttonText="Delete" onSubmit={()=>deleteList(id)} onClose={onClose} width={350}/>
));


export const AddTodoContent = connect(null,{createTodo})(({onClose, createTodo, id}) => (
  <DialogItem title="Add Todo" placeholder="Todo Title" text="Create a new todo with a title" buttonText="Create" onSubmit={(v)=>createTodo(id,v)} onClose={onClose} width={400}/>
));

export const RenameTodoContent = connect(null,{renameTodo})(({onClose, renameTodo, value}) => (
  <DialogItem title="Rename Todo" placeholder="Todo Name" text="Enter a new name for the todo" buttonText="Rename" value={value.name} onSubmit={(v)=>renameTodo(value.listId,value.id,v)} onClose={onClose} width={400}/>
));

export const DeleteTodoContent = connect(null, {deleteTodo}) (({onClose, deleteTodo, value})=>(
  <DialogOkay title="Delete Todo" text="This action is permanent, and will delete all data associated with this todo!" buttonText="Delete" onSubmit={()=>deleteTodo(value.listId, value.id)} onClose={onClose} width={350}/>
));

export const EditTodoContent = withStyles(styles) (({onClose, value, classes}) => {
  return <DialogFetch component={DialogTextfield} title={value.name} buttonText="Save" onSubmit={(v)=>setNote(value.listId, value.id, v)} classes={classes} onClose={onClose} width={450} fetch={ api.todo.fetchNote.bind(null, value.listId, value.id)}/>
})


export const AddPassContent = connect(null, {createPass}) (({onClose, createPass, value}) => (
  <DialogTripleInput title="Add Password" placeholder={ ["Password Title","Password Username","Password"] } text="Create a new password with a title and a username" buttonText="Create" onSubmit={(v)=>createPass(value,...v)} onClose={onClose} width={400}/>
));

export const ShowPassContent = connect((state)=>{ return { phrase: state.pass.phrase}},{ChangePhrase}) (withStyles(styles) (({onClose, phrase,ChangePhrase, value, classes})=>(
  <PasswordDialog snackbar={value.snackbar} name={value.name} username={value.username} password={value.password} classes={classes} phrase={phrase} changePhrase={ChangePhrase} onClose={onClose} />
)));

export const EditPassContent = connect(null,{editPass})(({onClose, editPass, value}) => (
  <DialogTripleInput  title="Edit Password" placeholder={["Password Title","Password Username","Password"]} defaultValue={[value.name || "",value.username || "",value.password || ""]} text="Enter the new infomantion for the password" buttonText="Edit" onSubmit={(v)=>editPass(value.listId,value.id,v[0],v[1],v[2])} onClose={onClose} width={400}/>
));

export const DeletePassContent = connect(null, {deletePass}) (({onClose, deletePass, value})=>(
  <DialogOkay title="Delete Password" text="This action is permanent, and will delete all data associated with this password!" buttonText="Delete" onSubmit={()=>deletePass(value.listId, value.id)} onClose={onClose} width={350}/>
));



export const CreateKeyPassContent = connect(null, {CreateEncrytionKey})(({onClose,CreateEncrytionKey,value}) => (
  <PasswordEncryptionKeyInput title="Encryption Key" placeholder={["Sercet Key","Confirm Sercet Key"]} text="Enter a sercet key for the password generater! Remember your key or lose acces to the passwords!" buttonText="Create" onSubmit={v => CreateEncrytionKey(value,v) } onClose={onClose} width={400} />
))

export const ConfirmeKeyContent = connect(null, {ConfirmeEncryptionKey}) (({onClose,value,ConfirmeEncryptionKey}) => (
  <PasswordEncryptionKeyUnlock {...value} rawOutput title="Encryption Key" placeholder="Sercet Key" text="Enter the sercet key to encrypt the project!" buttonText="Submit"  onSubmit={ ConfirmeEncryptionKey } onClose={onClose} width={400} /> 
))

export const UnlockKeyPassContent = connect(null, {UnlockEncryptionKey}) (({onClose,value,UnlockEncryptionKey}) => (
  <PasswordEncryptionKeyUnlock {...value} title="Decryption Key" placeholder="Sercet Key" text="Enter the sercet key to decrypt the data!" buttonText="Unlock"  onSubmit={ UnlockEncryptionKey } onClose={onClose} width={400} /> 
))


export const RemoveKeyPassContent = connect(null, {RemoveEncryptionKey}) (({onClose,value,RemoveEncryptionKey}) => (
  <PasswordEncryptionKeyUnlock {...value} rawOutput title="Decryption Key" placeholder="Sercet Key" text="Enter the sercet key to remove the encryption!" buttonText="Submit"  onSubmit={ RemoveEncryptionKey } onClose={onClose} width={400} /> 
))



export const StartTimeContent = connect(null, {startTime}) (({onClose, startTime, value}) => (
  <DialogItem title="Start new Timer" placeholder="Timer Title" text="Create a new timer with a title" buttonText="Create" onSubmit={(v)=>startTime(value,v)} onClose={onClose} width={400}/>
));

export const RenameTimeContent = connect(null,{renameTime}) (({onClose,renameTime, value})=>(
  <DialogItem title="Rename Timer" text="Enter a new name for the timer" buttonText="Rename" value={value.name} onSubmit={(v)=>renameTime(value.id, value.timeId, v)} onClose={onClose} />
));

export const DeleteTimeContent = connect(null, {deleteTime}) (({onClose, deleteTime, value})=>(
  <DialogOkay title="Delete Timer" text="This action is permanent, and will delete all data associated with this timer!" buttonText="Delete" onSubmit={()=>deleteTime(value)} onClose={onClose} width={350}/>
));


export const CreateTimeContent = connect(null, {createTime}) (({onClose, createTime, value}) => (
  <DialogTimeEditor inputField={true} title="Create new Timer" placeholder="Timer Title" text="Create a new timer with a title and the time span" buttonText="Create" onSubmit={(v)=>createTime(value,v)} onClose={onClose} width={450}/>
));

export const CreateTimeSpanContent = connect(null, {createTimeSpan}) (({onClose, createTimeSpan, value})=>(
 <DialogTimeEditor title="Create Time Span" buttonText="Insert" onSubmit={(v)=>createTimeSpan(value,v)} onClose={onClose} />
));

export const EditTimeSpanContent = connect(null, {editTimeSpan}) (({onClose, editTimeSpan, value})=>(
  <DialogTimeEditor title="Edit Time Span" buttonText="Edit" start={value.start} end={value.end} onSubmit={(v)=>editTimeSpan({...value, ...v})} onClose={onClose} />
));

export const RemoveTimeSpanContent = connect(null, {removeTimeSpan})(({onClose, removeTimeSpan, value})=>(
  <DialogOkay title="Delete Time Span" text="This action is permant!" buttonText="Delete" onSubmit={() =>removeTimeSpan(value)} onClose={onClose}  width={350} />
))

export const RemoveNoteContent = connect(null,{deleteNote})(({onClose,deleteNote,value})=>(
  <DialogOkay title="Delete Note" text="This action is permant, and will delete all data associated with this note!" buttonText="Delete" onClose={onClose} onSubmit={()=>deleteNote(value.id,value.noteId)} width={350} />
))


export const CreateTagContent = connect(null,{createTag})((props)=>(
  <DialogNewTag {...props} onSubmit={(data) => props.createTag(props.value, data.tagName, data.color)} />
))

export const AddUserContent = connect(null,{addUser})(({addUser,onClose,value})=>(
  <DialogItem title="Add User" placeholder="Email" text="Add user by there email. Use spaces to add multiply users at once." onSubmit={(v)=> addUser(value.id, v, onClose) } buttonText="Add" onClose={onClose} width={400} />
));

export const UsersAddedContent = (({onClose, value})=>(
  <DialogOkay title={`User${value.length > 1 && "s"} has been added!`} text={`${value} user${value.length > 1 && "s"} has been added!`} okayOnly buttonText="Okay" onClose={onClose} width={350}/>
));

export const RemoveUserContent = connect(null,{removeUser}) (({removeUser,onClose,value})=>(
  <DialogOkay title="Remove User"  text={`Do you absolutely want to remove the user, ${value.name}?`} buttonText="Remove" onClose={onClose} width={400} onSubmit={()=>removeUser(value.id,value.userId)}/>
))


class DialogFetch extends Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.props.fetch().then(v => this.setState({
      value: v || ""
    }));
  }

  render(){
    return this.state.value !== undefined ? <this.props.component {...this.props} value={this.state.value}/> : <div />
  }
}

class DialogItem extends Component {
  constructor(props){
    super(props);

    this.state = {
      open: true,
      value:""
    };
  }

  onChange = (e)=>{ 
    this.setState({value:e.target.value});
  }

  handleClose = () => {
    this.setState({open: false});
    setTimeout(() => this.props.onClose(),200);
  };

  handleSubmit = () =>{
    if(this.state.value.length < 1) return;
    this.props.onSubmit(this.state.value);
    this.handleClose(); 
  }


  render() {
    const actions = [
      <Button
        color="secondary"
        onClick={this.handleClose}
      >Cancel</Button>,
      <Button
        variant="raised"
        color="primary"
        disabled={this.state.value.length < 1}
        onClick={this.handleSubmit}
      >{this.props.buttonText}</Button>
    ];

    const content = [
      <p>{this.props.text}</p>,
      <TextField autoFocus placeholder={this.props.placeholder} onChange={this.onChange} fullWidth={true} defaultValue={this.props.value}/>
    ];

    return (
        <Dialog
            title={this.props.title}
            actions={actions}
            handleClose={this.handleClose}
            open={this.state.open}
            onSubmit={this.handleSubmit}
            fullWidth
            content={content}
        />
    );
  }
}

class DialogTripleInput extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: true,
      value: this.props.defaultValue || ["","",""]
    };

  }

  onChange = (e,i)=>{ 
    let v = this.state.value;
    v[i] = e.target.value;
    this.setState({value:v});
  }

  handleClose = () => {
    this.setState({open: false});
    setTimeout(() => this.props.onClose(),200);
  };

  handleSubmit = () =>{
    if(this.state.value[0].length < 1 || this.state.value[1].length < 1 || this.state.value[2].length < 1) return;
    this.props.onSubmit(this.state.value);
    this.handleClose(); 
  }


  render() {

    console.log(this.props.defaultValue);

    const actions = [
      <Button
        color="secondary"
        onClick={this.handleClose}
      >Cancel</Button>,
      <Button
        variant="raised"
        color="primary"
        
        disabled={this.state.value[0].length < 1 || this.state.value[1].length < 1 || this.state.value[2].length < 1}
        onClick={this.handleSubmit}
      >{this.props.buttonText}</Button>,
    ];

    const content = [
      <p>{this.props.text}</p>,
      <TextField autoFocus value={this.state.value[0]} placeholder={this.props.placeholder[0]} onChange={(e)=>this.onChange(e,0)} fullWidth={true} disabled={this.props.disabled} />,
      <TextField value={this.state.value[1]} style={{marginTop:"1rem"}} placeholder={this.props.placeholder[1]} onChange={(e)=>this.onChange(e,1)} fullWidth={true} disabled={this.props.disabled} />,
      <TextField value={this.state.value[2]} style={{marginTop:"1rem"}} placeholder={this.props.placeholder[2]} onChange={(e)=>this.onChange(e,2)} fullWidth={true} disabled={this.props.disabled} />
    ];

    return (
        <Dialog
          title={this.props.title}
          actions={actions}
          open={this.state.open}
          handleClose={this.handleClose}
          content={content}
          fullWidth
          onSubmit={this.handleSubmit}
          width={this.props.width}
        />
    );
  }
}

class DialogOkay extends Component {
  constructor(props){
    super(props);

    this.state = {
      open: true
    };
  }

  handleClose = () => {
    this.setState({open: false});
    setTimeout(() => this.props.onClose(),200);
  };

  handleSubmit = () =>{
    this.props.onSubmit();
      this.handleClose(); 
  }


  render() {

    let actions = [];

    !this.props.okayOnly && actions.push(
      <Button
        color="secondary"
        onClick={this.handleClose}
      >Cancel</Button>)

    actions.push(
      <Button
        autoFocus
        variant="raised"
        color="primary"
        onClick={this.handleSubmit}
      >{this.props.buttonText}</Button>,
    );

    const content= [
      <p>{this.props.text}</p>
    ];

    return (
        <Dialog
          title={this.props.title}
          actions={actions}
          open={this.state.open}
          handleClose={this.handleClose}
          onSubmit={this.handleSubmit}
          fullWidth
          width={this.props.width}
          content={content}
        />
    );
  }
}


class DialogTextfield extends Component {
  constructor(props){
    super(props);

    this.state = {
      open: true,
      value:""
    };
  }

  onChange = (e)=>{ 
    this.setState({value:e.target.value});
  }

  handleClose = () => {
    this.setState({open: false});
    setTimeout(() => this.props.onClose(),200);
  };

  handleSubmit = () =>{
    this.props.onSubmit(this.state.value);
    this.handleClose(); 
  }


  render() {
    const actions = [
      <Button
        color="secondary"
        onClick={this.handleClose}
      >Cancel</Button>,
      <Button
        variant="raised"
        color="primary"
        onClick={this.handleSubmit}
      >{this.props.buttonText}</Button>,
    ];

    const content=[
      <p>{this.props.text}</p>,
      <TextField autoFocus fullWidth placeholder={this.props.placeholder} onChange={this.onChange} defaultValue={this.props.value} multiline />
    ]; 

    return (
      <Dialog
        title={this.props.title}
        actions={actions}
        fullWidth
        onSubmit={this.handleSubmit}
        open={this.state.open}
        handleClose={this.handleClose}
        content={content}
      />
    );
  }
}

const style={
  to:{
    lineHeight: 3,
    margin: "0 7.5px",
    color: "black"
  },
  timeInput:{
    width:156
  }
}

class Dte extends Component {

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  constructor(props){
    super(props);
    
    const end = new Date();
    end.setHours(end.getHours() + 1);
    this.state = {
      open: true,
      singleDay: true,
      start:(this.printDate(this.props.start ? new Date(this.props.start) : new Date())),
      end:(this.printDate(this.props.end ? new Date(this.props.end) : end))
    }
  }

  printDate = (d) => {

    const str = d.toUTCString();
    const num = (n) => n < 10? "0"+n:n;
    return str.slice(12,16) + "-"+ num(this.months.indexOf(str.slice(8,11)))+"-"+str.slice(5,7)+"T"+str.slice(17,25);
    // console.log(str);

    // const m = d.getMonth()+1;
    // return (d.getYear()+1900) + "-"+cvtN(m) +"-"+ cvtN(d.getDate()) +"T"+cvtN(d.getHours())+":"+cvtN(d.getMinutes());
  }

  onChange = (e)=>{ 
    this.setState({
        [e.target.name]: e.target.value
      });
  }

  handleClose = () => {
    this.setState({open: false});
    setTimeout(() => this.props.onClose(),200);
  };

  handleSubmit = () =>{
    if(!this.state.name && this.props.inputField) return;
    this.props.onSubmit({...this.state});
    this.handleClose(); 
  }


  render() {
    const actions = [
      <Button
        color="secondary"
        onClick={this.handleClose}
      >Cancel</Button>,
      <Button
        variant="raised"
        color="primary"
        
        disabled={!this.state.name && this.props.inputField}
        onClick={this.handleSubmit}
      >{this.props.buttonText}</Button>,
    ];

    const content = (
      <div>
        <p>{this.props.text}</p>
        {this.props.inputField && <TextField autoFocus placeholder="Timer Title" name="name" onChange={this.onChange} fullWidth={true} defaultValue={this.props.value}/>}
        <div className={this.props.classes.textField +" space-between"} >
          <TextField label="Start Time" name="start" type="datetime-local" onChange={this.onChange} defaultValue={this.state.start} textFieldStyle={style.timeInput} placeholder="Start Time" />
          &emsp;
          <TextField label="End Time" name="end" type="datetime-local" onChange={this.onChange} defaultValue={this.state.end} textFieldStyle={style.timeInput} placeholder="End Time" />
        </div>
      </div>
    )

    return (
        <Dialog
          title={this.props.title}
          actions={actions}
          open={this.state.open}
          handleClose={this.handleClose}
          contentStyle={{maxWidth:this.props.width}}
          content={content}
          onSubmit={this.handleSubmit}
          fullWidth
          />
    );
  }
}

const DialogTimeEditor = (withStyles(styles)) (Dte);



class _PasswordDialog extends Component {
  constructor(props){
    super(props);

    this.state = {
      open: true,
      // value: this.props.phrase
    };
  }

  // onChange = (e)=>{ 
  //   this.setState({value:e.target.value});
  // }

  handleClose = () => {
    this.setState({open: false});
    setTimeout(() => this.props.onClose(),200);
    
    // if(this.state.value != this.props.phrase) this.props.changePhrase(this.state.value);
  };

  // chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%{}[]()/\\'\"`~,;:.<>";

  paperStyle ={
    padding: "0 20px 15px 20px",
    margin: "20px 5px"
  };

  // password = ()=>{
  //   const hash = crypto.createHash("sha256").update(this.props.orginalName + this.props.username + this.state.value).digest("ascii");
  //   return encode_ascii85(hash);
  // }

  // phraseSum = () =>{
  //   return this.state.value ? parseInt(crc32(this.state.value).toString("hex"),16) % 1000 : " ";
  // }

  textStyle = {
    color: "rgba(0, 0, 0, 0.87)",
    cursor: "pointer"
  }

  errorStyle = {
    color: "rgba(0, 188, 212)",
  }

  render() {

    const actions = [
      <Button
        color="secondary"
        onClick={this.handleClose}
      >Close</Button>
    ];

    // let pass = this.password();

    const content = (
      <div>
        <Paper style={this.paperStyle} >
          <p>{this.props.text}</p>
          <CopyToClipboard text={this.props.username} onCopy={()=>this.props.snackbar.display("Username copied to clipboard!")}>
            <TextField label="Username" inputProps={{style:{color:this.props.theme.palette.text.primary}}} fullWidth={true} className={this.props.classes.textField} disabled={true} value={this.props.username}/>
          </CopyToClipboard>

          <CopyToClipboard text={this.props.password} onCopy={()=>this.props.snackbar.display("Password copied to clipboard!")}>
            <TextField label="Password" inputProps={{style:{color:this.props.theme.palette.text.primary}}} fullWidth={true} className={this.props.classes.textField + " password-display"} disabled={true} value={this.props.password}/>
          </CopyToClipboard>
        </Paper>
        {/* <Paper style={this.paperStyle}>
          <TextField autoFocus label="Phrase" className={this.props.classes.textField} helperText={this.phraseSum()} onChange={this.onChange} fullWidth={true} defaultValue={this.props.phrase}  type="password"  />
        </Paper> */}
      </div>
    )


    return (
        <Dialog
            title={this.props.name}
            actions={actions}
            modal={false}
            open={this.state.open}
            handleClose={this.handleClose}
            onSubmit={this.handleClose}
            content={content}
            fullWidth
        />
    );
  }
}

const PasswordDialog = (withTheme()(_PasswordDialog));

class DialogNewTag extends Component {
  constructor(props){
    super(props);

    this.state = {
      open: true,
      color: 0,
      tagName: ""
    };
  }

  handleClose = () => {
    this.setState({open: false});
    setTimeout(() => this.props.onClose(),200);
  };

  handleSubmit = () =>{
    if(this.state.tagName.length === 0) return;
    const {color,tagName} = this.state;
    this.props.onSubmit({color,tagName});
    this.handleClose(); 
  }

  onChange = (e)=>{ 
    this.setState({[e.target.name]:e.target.value});
  }

  onColorChange = (colorIndex) => {
    this.setState({color:colorIndex});
  } 


  render() {
    const actions = [
      <Button
        color="secondary"
        onClick={this.handleClose}
      >Cancel</Button>,
      <Button
        variant="raised"
        color="primary"
        disabled={this.state.tagName.length === 0}
        onClick={this.handleSubmit}
      >Create Tag</Button>,
    ];

    const content = [
      <div>
          <div>
              <p>Create a new tag by typing a name and selecting a color</p>
              <TextField
              name="tagName"
              autoFocus
              fullWidth
              placeholder="Tag Name"
              onChange={this.onChange}
              />
          </div>
          <div style={{marginTop:35}}>
              <p>Select a color:</p>
              <div style={{maxWidth: 400}}>
                {TagColor.map((col,i)=>{
                  
                  const shadow = i === this.state.color ? {boxShadow: "rgba(0, 0, 0, 0.6) 0px 7px 16px -4px, rgba(0, 0, 0, 0.2) 0px 6px 30px 2px, rgba(0, 0, 0, 0.2) 0px 5px 22px 4px"} : {};
                  return <div key={i} style={{float:"left",margin:5,height:24,width:24,borderRadius:12,...shadow,background:col}} onClick={()=>this.onColorChange(i)} />
                })}
              </div>
          </div>
      </div>
    ];

    return (
        <Dialog
          title="Create Tag"
          actions={actions}
          open={this.state.open}
          handleClose={this.handleClose}
          width={350}
          content={content}
          onSubmit={this.handleSubmit}
          fullWidth
          />
    );
  }
}

function encode_ascii85(a) {

  var b, c, d, e, f, g, h, i, j, k;
  for (!/[^\x00-\xFF]/.test(a), b = "\x00\x00\x00\x00".slice(a.length % 4 || 4), a += b, 
  c = [], d = 0, e = a.length; e > d; d += 4) f = (a.charCodeAt(d) << 24) + (a.charCodeAt(d + 1) << 16) + (a.charCodeAt(d + 2) << 8) + a.charCodeAt(d + 3), 
  0 !== f ? (k = f % 85, f = (f - k) / 85, j = f % 85, f = (f - j) / 85, i = f % 85, 
  f = (f - i) / 85, h = f % 85, f = (f - h) / 85, g = f % 85, c.push(g + 33, h + 33, i + 33, j + 33, k + 33)) :c.push(122);
  return function(a, b) {
    for (var c = b; c > 0; c--) a.pop();
  }(c, b.length), String.fromCharCode.apply(String, c);
}