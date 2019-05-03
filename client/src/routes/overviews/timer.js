import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Bar, Doughnut} from 'react-chartjs-2';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import api from "../../api"; 

import colors from "../../utils/colors";

const datasetStyle = {
    stack:true,
    borderWidth: 1,
}
//rgb(0,145,234,$)
//rgb(213,0,0,$)
//rgb(100,221,23,$)
//rgb(255,214,0,$)

//rgb(98,0,234,$)
//rgb(0,191,165,$)
//rgb(69,90,100,$)
const getColor = (index) =>{


    const col = colors[index % colors.length];

    return {
        backgroundColor: col+"99",
        borderColor: col,
        hoverBackgroundColor: col+"cc",
        hoverBorderColor: col
    }
}

const dayToStr = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const numToTime = (num) => {

    const hours = Math.floor(num);
    const min = Math.floor((num % 1) * 60);
    return hours +":"+(min < 10 ? "0"+min:min);
}


export default class TimerOverview extends Component {

    constructor(){
        super();
        this.state = {
            timespan: 7,
            barData: {},
            sessions: "-",
            totalTime: "-",
            projTime: {},
        };

        this.barChart = React.createRef();
    }

    componentDidMount(){
        api.time.overview(this.props.active,this.state.timespan).then(this.processData);
    }

    
    processData = (data)=>{
    
        const sessions = data.sessions;
        data = data.stats;

        let barData = {labels:[],datasets:[]};
        let totalTime = 0;
        let projTime = {};

        const {timespan} = this.state;
    
        if(timespan === 7){
            const lastDay = new Date().getDay() + 1;
            for(let i = lastDay; i < 7 + lastDay;i++){
                barData.labels.push(dayToStr[i % 7]);
            }
        }else{

            const interval = Math.min(timespan, 30);
            const now = new Date().getTime();
            const step = timespan / interval;
            const _iv = interval - (step > 1 ? 0 : 1);

            for (let i = 0; i < interval; i++) {
                const d = new Date(now - (Math.abs(i - _iv) * step) * 864e5);
                barData.labels.push(d.getDate() + "/" + (d.getMonth() + 1));
            }
        }

        let index = 0;
        for(let key in data){
            if(isEmpty(data[key])) continue;

            let arr = [];
            let total = 0;
            for(let props in data[key]){
                total += arr[props] = data[key][props] / 36e5;//6e4
                arr[props] = arr[props].toFixed(2);
            }

            for(let i = 0;i<timespan;i++){
                if(!arr[i]) arr[i] = 0;
            }

            totalTime += projTime[key] = total;

            barData.datasets.push({
                ...datasetStyle,
                ...getColor(index),
                label:key,
                data:arr
            });

            index++;
        }

        
        let dougData = {labels:[],datasets:[{data:[],backgroundColor:[],borderColor:[],hoverBackgroundColor:[],hoverBorderColor:[],borderWidth:[]}]};
        index = 0;
        for(let props in projTime){
            dougData.labels.push(props);
            dougData.datasets[0].data.push(projTime[props].toFixed(2));

            const col = colors[index % colors.length];
            
            dougData.datasets[0].borderWidth.push(1);
            dougData.datasets[0].backgroundColor.push(col+"99");
            dougData.datasets[0].borderColor.push(col+"ff");
            dougData.datasets[0].hoverBackgroundColor.push(col+"cc");
            dougData.datasets[0].hoverBorderColor.push(col+"ff");            
            index++;
        }

        this.setState({barData,totalTime: totalTime.toFixed(2),projTime,sessions,dougData});        
    }

    timespanChange = event => {
        
        const {value} = event.target;
        this.setState({ timespan: value });

        api.time.overview(this.props.active,value).then(this.processData);
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.checked });
      };

  render() {

    const {sessions, barData, totalTime, dougData, projTime} = this.state;

    const projectTimes = Object.keys(projTime).map(key => {
        return <div>
                <p>{key}:</p>
                <h4>{numToTime(projTime[key])} <small>hours</small></h4>
            </div>
    });

    return (
    //   <Paper className="page-paper" elevation={4}>
    <div>

        <div className="list-header">
            <h3>Personale Overview</h3>
        </div>

        <div className="overview row">

            <Paper className="chart">
                <div>
                    <Bar
                    data={barData}
                    height={350}
                    options={{
                        tooltips: {
                            callbacks: {
                                label: (tooltipItem)=> {
                                    return numToTime(Number(tooltipItem.yLabel)) + " hours";
                                },
                                title: (tooltipItem)=> {
                                    const data = barData.datasets[tooltipItem[0].datasetIndex];
                                    return data && data.label;
                                }
                            }
                        },
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [{
                                
                            }],
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                },
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: "Hours",
                                },
                                time: {
                                    displayFormats: {
                                        unit: 'hour'
                                    }
                                }
                            }]
                        }
                    }}
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
                <h4>{numToTime(totalTime)} <small>hours</small></h4>
                <p>Sessions:</p>
                <h4>{sessions}</h4>
            </Paper>

        </div>

        {Object.keys(projTime).length > 1 &&<div className="overview row">
            <Paper className="chart">
                <Doughnut
                data={dougData}
                options={{
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem)=> {
                                const index = tooltipItem.index;
                                const value = dougData.datasets[0].data[index];
                                const perc = ((value/totalTime)*100).toFixed(2);
                                return numToTime(Number(value)) + " hours ("+perc+"%)";
                            },
                            title: (tooltipItem)=> {
                                const index = tooltipItem[0].index;
                                const label = dougData.labels[index];
                                return label;
                            }
                        }
                    },
                }}
                />
            </Paper>


            
            <Paper className="chart-side">
                {projectTimes}
            </Paper>
        </div>}
    </div>
    //   </Paper>
    )
  }
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

