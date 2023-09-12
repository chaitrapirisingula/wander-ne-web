import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, logout } from '../Data/firebase';
import { Box, Alert, Stack, Typography } from '@mui/material';
import AlertModal from '../Components/AlertModal';
import Loading from '../Components/Loading';

export default function SiteProfile( { mobileView } ) {

    const navigate = useNavigate();

    const [user, loading, error] = useAuthState(auth);
    const [photoURL, setPhotoURL] = useState('');
    const [site, setSite] = useState({});
    const [infoLoading, setInfoLoading] = useState(true);

    const fetchSiteInfo = async () => {
        try {
            const q = query(collection(db, 'test_sites'), where('owner_id', '==', user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setSite(data);
        } catch (err) {
            console.error(err);
            alert('An error occured while fetching site data');
        } finally {
            setInfoLoading(false);
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate('/login');
        setInfoLoading(true);
        fetchSiteInfo();
    }, [user, loading]);
  
    return (
        <div className='profile'>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Profile</title>
            </Helmet>
            {error ? <Alert severity='error'>An error occurred!</Alert> : <></>}
            {infoLoading ? <Loading /> : 
            <Box display="grid" justifyContent="center" padding={2}>
                <Stack>
                    <Box display="grid" justifyContent="center">
                        <Typography variant='h2' textAlign="center">{site.name}</Typography>
                    </Box>
                    <Box display="grid" justifyContent="center">
                        <Typography variant='h5'>{user.email}</Typography>
                    </Box>
                    <Box display="grid" justifyContent="center">
                        <AlertModal title={'Logout'} 
                        description={'Are you sure you want to logout?'} 
                        handleClick={logout}/>
                    </Box>
                </Stack>
                <Box>
                    {site.description}
                </Box>
            </Box>
            }
            
        </div>
    );
};