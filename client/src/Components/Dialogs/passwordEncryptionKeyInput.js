import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from "../dialogPanel";
import Button from '@material-ui/core/Button';
import crypto from "crypto";

const hashingSalt = "JuBb2Wfu";

export default class PasswordEncryptionKey extends Component {
    constructor(props){
      super(props);
      
      this.state = {
        open: true,
        value: ["",""]
      };
    }
  
    onChange = (e,i)=>{ 
      let v = this.state.value;
      v[i] = e.target.value;
      this.setState({value:v,error:""});
    }
  
    handleClose = () => {
      this.setState({open: false});
      setTimeout(() => this.props.onClose(),200);
    };
  
    handleSubmit = () =>{

      const {value} = this.state;

      if(value[0].length < 1 || value[1].length < 1) return;
      if(value[0] !== value[1]) return this.setState({
          error:"Inputs not the same!"
      });

      let hash = crypto.createHash("sha256").update(hashingSalt + value[0]).digest("hex");
      
      this.props.onSubmit(hash);
      this.handleClose(); 
    }
  
  
    render() {
      const actions = [
        <Button
          color="secondary"
          onClick={this.handleClose}
        >Cancel</Button>,
        <Button
          variant="raised"
          color="primary"
          
          disabled={this.state.value[0].length < 1 || this.state.value[1].length < 1}
          onClick={this.handleSubmit}
        >{this.props.buttonText}</Button>,
      ];
  
      const content = [
        <p>{this.props.text}</p>,
        <TextField type="password" helperText={this.state.error} autoFocus placeholder={this.props.placeholder[0]} onChange={(e)=>this.onChange(e,0)} fullWidth={true} disabled={this.props.disabled} />,
        <TextField type="password" helperText={this.state.error} style={{marginTop:"1rem"}} placeholder={this.props.placeholder[1]} onChange={(e)=>this.onChange(e,1)} fullWidth={true} disabled={this.props.disabled} />
      ];
  
      return (
          <Dialog
              title={this.props.title}
              actions={actions}
              open={this.state.open}
              handleClose={this.handleClose}
              content={content}
              fullWidth
              onSubmit={this.handleSubmit}
              width={this.props.width}
          />
      );
    }
  }
  