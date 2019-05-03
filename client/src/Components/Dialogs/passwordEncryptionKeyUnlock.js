import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from "../dialogPanel";
import Button from '@material-ui/core/Button';
import crypto from "crypto";

const hashingSalt = "JuBb2Wfu"
, algorithm = 'aes-256-gcm';

export default class PasswordEncryptionKey extends Component {
    constructor(props){
      super(props);
      
      this.state = {
        open: true,
        value: ""
      };
    }
  
    onChange = (e)=>{ 
      let v = this.state.value;
      v = e.target.value;
      this.setState({value:v,error:""});
    }
  
    handleClose = () => {
      this.setState({open: false});
      setTimeout(() => this.props.onClose(),200);
    };
  
    handleSubmit = () =>{

      const {value} = this.state;
      
      if(value.length < 1) return;
      
      const {cipher,rawOutput} = this.props;

      let key = crypto.createHash("sha256").update(hashingSalt + value).digest("hex");
      let pass = Buffer.from(key,"hex");

      let iv =  new Buffer(cipher.slice(0,24),"base64");
      let tag = new Buffer(cipher.slice(-24),'base64');
      const encrypted = cipher.slice(24,-24);

      let decipher = crypto.createDecipheriv(algorithm, pass, iv);

      decipher.setAuthTag(tag);
      
      try{
        let dec = decipher.update(encrypted, 'base64',"utf8");
        dec +=  decipher.final('utf8');
  
        this.props.onSubmit( !rawOutput ? {
            phrase:dec,
            listId:this.props.listId
          }:{
            key,
            listId:this.props.listId
          }
        );

        this.handleClose(); 
        
      }catch(err){
        console.log(err);
        this.setState({
          error:"Invalid Key"
        })
      }
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
          
          disabled={this.state.value.length < 1}
          onClick={this.handleSubmit}
        >{this.props.buttonText}</Button>,
      ];
  
      const content = [
        <p>{this.props.text}</p>,
        <p>{this.state.note}</p>,
        <TextField type="password" helperText={this.state.error} autoFocus placeholder={this.props.placeholder} onChange={(e)=>this.onChange(e)} fullWidth={true} disabled={this.props.disabled} />,
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
  