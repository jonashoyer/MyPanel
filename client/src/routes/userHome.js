import React, { Component } from 'react';
import {connect} from "react-redux";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {Redirect} from "react-router-dom";

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';

import {changeListSelect, orderList} from "../actions/list";
import DialogView from "../Components/dialog";
import TaskMenu from "../Components/taskMenu";

import SortableList from "../Components/SortableList";
import DragHandle from "../Components/Tools/DragHandle";

import OnSortFunc from "../utils/OnSort";
import {EmptyContent} from "../Components/projectStateContent";



const listItemPadding = {
    paddingTop: 14,
    paddingRight: 56,
    paddingBottom:10,
    paddingLeft: 56
};
  
  
const buttonStyle={
    margin:"2.5px 25px 2.5px 2.5px",
    minWidth:80,
}
  
  
const listItemStyle={
    borderBottom:"1px solid rgb(224, 224, 224)",
}

const actionButtonStyle={
    marginLeft: 5,
    marginRight: 5,
};

const btnAbs= {
    position: 'fixed',
    right: 24,
    bottom: 16,
    zIndex: 1000
}

class UserHome extends Component {  

    constructor(props){
        super(props);

        this.state = {
            dialog: "",
            dialogValue: "",
            redirect: "",
            editMode: false
        }
    }

    redirect = (path)=>{
        this.setState({
            redirect:path
        })
    } 

    setDialog = (v = "", value = "") => {
        this.setState({dialog: v, dialogValue: value});
    }

    onSort = ({oldIndex, newIndex}) =>
        OnSortFunc(oldIndex,newIndex,this.props.list,undefined,this.props.orderList);
    
    render(){

        if(this.state.redirect){
            return <Redirect to={(this.state.redirect ) } />;
        }

        return(
            <div>
                <div style={btnAbs}>
                    <Tooltip title="Add Project">
                        <Button color="primary" variant="fab" className="list-action-button" secondary style={actionButtonStyle} onClick={()=>this.setDialog("LIST_ADD")}>
                            <Icon>add</Icon>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button color="secondary" variant="fab" className="list-action-button" secondary style={actionButtonStyle} onClick={()=>{this.setState({editMode: !this.state.editMode})}}>
                            <Icon>{this.state.editMode ? "done" : "edit"}</Icon>
                        </Button>
                    </Tooltip>
                </div>


                <DialogView setDialog={this.setDialog} dialog={this.state.dialog} dialogValue={this.state.dialogValue} />
                <Paper style={{padding:1}}>
                    <div className="list-header">
                        <h3>Projects</h3>
                    </div>

                    {this.props.list.length === 0 && EmptyContent({buttonText:"Create a new project",onClick:()=>this.setDialog("LIST_ADD")})}
                    <SortableList onSortEnd={this.onSort} >
                        {this.props.list.map((item)=>{
                            return <HomeItem
                                edit={this.state.editMode} 
                                title={item.name}
                                id={item._id}
                                onChange={this.props.changeListSelect}
                                redirect={this.redirect}
                                setDialog={this.setDialog}
                            />
                        })}
                    </SortableList>
                </Paper>
            </div>
        )
    }
}


const HomeItem = (e) => {

    const {edit,redirect} = e;

    const onClick = (path) => {
        // e.onChange(e.id);
        redirect("/project/"+e.id+path);
    }

    return(
        <ListItem
        style={listItemStyle}
        >
            {edit && <DragHandle />}
            <div className="project-item-content">
                <p style={{maxWidth: 160,marginLeft:5}}>{e.title}</p>
                <div className="action-buttons">
                    <Tooltip title="Todo">
                        <Button
                            variant="raised"
                            color="primary"
                            style={buttonStyle}
                            onClick={()=>onClick("/todo")}
                        ><Icon>assignment</Icon></Button>
                    </Tooltip>
                    <Tooltip title="Sticky Notes">
                        <Button
                            variant="raised"
                            color="primary"
                            style={buttonStyle}
                            onClick={()=>onClick("/sticky-notes")}
                        ><Icon>note</Icon></Button>
                    </Tooltip>
                    <Tooltip title="Passwords">
                        <Button
                            variant="raised"
                            color="primary"
                            style={buttonStyle}
                            onClick={()=>onClick("/passwords")}
                        ><Icon>vpn_key</Icon></Button>
                    </Tooltip>
                    <Tooltip title="Timers">
                        <Button
                            variant="raised"
                            color="primary"
                            style={buttonStyle}
                            onClick={()=>onClick("/timers")}
                        ><Icon>timer</Icon></Button>
                    </Tooltip>
                    <Tooltip title="Overview">
                        <Button
                            variant="raised"
                            color="primary"
                            style={{background:"#0288D1",minWidth:50}}
                            onClick={()=>onClick("/overview")}
                        ><Icon>vertical_split</Icon></Button>
                    </Tooltip>
                </div>
            </div>
            {edit && <ListItemSecondaryAction>
                <TaskMenu items={[
                    ["Rename", () => e.setDialog("LIST_RENAME",{id: e.id,name:e.title}) ],
                    ["Delete", () => e.setDialog("LIST_DELETE",e.id) ]
                ]} />
            </ListItemSecondaryAction>}

        </ListItem>
    );
}

const mapStateToProps = (state)=>{
    return {
      list: state.list.lists
    }
}


export default connect(mapStateToProps,{changeListSelect, orderList})(UserHome);
