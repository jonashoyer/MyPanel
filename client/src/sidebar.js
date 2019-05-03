import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Icon from '@material-ui/core/Icon';
import AppBar from '@material-ui/core/AppBar';
import { Link } from "react-router-dom";
import Divider from '@material-ui/core/Divider';
import ListSelect from "./Components/listSelect";
import * as actions from './actions/auth';
import {connect} from "react-redux";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { ListItemText, ListItemIcon } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';

import Footer from "./Components/footer";

const drawerWidth = 250;

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        position: 'relative',
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawerPaper: {
        position:"fixed",
        zIndex: 1200,
        width: drawerWidth,
        paddingTop:64
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        minWidth: 0, // So the Typography noWrap works
    },
    drawerHeader: {
        marginTop: 64,
    },
        menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    container:{
        background:theme.palette.background.default,
        color: theme.palette.text.primary,
    },
    textDecoration:{
        textDecoration: "none",
        color: theme.palette.primary.main
    },
    grayOption: {
        textDecoration: "none",
        color:"gray",
        cursor:"default"
    },
    iconStyle: {
        color: theme.palette.text.primary,
        textDecoration: "none",
        flexShrink: 0,
        marginRight: 16
    }
});


const menuitemStyle={
    margin: "none"
}

class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false,width: 0, height: 0};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
      
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handleOpen = () => this.setState({open: true});

    handleClose = () => this.setState({open: false});

    handleToggle = () => this.setState({open: !this.state.open});

    render() {

        const {width} = this.state;
        const { classes,selected,isAuthenticated } = this.props;
        const permanent = width > 1250;
        const validProj = "undefined" !== selected; 
        const {textDecoration,grayOption,iconStyle} = classes;
        

        const drawer = (
            <Drawer
                variant={permanent ? "permanent" : "temporary"}
                classes={{ paper: classes.drawerPaper, }}
                open={this.state.open}
                onClose={this.handleClose}
            >
                {!permanent && [<List>
                    <Link className={textDecoration} to="#">
                        <ListItem button onClick={this.handleClose}>
                            <ListItemIcon>
                                <Icon className={iconStyle} >chevron_left</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Close" />
                        </ListItem>
                    </Link>
                </List>,
                <Divider />
                ]}
                <List>
                    <Link className={textDecoration} to="/">
                        <ListItem button  onClick={this.handleClose}>
                            <ListItemIcon>
                                <Icon className={iconStyle} >home</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Projects" />
                        </ListItem>
                    </Link>
                    <Link className={textDecoration} to="/user/overview">
                        <ListItem button  onClick={this.handleClose}>
                            <ListItemIcon>
                                <Icon className={iconStyle} >show_chart</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Overview" />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
                {isAuthenticated && <ListSelect /> }
                {isAuthenticated && [
                    <List>
                        <Link className={validProj ? textDecoration : grayOption} to={validProj ? "/project/"+selected+"/todo" : "#"}>
                            <ListItem button={validProj} onClick={this.handleClose}>
                                <ListItemIcon>
                                    <Icon className={iconStyle} >assignment</Icon>
                                </ListItemIcon>
                                <ListItemText primary="Todo" />
                            </ListItem>
                        </Link>

                        <Link className={validProj ? textDecoration : grayOption} to={validProj ? "/project/"+selected+"/sticky-notes" : "#"}>
                            <ListItem button={validProj} onClick={this.handleClose}>
                                <ListItemIcon>
                                    <Icon className={iconStyle} >note</Icon>
                                </ListItemIcon>
                                <ListItemText primary="Sticky Notes" />
                            </ListItem>
                        </Link>
                        
                        <Link className={validProj ? textDecoration : grayOption} to={validProj ? "/project/"+selected+"/passwords" : "#"}>
                            <ListItem button={validProj} onClick={this.handleClose}>
                                <ListItemIcon>
                                    <Icon className={iconStyle} >lock</Icon>
                                </ListItemIcon>
                                <ListItemText primary="Passwords" />
                            </ListItem>
                        </Link>
                        <Link className={validProj ? textDecoration : grayOption} to={validProj ? "/project/"+selected+"/timers" : "#"}>
                            <ListItem button={validProj} onClick={this.handleClose}>
                                <ListItemIcon>
                                    <Icon className={iconStyle} >timer</Icon>
                                </ListItemIcon>
                                <ListItemText primary="Timers" />
                            </ListItem>
                        </Link>
                    </List>,
                    <Divider />,
                    <List>
                        <Link className={textDecoration} to="/settings">
                            <ListItem button onClick={this.handleClose}>
                                <ListItemIcon>
                                    <Icon className={iconStyle} >settings</Icon>
                                </ListItemIcon>
                                <ListItemText primary="Settings" />
                            </ListItem>
                        </Link>
                        <Link className={textDecoration} to="/">
                            <ListItem button onClick={this.props.logout}>
                                <ListItemIcon>
                                    <Icon className={iconStyle} >exit_to_app</Icon>
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </Link>
                    </List>
                ]}
                
                {isAuthenticated || (
                    <List>
                        <Link className={textDecoration} to="/plans">
                            <ListItem button>
                                <ListItemIcon>
                                    <Icon className={iconStyle} >credit_card</Icon>
                                </ListItemIcon>
                                <ListItemText primary="Plans" />
                            </ListItem>
                        </Link>
                        <Link className={textDecoration} to="/login">
                            <ListItem button>
                                <ListItemIcon>
                                    <Icon className={iconStyle} >label</Icon>
                                </ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItem>
                        </Link>
                    </List>
                )}

            </Drawer>
        )

        return (
            <div className={classes.root}> 
                <AppBar
                    position="fixed"
                    className={classes.appBar}
                >
                    <Toolbar>
                       {!permanent && <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={this.handleToggle}
                        className={classes.menuButton}
                        >
                            <Icon>menu</Icon>
                        </IconButton>}
                        <Link to="/" style={{ textDecoration: 'none',color:"#fff",flex: 1}}>
                            <Typography variant="title" color="inherit" noWrap style={{lineHeight:1.5}}>
                                <Icon style={{fontSize: 26,lineHeight: 1.333, marginRight: "1rem"}}>apps</Icon>
                                My Panel
                            </Typography>
                        </Link>
                    </Toolbar>
                </AppBar>
                {isAuthenticated && drawer}
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <div style={{marginLeft: permanent ? (isAuthenticated ? drawerWidth : 0) : 0}} className={classes.container}>
                        <div style={{minHeight:"calc(100vh - 64px )",paddingTop: 1}}>
                            {this.props.children}
                        </div>
                        <Footer />
                    </div>
                </main>
            </div>
        );
    }
}

function toTitleCase(str) {
    if(!str) return null;
    return str.replace(/\w\S*/g, txt => {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

const mapStateToProps = (state)=>{
    return {
        isAuthenticated: !!state.user.token,
        name: !state.user.token || (state.user && toTitleCase(state.user.name)),
        selected: state.list.index
    }
}

export default connect(mapStateToProps,{logout: actions.logout})(withStyles(styles) (SideBar));