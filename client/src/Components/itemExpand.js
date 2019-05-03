import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import Icon from "@material-ui/core/Icon";
import Divider from '@material-ui/core/Divider';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    title: {
        fontSize: "1rem"
    },
    subtext:{
        fontSize: "1rem",
        color: theme.palette.text.secondary,
    }
  });
const Timers = (props) => {

    return(
        <ExpansionPanel>
            <ExpansionPanelSummary  expandIcon={<Icon>expand_more</Icon>}>
                <div style={{width:"100%"}} className="space-between">
                    <Typography className={props.classes.title}>{props.title}</Typography>
                    {  (props.subtext || props.chip) &&
                        <div className="space-between" style={{width:125}}>
                            {props.subtext && <Typography className={props.classes.subtext}>{props.subtext}</Typography>}
                            {props.chip && (props.chip)}
                        </div>
                    }
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{padding:"8px 24px 0"}}>
                {props.children}
            </ExpansionPanelDetails>
            {props.actions &&
            <div>
                <Divider />
                <ExpansionPanelActions>
                    {props.actions}
                </ExpansionPanelActions>
            </div>
            }
        </ExpansionPanel>
        // <ListItem
        //     key={this.props.key}
        //     ref={this.ref}
        //     leftIcon={this.props.icon}
        //     className={"item-expand"}
        //     style={style}
        //     children={this.props.children}
        //     onClick={this.toggle}
        //     rightIconButton={this.props.menu}
        // />
    )
}

export default withStyles(styles) (Timers);