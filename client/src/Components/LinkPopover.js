import React, { Component } from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from "@material-ui/core/Typography";

export default ({anchorEl,onClose,url}) => (
    <Popover open={!!anchorEl} onClose={onClose} anchorEl={anchorEl} style={{zIndex:1000}} 
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }} transformOrigin={{ vertical: 'top', horizontal: 'center'}}
    PaperProps={{style:{padding:"8px 32px"}}}
    >
    <Typography>
        <span>Link to </span>
        <a
        href={url}
        target="_blank"
        >{url}</a>
    </Typography>
    </Popover>
)