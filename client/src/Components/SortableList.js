import React, {Component} from 'react';
import {render} from 'react-dom';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
  SortableHandle,
} from 'react-sortable-hoc';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const SortableItem = SortableElement(({child}) => {
  return child;
});

const SortableList = SortableContainer(({children}) => {
  // style={{margin:"0 12px"}} 
  console.log(children)
  return (
    <List>
      {children.map((value, index) => (
        <SortableItem key={index} index={index} child={value} />
      ))}
    </List>
  );
});


export default class SortableComponent extends Component {
  render() {
    console.log(this.props);
    return <SortableList lockToContainerEdges useDragHandle lockAxis="y" helperClass="sort-item" {...this.props} />;
  }
}