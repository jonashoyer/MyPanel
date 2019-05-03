import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import Icon from "@material-ui/core/Icon";
// import MoreVertIcon from '@material-ui/core/svg-icons/navigation/more-vert';

export default class TaskMenu extends Component{

    constructor(props){
        super(props);
        this.state={
            anchorEl: false
        }
    }

    handlerOpen = (e) =>{
        this.setState({
            anchorEl: e.currentTarget
        })
    }

    handlerClose = () =>{
        this.setState({
            anchorEl: false
        })
    }

    render(){
        return(
            <div {...this.props}>
                <IconButton onClick={this.handlerOpen} style={{height:32, width: 32}}>
                    <Icon>more_horiz</Icon>
                </IconButton>
                <Menu anchorEl={this.state.anchorEl} open={!!this.state.anchorEl} onClose={this.handlerClose}>
                    {this.props.items.map((v,i)=>{
                        return <MenuItem onClick={()=>{v[1](); this.handlerClose() }}>{v[0]}</MenuItem>
                    })}
                </Menu>
            </div>
        )
    }
}