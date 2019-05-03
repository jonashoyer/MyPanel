import React, { Component } from 'react';
import { connect } from 'react-redux'
import "../styles/toggle.scss";

import Toggle from 'react-toggle'
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';
import api from "../api";
import DialogView from "../Components/dialog";

const tiers = ["Free","Premium","Enterprice"]


class Settings extends Component {
    state={}

    onSettingChange = (event) =>{
        const {name, checked} = event.target;
        const {selected} = this.props;
        api.setting.set(selected,name,checked).then(()=>{

        })
    }

    componentDidMount(){
        // api.setting.fetch(this.props.selected).then( settings => {
        //     this.setState({settings});
        // })
        
    }

    onEncryptionChange = e => {
        const {name, checked} = e.target;
        const {selected,lists} = this.props;

        if(!lists) return null;
        const list = lists.find(x=>x._id === selected);

        

        if(checked){

            if(list.encryption){
                this.setDialog("COFIRME_KEY",{...list.encryption,listId:selected});
            }else{
                this.setDialog("CREATE_KEY",selected);
            }

        }else{
            this.setDialog("REMOVE_KEY",{...list.encryption,listId:selected})
        }
    }

    setDialog = (v = "", value = "") => {
        this.setState({dialog: v, dialogValue: value});
    }

    render() {


        const {lists,selected} = this.props;
        let {settings} = this.state;

        const tier = 0;

        const list = lists.find(x=>x._id === selected);
        console.log(settings);
        
        
        if(!list){
            return null;
        }

        settings = {
            ...settings,
            encryption: list.encryptionStatus
        }

        const toggleProps = {onChange:this.onSettingChange,currTier:tier};

        return (
            <div>
                <DialogView setDialog={this.setDialog} dialog={this.state.dialog} dialogValue={this.state.dialogValue} />

                <div className="settings-content">

                    <div style={{textAlign:"center",position:"relative"}}>
                        <Link style={{textDecoration:"none",marginTop: 20,position:"absolute",left:0}} to={"/project/"+selected+"/overview"}>
                            <Button color="primary">
                                <Icon style={{marginRight:10}}>arrow_back_ios</Icon>
                                Back to project overview
                            </Button>
                        </Link>
                        <h2>{list.name}</h2>
                        <h4>Project Settings</h4>
                    </div>

                    {!settings && <div className="load-spinner" />}

                    {settings && <div>
                        <Paper className="setting-collection">
                            <h3>Project</h3>
                            <div className="settings-row">
                                <SettingToggle onChange={this.onEncryptionChange} name="project-encrytion" text="Encrypt project" state={settings.encryption == "encrypted"} requiredTier={0} />
                                <div className="setting-item">
                                    <Button style={{margin:"auto"}} color="secondary">Change Encryption Key</Button>
                                </div>
                            </div>
                            <div className="settings-row">
                            </div>
                        </Paper>

                        <Paper className="setting-collection">
                            <h3>Admin</h3>
                            <div className="settings-row">
                                <SettingToggle {...toggleProps} name="worker-invite" text="Non-admins can invite" state={true}  requiredTier={1} />
                                <SettingToggle {...toggleProps} name="worker-invite" text="Non-admins can view overview panel" state={true}  requiredTier={1} />
                            </div>
                            <div className="settings-row">
                                <SettingToggle {...toggleProps} name="???" text="????" state={true} />
                            </div>
                        </Paper>

                        <Paper className="setting-collection">
                            <h3>Who can add items</h3>
                            <div className="settings-row">
                                <SettingToggle {...toggleProps} name="worker-add-todo" text="Non-admins can add todos" state={true} requiredTier={2} />
                                <SettingToggle {...toggleProps} name="worker-add-notes" text="Non-admins can add sticky notes" state={true} requiredTier={2} />
                            </div>
                            <div className="settings-row">
                                <SettingToggle {...toggleProps} name="worker-add-password" text="Non-admins can add passwords" state={true} requiredTier={2} />
                                <SettingToggle {...toggleProps} name="worker-add-timers" text="Non-admins can add timers" state={true} requiredTier={2} />    
                            </div>
                            <div className="settings-row">
                                <SettingToggle {...toggleProps} name="worker-add-tags" text="Non-admins can add tags" state={true} requiredTier={2} />
                            </div>
                        </Paper>

                        <Paper className="setting-collection">
                            <h3>Who can edit items</h3>
                            <div className="settings-row">
                                <SettingToggle {...toggleProps} name="worker-edit-todo" text="Non-admins can edit todos" state={true} requiredTier={2} />
                                <SettingToggle {...toggleProps} name="worker-edit-notes" text="Non-admins can edit sticky notes" state={true} requiredTier={2} />
                            </div>
                            <div className="settings-row">
                                <SettingToggle {...toggleProps} name="worker-edit-password" text="Non-admins can edit passwords" state={true} requiredTier={2} />
                                <SettingToggle {...toggleProps} name="worker-edit-timers" text="Non-admins can edit timers" state={true} requiredTier={2} />                  
                            </div>
                        </Paper>  

                        <Paper className="setting-collection">
                            <h3>Who can delete items</h3>  
                            <div className="settings-row">
                                <SettingToggle {...toggleProps} name="worker-delete-todo" text="Non-admins can delete todos" state={true} requiredTier={2} />
                                <SettingToggle {...toggleProps} name="worker-delete-notes" text="Non-admins can delete sticky notes" state={true} requiredTier={2} />
                            </div>
                            <div className="settings-row">
                                <SettingToggle {...toggleProps} name="worker-delete-password" text="Non-admins can delete passwords" state={true} requiredTier={2} />
                                <SettingToggle {...toggleProps} name="worker-delete-timers" text="Non-admins can delete timers" state={true} requiredTier={2} />      
                            </div>
                            <div className="settings-row">
                                <SettingToggle {...toggleProps} name="worker-delete-tags" text="Non-admins can delete tags" state={true} requiredTier={2} />
                            </div>
                        </Paper>  

                        <Paper className="setting-collection">
                            <h3>Access</h3>
                            <div className="settings-row">
                                <SettingToggle {...toggleProps} name="worker-view-timers" text="Non-admins can only see there own timers" state={false} requiredTier={2} />
                            </div>
                            <div className="settings-row">
                            </div>
                            <div className="settings-row">
                            </div>
                        </Paper>   
                    </div>}             
                    
                </div>
                
            </div>
        );
    }
}

const SettingToggle = ({name,text,state,currTier,requiredTier,onChange}) =>(
    <div className="setting-item">
        <Toggle
            name={name}
            icons={false}
            checked={state}
            disabled={currTier < requiredTier}
            onChange={onChange} />
        <label style={{verticalAlign:"middle",lineHeight:1.5}}>{text}  
            {currTier < requiredTier && <span className="settings-tier-tag">{tiers[requiredTier]} feature</span>}
        </label>
    </div>
)



const mapStateToProps = (state) => ({
    selected: state.list.index,
    lists:state.list.lists
})


export default connect(mapStateToProps,{}) (Settings);