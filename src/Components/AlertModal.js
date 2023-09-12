import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';

export default function AlertModal( { title, description, handleClick } ) {

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button color='error' sx={{ fontSize: 18 }} startIcon={<LogoutIcon sx={{ width: 22, height: 22 }}/>} 
                onClick={handleClickOpen}>{title}</Button> 
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'>
                <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
                <DialogContent>
                <DialogContentText id='alert-dialog-description'>{description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button color='error' onClick={handleClick} autoFocus>{title}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};