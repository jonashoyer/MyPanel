import React, { Component } from 'react';
import {connect} from "react-redux";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';


import Button from '@material-ui/core/Button';

import Icon from "@material-ui/core/Icon";
// import ContentAdd from '@material-ui/core/svg-icons/content/add';
// import TimerIcon from '@material-ui/core/svg-icons/image/timer';
// import StopIcon from '@material-ui/core/svg-icons/av/stop';
// import PlayIcon from '@material-ui/core/svg-icons/av/play-arrow';

import DialogView from "../Components/dialog";

import {fetchTime, stopTime, continueTime} from "../actions/time";
import Chip from '@material-ui/core/Chip';

import ItemExp from "../Components/itemExpand";

import TaskMenu from "../Components/taskMenu";
import { Tooltip } from '../../node_modules/@material-ui/core';

import Avatar from '../Components/avatar';

import {EmptyContent,EncryptedContent} from "../Components/projectStateContent";

const underlineStyle = {
  borderBottom:"1px solid rgb(224, 224, 224)"
}

const chipStyle={
  marginTop: -8,
  float:"right",
  marginRight:7.5
}

const chipLabelStyle={
  fontSize: 14,
  lineHeight: "25px",
  paddingLeft: 8.5,
  paddingRight: 8.5
}

const AddbuttonStyle={
  // height:40,
  marginTop:"2rem",
  margin: "0 5px"
};

const btnAbs= {
  position: 'fixed',
  right: 24,
  bottom: 16,
  zIndex: 1000
}

const TotalTime = (arr) =>{
  let time = 0;
  for(let i = 0,len = arr.length;i<len;i++){
    if(arr[i].end) time += getTimespan(arr[i].end, arr[i].start); 
  }
  return time > 0 ? formatTime(time) : "-";
}

const getTimespan = (d1,d2)=>{
  return new Date(d1).getTime() - new Date(d2).getTime();
}

const formatDate = (d1, d2)=>{

  if(d1){
    d1 = d1.split("GMT")[0];
  }

  d2 = d2.split("GMT")[0];
  let date1 = d1 ? new Date(d1).toUTCString() : new Date().toUTCString();
  let date2 = new Date(d2).toUTCString();
  const useDate = date1.slice(0,16) !== date2.slice(0,16);
  const fn = (n) => formatNumber(Number(n));

  const fd = (d) => d.slice(5,16);
  
  // "Wed, 08 Aug 2018 23:11:00 GMT"
  const formatClockTime = (str) => str.slice(17,22);

  if(!d1){
    return "Started at " + formatClockTime(date2);
  }  

  return formatClockTime(date2) + " " + (useDate ? `(${fd(date2)})` : "") + " - " +
  formatClockTime(date1) + " " + (useDate ? `(${fd(date1)})` : "") + (!useDate && ` (${fd(date1)})`);
}

class Timers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      dialog: "",
      dialogValue: "",
    };
  }

  handleChange = (event, index, value) => this.setState({value});  

  setDialog = (v = "", value = "") => {
    this.setState({dialog: v, dialogValue: value});
  }

  _stopTimer = () =>{
    this.props.stopTime(this.props.active._id);
  }

  setLoadState = (b) => {
    if(b === this.state.loading) return;
    this.setState({loading:b})
  }

  inEditMode = (id = undefined) =>{
    this.setState({inEdit:id});
  }

  OpenEncryptionUnlock = () => {
    const {selected,list} = this.props;

    const _list = list.find(e => e._id === selected);
  
    if(_list && _list.encryption && _list.encryption.cipher){
      this.setDialog("UNLOCK_KEY",{..._list.encryption,listId:selected});
    }
  }

  render() {

    const active = this.props.active && Object.getOwnPropertyNames(this.props.active).length > 0;

    const {selected,time,fetchTime,list} = this.props;
    const {loading, inEdit,currSelected} = this.state;

    const index = time.findIndex((e)=>{return e.id == selected});
    if(index > -1){
      this.setLoadState(false);
      var arr = time[index].data;
 
    }else{
      if(!loading){
        this.setLoadState(true);
        fetchTime(selected);
        return null;
      }
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
        {!loading && <div style={btnAbs}>
          <Tooltip title="Start new timer">
            <Button color="primary" variant="fab" disabled={active || !isUnlocked} style={AddbuttonStyle} onClick={()=>this.setDialog("TIME_START",this.props.selected)} >
              <Icon>play_arrow</Icon>
            </Button>
          </Tooltip>
          <Tooltip title="Inset new timer">
            <Button color="secondary" variant="fab" style={AddbuttonStyle} disabled={!isUnlocked} onClick={()=>this.setDialog("TIME_CREATE",this.props.selected)} >
              <Icon>add</Icon>
            </Button>
          </Tooltip>
        </div>}
        <DialogView setDialog={this.setDialog} dialog={this.state.dialog} dialogValue={this.state.dialogValue} />
            
        
        <Paper style={{padding:1}}>
          <div className="list-header" style={{position:active ? "absolute" : "relative"}}>
            <h3>Timers</h3>
          </div>
          {active  &&
            <Clock active={this.props.active} stopClick={this._stopTimer} />
          }
          {loading && (<div className="load-spinner" />)}
          <List style={{margin:"0 12px"}}>
          {arr && !arr.length && isUnlocked && EmptyContent({buttonText:"start a new timer", onClick:()=>this.setDialog("TIME_START",selected)}) }
          {!loading && !hasPhrase && hasEncryption && <EncryptedContent onClick={this.OpenEncryptionUnlock}/> }
          {!loading && isUnlocked && arr && arr.map((e,i)=>{ 

              const edit = inEdit === e._id;
        
              const actions = edit ? 
              [
                <Button color="primary" style={{marginRight:15}} onClick={()=> this.setDialog("TIME_SPAN_CREATE",{timeId: e._id,name:e.name,id:selected})}>Insert</Button>,
                <Button color="primary" style={{marginRight:15}} onClick={()=> this.setDialog("TIME_RENAME",{timeId: e._id,name:e.name,id:selected})}>Rename</Button>,
                <Button color="secondary" style={{marginRight:15}} onClick={()=> this.setDialog("TIME_DELETE",{timeId: e._id,id:selected})}>Delete</Button>,
                <Button color="secondary" style={{marginRight:15}} onClick={()=>this.inEditMode(null)}>Exit edit</Button>
              ]
              :
              [
              <Button color="primary" style={{marginRight:15}} disabled={active} onClick={()=> this.props.continueTime(selected, e._id)}>Continue</Button>,
              <Button color="secondary" style={{marginRight:15}} onClick={()=>this.inEditMode(e._id)}>Edit</Button>
              ];
              
              return <ItemExp
              key={i}
              icon={<Icon>timer</Icon>}
              title={e.name}
              subtext={TotalTime(e.spans)}
              chip={
                  e.spans.length > 1 &&
                  <Chip style={chipStyle} labelStyle={chipLabelStyle} label={e.spans.length} />
              }
              actions={actions}
              children={(
                  <div style={{width:"100%"}}>
                    
                    {e.spans.sort(sortByDate).map((v, i)=>{
        
                      const user = v.userId;
        
                      return <div style={{...underlineStyle,padding: "10px 32px 10px 5px",display:"flex",justifyContent:"space-between"}}>
                        <div style={{display:"flex"}}>
                          {user.name && <Avatar small id={user._id} name={user.name} style={{display:"inline-block",marginRight:25}} useTooltip />}
                          <span style={{lineHeight:2}}>{formatDate(v.end, v.start)}</span>
        
                          {edit && <a href="javascript:void(0)" style={{marginLeft:".5rem", color:"#000",lineHeight:2}} onClick={()=>this.setDialog("TIME_SPAN_EDIT",{id:selected, timeId: e._id, spanId:v._id,start:v.start,end:v.end})} >
                            <Icon style={{fontSize:18, lineHeight: 1.3}}>create</Icon>
                          </a>}
                        </div>
        
                        <div>
                          
                          <span style={{marginRight:"4.25em",lineHeight:2}}>{formatTime(getTimespan(v.end || new Date(), v.start))}</span>
                          
                          {edit && <a href="javascript:void(0)" style={{marginLeft:"-1rem",lineHeight:2}} onClick={()=>this.setDialog("TIME_SPAN_REMOVE",{id:selected, timeId: e._id, spanId:v._id})}>
                            <Icon style={{color:"red", fontSize:18, lineHeight:1.4, fontWeight:"bold"}}>clear</Icon>
                          </a>}
                        </div>
                      </div>
        
                    })}
                  </div>
                  )} />}
              )
          }
          </List>
        </Paper>
      </div>
    );
  }
}

class Clock extends Component {

  constructor(props){
    super(props);
    this.state={
      now: new Date().getTime()
    }
  }

  componentDidMount(){
    this.timerID = setInterval(()=>{
      this.setState({
        now: new Date().getTime()
      })
    }, 1000);
  }

  componentWillUnmount(){
    clearInterval(this.timerID);
  }

  render(){
    return(
      <Paper className="time-display space-between" style={{padding: "25px 40px", marginTop:40,marginBottom:20}}>
        <div>
          <p className="time-title">{this.props.active.name}</p>
          <p className="time-subtitle">{this.props.active.listName}</p>
        </div>
        <div className="time-status space-between">
          <span className="time-clock">{formatTime(this.state.now - new Date(this.props.active.start).getTime())}</span>
          <Tooltip title="Stop timer">
          <Button color="primary" variant="fab" mini onClick={this.props.stopClick}>
              <Icon>stop</Icon>
          </Button>
          </Tooltip>
        </div>
      </Paper>
    )
  }
}

const formatTime = (time) =>{
  if(time < 0) time = 0;
  const h = Math.floor(time / 36e5);
  time -= 36e5 * h;
  const min =  Math.floor(time / 6e4);
  time -= 6e4 * min;
  const sec = Math.floor(time / 1e3);
  return h+":"+formatNumber(min)+":"+formatNumber(sec);
}

const formatNumber = (num) => {
  return num < 10 ? "0"+num : num;
}

const sortByDate = (a,b) => {
  a = new Date(a.start);
  b = new Date(b.start);
  return a > b ? 1 : a < b ? -1 : 0;
}

const mapStateToProps = (state)=>{
  return {
    selected: state.list.index,
    time: state.time.data,
    list:state.list.lists,
    active: state.time.active
  }
}

export default connect(mapStateToProps,{fetchTime,stopTime, continueTime})(Timers);