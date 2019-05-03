import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export const EmptyContent = props => (
    <div style={{textAlign:"center",marginBottom:"4rem"}}>
        <Typography variant="headline">
            No items was found
        </Typography>
        <Typography variant="subheading" gutterBottom>
            There is nothing to see here
        </Typography>
        <Button size="large" variant="contained" color="primary" onClick={props.onClick}>{props.buttonText || "Create a new element"}</Button>
    </div>
);

export const EncryptedContent = props => (
    <div style={{textAlign:"center",marginBottom:"4rem"}}>
        <Typography variant="headline">
            Project is Encrypted
        </Typography>
        <Typography variant="subheading" gutterBottom>
            Unlock the data, by decrypting the project using the secret key
        </Typography>
        <Button size="large" variant="contained" color="primary" onClick={props.onClick}>{props.buttonText || "Decrypt Project"}</Button>
    </div>
)

export const CreateKeyContent = props => (
    <div style={{textAlign:"center",marginBottom:"4rem"}}>
        <Typography variant="headline">
            Encryption Needed!
        </Typography>
        <Typography variant="subheading" gutterBottom>
            Create a Encryption key, to encrypt your data
        </Typography>
        <Button size="large" variant="contained" color="primary" onClick={props.onClick}>{props.buttonText || "Create Encryption Key"}</Button>
    </div>
)