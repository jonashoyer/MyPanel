import React, { Component } from 'react';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import Menu from "@material-ui/core/Menu";
import InputAdornment from '@material-ui/core/InputAdornment';
import TaskMenu from "./taskMenu";
import {withRouter} from 'react-router-dom';


import Icon from "@material-ui/core/Icon";
// import MoreVertIcon from '@material-ui/core/svg-icons/navigation/more-vert';

import {changeListSelect} from "../actions/list";
import DialogView from "../Components/dialog";


const style = {
    formControl:{
        margin: "20px 25px 10px",
        minWidth: 150,
        display:"block"
    },
    select:{
        maxWidth: 200
    }
}

class listSelect extends Component {

    constructor(props){
        super(props);
        this.state ={
            dialog: "",
            dialogValue: "",
            open: false,
            selected: "",
        }
    }

    setDialog = (v = "", value = "") => {
        this.setState({dialog: v, dialogValue: value});
    }

    handleChange = event => {

        const id = event.target.value;
        const {location,history,changeListSelect} = this.props;
        
        let path = location.pathname.split('/');
        if(path[1] === "project"){
            path[2] = id;
            return history.push(path.join('/'));
        }

        changeListSelect(id)
    }
    
    menuOpen = () =>{
        this.setState({
            open: true
        })
    }
    
    menuClose = () =>{
        this.setState({
            open: false
        })
    }
    
    render(){
        
        const seletedList = this.props.list.find((e)=>{return e._id == this.props.select})
        
        return(
            <FormControl style={style.formControl}>
                <DialogView setDialog={this.setDialog} dialog={this.state.dialog} dialogValue={this.state.dialogValue} />
                <FormGroup>
                    <InputLabel>Projcet</InputLabel>
                    <Select
                        style={style.select}
                        value={this.props.select}
                        onChange={this.handleChange}
                        endAdornment={!!seletedList && listTaskMenu(seletedList._id, this.setDialog,seletedList.name)}
                        inputProps={{
                            name: 'selected'
                        }}
                        >
                        {this.props.list.map((item, i)=>{
                            return  <MenuItem value={item._id} key={i}>{item.name}</MenuItem>
                        })}
                    </Select>
                </FormGroup>
            </FormControl>

            // <div className="list-header">
            //     <DialogView setDialog={this.setDialog} dialog={this.state.dialog} dialogValue={this.state.dialogValue} />
            //     <Button onClick={this.menuOpen} >{!!seletedList && seletedList.name}</Button>
            //     <div className="list-content">
            //         <h3>List:</h3>
            //         <Menu open={this.state.open} onClose={this.menuClose} style={{marginTop:"1rem"}} value={ this.props.list.findIndex((value) => {return value._id == this.props.select})} onChange={this.handleChange}>
            //             {this.props.list.map((item, i)=>{
            //                 return <MenuItem value={i} key={i} primaryText={item.name} />
            //             })}
            //         </Menu>
            //     </div>
            //     {!!seletedList && listTaskMenu(seletedList._id, this.setDialog,seletedList.name)}
            // </div>
        )
    }
}

const listTaskMenu = (id,setDialog, listname) => (
    <TaskMenu items={[
        ["Add new list", ()=>setDialog("LIST_ADD") ],
        ["Share", () => {} ],
        ["Rename", ()=>setDialog("LIST_RENAME",{id:id,name:listname}) ],
        ["Delete", ()=>setDialog("LIST_DELETE",id) ]
    ]} />
    // <InputAdornment>
    //     <IconButton onClick={open}>
    //         <Icon>more_horiz</Icon>
    //     </IconButton>
    //     <Menu anchorEl={isOpen} open={!!isOpen} onClose={close}>
    //         <MenuItem button onClick={()=>setDialog("LIST_ADD")}>Add new list</MenuItem>
    //         <MenuItem>Share</MenuItem>
    //         <MenuItem button onClick={()=>setDialog("LIST_RENAME",{id:id,name:listname})}>Rename</MenuItem>
    //         <MenuItem button onClick={()=>setDialog("LIST_DELETE",id)}>Delete</MenuItem>
    //     </Menu>
    // </InputAdornment>
);


const mapStateToProps = (state)=>{
    return {
      select: state.list.index,
      list: state.list.lists
    }
}

export default withRouter(connect(mapStateToProps,{changeListSelect}) (listSelect));