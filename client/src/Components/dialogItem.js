import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import FlatButton from '@material-ui/core/FlatButton';
import RaisedButton from '@material-ui/core/RaisedButton';

export default class DialogItem extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      open: true,
      value:""
    };

    this.onChange = this.onChange.bind(this);
  }

  handleClose = (d) => {
    this.setState({open: false});
    setTimeout(() => this.props.onClose(),200);
    if(d) this.props.onSubmit(d);
  };

  onChange = (e)=>{
    this.setState({value:e.target.value});
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <RaisedButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        disabled={this.state.value.length < 1}
        onClick={()=>{this.handleClose(this.state.value)}}
      />,
    ];

    return (
    <Dialog
        title={this.props.title}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
    >
        <this.props.content onChange={this.onChange}/>
    </Dialog>
    );
  }
}