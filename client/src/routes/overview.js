import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';
import {Bar, Doughnut} from 'react-chartjs-2';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DialogView from "../Components/dialog";
import {fetch} from "../actions/overview";
import api from "../api";


import Avatar from '../Components/avatar';

const dayToStr = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const datasetStyle = {
    stack:true,
    borderWidth: 1,
}

const s = {
    paper:{
        padding:"10px 20px",
        margin:15,
    },
    userContent:{
        display: "inline-block",
        width: "100%",
    },
    userItem:{
        margin:"0 15px",
        float:"left",
        minWidth: 80,
        maxMidth: 120
    },
    flexSpace:{
        display:"flex",
        justifyContent:"space-between"
    },
    removeButton:{
        position: "absolute",
        background: "red",
        width: 0,
        height: 0,
        lineHeight: "41px",
        textAlign: "center",
        fontWeight: "bold"
    }
}

const prosessTimerDate = (data) =>{

    const {sessions,span} = data;
    data = data.stats;

    let barData = {labels:[],datasets:[]};
    let totalTime = 0;

    if(span === 7){
        const lastDay = new Date().getDay() + 1;
        for(let i = lastDay; i < 7 + lastDay;i++){
            barData.labels.push(dayToStr[i % 7]);
        }
    }else{

        const interval = Math.min(span, 30);
        const now = new Date().getTime();
        const step = span / interval;
        const _iv = interval - (step > 1 ? 0 : 1);

        for (let i = 0; i < interval; i++) {
            const d = new Date(now - (Math.abs(i - _iv) * step) * 864e5);
            barData.labels.push(d.getDate() + "/" + (d.getMonth() + 1));
        }
    }

    let arr = [];
    for(let props in data){
        totalTime += arr[props] = data[props] / 36e5;//6e4
        arr[props] = arr[props].toFixed(2);
    }

    for(let i = 0,len = Math.min(span, 30);i<len;i++){
        if(!arr[i]) arr[i] = 0;
    }

    barData.datasets.push({
        ...datasetStyle,
        ...getColor(),
        label:"Hours",
        data:arr
    });

    totalTime = totalTime.toFixed(2);

    return {barData,sessions,totalTime};
}

export class overview extends Component {

    constructor(){
        super();
        this.state={
            timespan:7,
            dialog: "",
            dialogValue: "",
        };
    }

    componentDidMount(){
        this.props.fetch(this.props.selected);

        api.overview.timers(this.props.selected,this.state.timespan).then(timers=>{
            this.setState(prosessTimerDate(timers));
        });
    }

    timespanChange = (e) => {
        const {value} = e.target;
        this.setState({ timespan: value });

        api.overview.timers(this.props.selected,value).then(timers=>{
            const props = prosessTimerDate(timers);
            this.setState(props);
        });
    };

    setDialog = (v = "", value = "") => {
        this.setState({dialog: v, dialogValue: value});
    }

  render() {

    if(this.props.data.id !== this.props.selected) return(
        <div className="load-spinner" />
    )

    const {doneTodoCount,noteCount,passwordCount,todoCount,isAdmin,userId} = this.props.data;
    const {barData,sessions,totalTime} = this.state;
    const {selected} = this.props;
    const proj = this.props.data.list;
    const users = proj.userIds;

    return (
        <div>
            <DialogView setDialog={this.setDialog} dialog={this.state.dialog} dialogValue={this.state.dialogValue} />
            <div style={{display:"flex",justifyContent:"space-between",padding:"0 15px"}}>
                <h2>{proj.name}</h2>
                <Link style={{textDecoration:"none",marginTop: 20}} to={"/project/"+selected+"/settings"}>
                    <Button color="primary">
                        <Icon style={{marginRight:10}}>settings</Icon>
                        Projcet Settings
                    </Button>
                </Link>
            </div>

            <div className="overview">
                <div className="row center">
                    <Paper className="chart">
                        <div>
                            <Bar
                                data={barData}
                                height={350}
                                options={{
                                    maintainAspectRatio: false
                                }}
                                // redraw
                                />
                        </div>
                        <Select
                            style={{margin:10}}
                            value={this.state.timespan}
                            onChange={this.timespanChange}
                            inputProps={{
                                name: 'timespan',
                                id: 'timespan-select',
                            }}
                        >
                            <MenuItem value={7}>Last 7 days</MenuItem>
                            <MenuItem value={28}>Last 28 days</MenuItem>
                            <MenuItem value={90}>Last 90 days</MenuItem>
                            <MenuItem value={365}>Last year</MenuItem>
                        </Select>
                    </Paper>            

                    <Paper className="chart-side">
                        <p>Total Time:</p>
                        <h4>{totalTime} <small>hours</small></h4>
                        <p>Sessions:</p>
                        <h4>{sessions}</h4>
                    </Paper>
                </div>
            </div>

            <Paper className="" style={{...s.paper,boxSizing: "border-box"}}>
                <div style={s.flexSpace}>
                    <h3>Members</h3>
                    <h3>User: {users.length}</h3>
                </div>
                <div style={s.userContent}>
                    {users.map(e=>{

                        const useAdminAction = isAdmin && e._id !== userId;
                        const onClick = useAdminAction ? ()=>{this.setDialog("REMOVE_USER",{id:selected,userId:e._id,name:e.name})} : undefined;

                        return <Avatar name={e.name} id={e._id} onClick={onClick} style={s.userItem} avatarStyle={{cursor: useAdminAction ? "pointer":"default"}} avatarChildren={useAdminAction && <Icon className="removeBtn" style={s.removeButton}>close</Icon>}>
                            <p style={{textAlign:"center",marginTop:5}}>{e._id === proj.ownerId && <Icon style={{color: "#dbb900", fontSize: 18, lineHeight: 1.25, marginRight: 2.5}}>grade</Icon>}{e.name}</p>
                        </Avatar>
                    })}
                </div>
                <div style={{display:"flex",justifyContent:"flex-end"}}>
                    <Button color="primary" onClick={()=>{this.setDialog("ADD_USER",{id:selected})}}>
                        <Icon style={{marginRight:10}}>person_add</Icon>
                        Add User
                    </Button>
                </div>
            </Paper>
            <div className="overview">

                <Paper className="paper overview-infobar">
                    <div className="infobar-item">
                        <h3>Todo</h3>
                        <h4>{todoCount} <small>todos</small></h4>
                        <h4>{doneTodoCount} <small>completed</small></h4>
                    </div>
                    <div className="infobar-item">
                        <h3>Stiky notes</h3>
                        <h4>{noteCount} <small>notes</small></h4>
                    </div>
                    <div className="infobar-item">
                        <h3>Passwords</h3>
                        <h4>{passwordCount} <small>passwords</small></h4>
                    </div>
                </Paper>
            </div>
        </div>
    )
  }
}

const getColor = () =>{

    const col = "#0072ff";


    return {
        backgroundColor: col+"99",
        borderColor: col,
        hoverBackgroundColor: col+"cc",
        hoverBorderColor: col
    }
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

const mapStateToProps = (state) => ({
    selected: state.list.index,
    data: state.overview
})


export default connect(mapStateToProps, {fetch})(overview)
