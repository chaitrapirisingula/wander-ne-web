import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { auth, logInWithEmailAndPassword } from '../Data/firebase';
import ResetPasswordModal from './ResetPasswordModal';
import SignUpModal from './SignUpModal';
import '../Design/App.css';

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (loading) return;
        if (user) navigate('/profile');
      }, [user, loading]);

    return (
        <Box display="grid" justifyContent="center">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Profile</title>
            </Helmet>
            {error ? <Alert severity='error'>An error occurred!</Alert> : ''}
            <Box padding={5} display="grid" justifyContent="center" gap={2}>
                <Typography variant='h3' textAlign="center">Login</Typography>
                <TextField id='outlined-search' label='Email' type='email'
                onChange={(event) => {setEmail(event.target.value)}}/>
                <TextField id='outlined-password-input' label='Password' type='password'
                autoComplete='current-password' onChange={(event) => {setPassword(event.target.value)}}/>
                <Box display="grid" justifyContent="center" gap={1}>
                    <Button variant='outlined' disabled={email === '' || password === ''}
                    onClick={() => logInWithEmailAndPassword(email, password)}>Login</Button>
                    <ResetPasswordModal/>
                </Box>
            </Box>
            <Box padding={2} display="grid" justifyContent="center">
                <Typography variant='h4'>Interested?</Typography>
                <p>Add interest card here</p>
                <SignUpModal/>
            </Box>
        </Box>
    );
};