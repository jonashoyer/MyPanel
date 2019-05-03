import React, { Component } from 'react';
import Icon from '@material-ui/core/Icon';
import {SortableHandle } from 'react-sortable-hoc';

export default SortableHandle((props) => <Icon {...props} style={{...props.style,marginRight:25, color:"#a8a8a8"}}>drag_handle</Icon>);