import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DialogPanel = ({open, handleClose, fullWidth, title, content, actions, width, onSubmit,submitHelper}) => {
    return(
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={fullWidth}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <form onSubmit={(e)=>{e.preventDefault();onSubmit()}}>
          <DialogTitle id="dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="dialog-description">{content}</DialogContentText>
          </DialogContent>
          <DialogActions>
              {actions}
              {submitHelper && <input className="submit-helper" autoFocus />}
          </DialogActions>
        </form>
      </Dialog>
    )
}

export default DialogPanel;