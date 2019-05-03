import React, { Component } from 'react';
import {connect} from "react-redux";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Tooltip from '@material-ui/core/Tooltip';

import Button from '@material-ui/core/Button';

import Icon from "@material-ui/core/Icon";
// import ContentAdd from '@material-ui/core/svg-icons/content/add';
// import KeyIcon from '@material-ui/core/svg-icons/communication/vpn-key';

import {fetchPass,orderPass} from "../actions/password";
import DialogView from "../Components/dialog";

import TaskMenu from "../Components/taskMenu";
import SortableList from "../Components/SortableList";
import DragHandle from "../Components/Tools/DragHandle";
import onSortFunc from "../utils/OnSort";

import Snackbar from "../Components/snackbar";
import {EmptyContent, EncryptedContent,CreateKeyContent} from "../Components/projectStateContent";


const listItemPadding = {
  paddingTop: 14,
  paddingRight: 56,
  paddingBottom:10,
  paddingLeft: 56
};

const listItemStyle={
  borderBottom:"1px solid rgb(224, 224, 224)",
  flexGrow: 1
}

const btnAbs= {
  position: 'fixed',
  right: 24,
  bottom: 16,
  zIndex: 1000
}

const buttonStyle={
  marginLeft: 5,
  marginRight: 5,
};


class Passwords extends Component {
  
  constructor(props) {
    super(props);
    this.state = {value: 1, dialog: "",dialogValue:"",loading:false,editMode:false};
    this.snackbar = null;
  }

  handleChange = (event, index, value) => this.setState({value});  

  setDialog = (v = "", value = "") => {
    this.setState({dialog: v, dialogValue: value});
  } 

  setLoadState = (b) => {
    if(b === this.state.loading) return;
    this.setState({loading:b})
  }

  OpenEncryptionUnlock = () => {
    const {selected,list} = this.props;

    const _list = list.find(e => e._id === selected);
  
    if(_list && _list.encryption && _list.encryption.cipher){
      this.setDialog("UNLOCK_KEY",{..._list.encryption,listId:selected});
    }
  }

  render() {

    const {loading,currSelected,editMode} = this.state;

    const {selected,password,list,fetchPass} = this.props;
    const index = password.findIndex(e => e.id === selected);

    if(list.length){

      const _list = list.find(e => e._id === selected);
      var hasEncryption = _list && _list.encryption && !!_list.encryption.cipher;
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

    if(index <= -1){
      if(!loading) {
        this.setLoadState(true);
        fetchPass(selected);
      }
    }else{
      if(loading){
        this.setLoadState(false);
      }
    }

    const onSort = ({oldIndex, newIndex}) =>
      onSortFunc(oldIndex,newIndex,password[index].data,selected,orderPass);

    return (
      <div>
        <Snackbar ref={sb => this.snackbar = sb} />
          {!this.state.loading &&
            <div style={btnAbs}>
              {!editMode && <Tooltip title="Add password">
                <Button color="primary" variant="fab" style={buttonStyle} disabled={!hasPhrase} onClick={()=>this.setDialog("PASS_ADD",selected)}>
                  <Icon>add</Icon>
                </Button>
              </Tooltip>}
              <Tooltip title="Edit">
                <Button color="secondary" variant="fab" className="list-action-button" style={buttonStyle} disabled={!hasPhrase} onClick={()=>{this.setState({editMode: !this.state.editMode})}}>
                    <Icon>{editMode ? "done" : "edit"}</Icon>
                </Button>
              </Tooltip>
            </div>}
          <DialogView setDialog={this.setDialog} dialog={this.state.dialog} dialogValue={this.state.dialogValue} />
          <Paper zDepth={2} style={{padding:1}}>
              
              <div className="list-header">
                  <h3>Passwords</h3>
                  {!loading && !hasPhrase && (!hasEncryption ? 
                  <Button color="secondary" variant="text" onClick={()=>this.setDialog("CREATE_KEY",selected)} ><Icon>add</Icon>Create Encryption Key</Button>
                  :
                  <Button color="secondary" variant="text" onClick={this.OpenEncryptionUnlock} ><Icon>lock</Icon>Decrypt Project</Button>
                  )}
              </div>
              <List>
                {loading && (<div className="load-spinner" />)}
                
                {!loading && !hasPhrase && (hasEncryption ? <EncryptedContent onClick={this.OpenEncryptionUnlock}/> : <CreateKeyContent onClick={()=>this.setDialog("CREATE_KEY",selected)} />)}

                {hasPhrase &&<div>
                  {password[index] && password[index].data.length === 0 && EmptyContent({buttonText:"Create a new password", onClick:()=>this.setDialog("PASS_ADD",selected)})}
                  {password[index] && <SortableList onSortEnd={onSort}>
                    {password[index].data.map((e)=>
                    <div className="sortable-item">
                      {editMode && <DragHandle style={{marginTop:14}} />}
                      <ListItem
                      button
                      key={e._id}
                      style={listItemStyle}
                      onClick={()=>this.setDialog("PASS_SHOW", {name:e.name,username:e.username,password:e.password,snackbar:this.snackbar})}
                      >
                        <ListItemIcon>
                          <Icon>vpn_key</Icon>
                        </ListItemIcon>
                        <ListItemText primary={e.name} />
                        {editMode && <ListItemSecondaryAction>
                          <TaskMenu items={[
                            ["Edit", () => this.setDialog("PASS_EDIT",{id: e._id,name:e.name,listId:selected,username: e.username, password: e.password}) ],
                            ["Delete", () => this.setDialog("PASS_DELETE",{id: e._id,listId:selected}) ]
                        ]} />
                        </ListItemSecondaryAction>}
                      </ListItem>
                      </div>
                      )}
                  </SortableList>}
                </div>}

                {/* <FetchData snackbar={this.snackbar} edit={this.state.editMode} selected={this.props.selected} pass={this.props.password} fetchPass={this.props.fetchPass} setDialog={this.setDialog} setLoadState={this.setLoadState} loading={this.state.loading} orderPass={this.props.orderPass} /> */}
              </List>
          </Paper>
        </div>
    );
  }
}

const mapStateToProps = (state)=>{
  return {
    selected: state.list.index,
    password: state.pass,
    list: state.list.lists
  }
}

export default connect(mapStateToProps,{fetchPass,orderPass})(Passwords);