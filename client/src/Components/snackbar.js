import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

export default class SnackbarComp extends React.Component {

    state={
        open:false,
    }

    handleClose = () => {
        this.setState({ open: false }); 
    };

    display(message,action){
        this.setState({message,action,open:true});
    }

    render(){
        
        const {open,message,action} = this.state;

        return(
            <Snackbar
                anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
                open={open}
                autoHideDuration={4000}
                onClose={this.handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}

                message={message}
                action={action}
                />
        )
    }
}