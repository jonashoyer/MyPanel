import React,{Component} from "react";
import Chip from '@material-ui/core/Chip';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";

import tagColors from "../utils/tagColors";
import { connect } from 'react-redux'
import {addTagTodo, removeTagTodo} from "../actions/todo";


const style = {
    chip: {
        height:28,
        margin: "0 8px",
        fontSize: "0.75rem",
        color:"#fff"
    },
    
    addChip: {
        minHeight:20,
        height: 20,
        width:20,
        background: "#757575",
        color: "white",
        margin: "0 8px",
    },

    colorContent:{
        padding:"25px 15px 15px",
        maxWidth:150,
    },
    tagButton:{
        display:"block",
        marginTop:7.5,
        padding:"5px 15px",
        color:"#fff",
        borderRadius: 14,
        fontSize:14,
        cursor:"pointer"
    }
}



class Tags extends Component {
    

    state = {
        anchor: null,
        menuOpen: false
    };
    
    handleClick = event => {
        this.setState({
            anchor: event.currentTarget,
            menuOpen: true
        });
    };
    
    handleClose = () => {
        this.setState({
            anchor: null,
        });

        setTimeout(()=>this.setState({menuOpen:false}),200);
    };

    getTagsList = () =>{

        const {tags,activeTags} = this.props;


        if(!tags) return null;

        let jsx = [];

        for(let key in tags){
            if(!tags.hasOwnProperty(key)) continue;
            if(activeTags && activeTags.indexOf(tags[key]._id) > -1) continue;
            
            const e = tags[key];

            jsx.push(
                <div key={e._id} style={{display:"block"}}>
                    <Chip
                    onClick={()=>{
                        this.handleClose();
                        this.props.onAdd(e._id);
                    }}
                    avatar={
                        <Avatar style={{
                            width:28,
                            height:28,
                            background:"#ffffff85"
                        }}>
                            <Icon style={{
                                fontSize: 18,
                                width:18,
                                height:18,
                                color:"#fff"
                            }}>add</Icon>
                        </Avatar>
                    }
                    label={e.name}
                    style={{
                        ...style.chip,
                        margin: "0 0 5px",
                        background:tagColors[e.color],
                        cursor:"pointer",
                        color:"white"
                    }}
                    />
                </div>
            )

        }

        return jsx;

    }

    getActiveTags = () =>{

        const {tags,activeTags} = this.props;
        if(!tags || !activeTags || activeTags.length < 0) return null;


        let keys = Object.keys(tags)
        .filter(key => {return activeTags.indexOf(key) > -1})

        let jsx = [];

        for(let i = 0,len = keys.length;i<len;i++){
            const tag = tags[keys[i]];

            const props = this.props.edit ? {
                onClick:()=>{this.props.onRemove(tag._id)},
                avatar: <Avatar style={{
                        width:28,
                        height:28,
                        background:"#ffffff85"
                    }}>
                        <Icon style={{
                            fontSize: 18,
                            width:18,
                            height:18,
                            color:"#fff"
                        }}>remove</Icon>
                    </Avatar>
            }: {};

            jsx.push(

                <Chip
                {...props}
                key={tag._id}
                style={{...style.chip,...this.props.tagStyle, background:tagColors[tag.color]}}
                label={tag.name}
                
                />
            )
        }

        return jsx;

    }
    
    render(){


        return(
            <span>

                {this.getActiveTags()}

                {this.props.edit &&
                    <div style={{display:"inline-flex",...this.props.style}}>
                        <Button variant="fab" aria-label="add" style={style.addChip} onClick={this.handleClick}>
                            <Icon style={{fontSize:16}}>add</Icon>
                        </Button>


                        <Popover
                        open={!!this.state.anchor}
                        anchorEl={this.state.anchor}
                        onClose={this.handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        >
                            {this.state.menuOpen && <div style={style.colorContent}>
                                {this.props.tags && this.getTagsList()}
                                <p style={{margin:"15px 0 0",color:"#3f51b5",textAlign:"center",cursor:"pointer"}} onClick={()=>{this.props.setDialog("TAG_CREATE",this.props.selected );this.handleClose();} }>
                                    <Icon style={{fontSize: 20, lineHeight: 1.4}}>add</Icon>
                                    Create new tag
                                </p>

                            </div>}
                        </Popover>
                </div>
                }
            </span>
        )
    }
}

export default Tags;