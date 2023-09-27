import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { query, collection, getDoc, getDocs, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Box, Alert, Stack, Typography, Link } from '@mui/material';
import { auth, db, logout } from '../Data/firebase';
import { days } from '../Data/Constants';
import AlertModal from '../Components/AlertModal';
import Loading from '../Components/Loading';

export default function SiteProfile( { mobileView } ) {

    const navigate = useNavigate();

    const [user, loading, error] = useAuthState(auth);
    const [infoLoading, setInfoLoading] = useState(true);
    const [site, setSite] = useState({});
    const [events, setEvents] = useState([]);

    const fetchSiteInfo = async () => {
        try {
            const q = query(collection(db, 'test_sites'), where('owner_id', '==', user?.uid));
            const querySnaphot = await getDocs(q);
            const doc = querySnaphot.docs[0];
            const data = {id: doc.id, ...doc.data()};
            let events = new Array();
            data.events_ref.forEach(async (doc) => {
                let event = await getDoc(doc);
                if (event.exists()) {
                    events.push({id: event.id, ...event.data()});
                    setEvents(events);
                }
            });
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
                    <Typography component='div' variant='h5'>
                        <Box display='inline' sx={{ fontWeight: 'bold' }}>Address: </Box>
                        {site.streetAddress + ', ' + site.city + ' ' + site.state + ', ' + site.zipCode}
                    </Typography>
                    <Typography component='div' variant='h5'>
                        <Box display='inline' sx={{ fontWeight: 'bold' }}>Hours: </Box>
                        {site.hours.map((times, i) => 
                            <Typography variant='h6' key={i}>{days[i] + ': ' + times}</Typography>
                        )}
                    </Typography>
                    <Typography component='div' variant='h5'>
                        <Box display='inline' sx={{ fontWeight: 'bold' }}>Description: </Box>
                        {site.description}
                    </Typography>
                    {events ? 
                    <Typography component='div' variant='h5'>
                        <Box display='inline' sx={{ fontWeight: 'bold' }}>Events: </Box>
                        {events.map((event) => 
                            <Typography variant='h6' key={event.id}>
                                {event.name}
                                {event.description}
                                {event.date.toDate().toDateString()}
                            </Typography>
                        )}
                    </Typography>: <></>}
                    {site.phone ? 
                    <Typography component='div' variant='h5'>
                        <Box display='inline' sx={{ fontWeight: 'bold' }}>Phone: </Box>
                        {site.phone}
                    </Typography> : <></>}
                    {site.socialMedia ?
                    <Typography component='div' variant='h5'>
                        <Box display='inline' sx={{ fontWeight: 'bold' }}>Social Media: </Box>
                        <Link href={site.website} target="_blank" rel="noreferrer">{site.socialMedia}</Link>
                    </Typography> : <></>}
                    {site.website ?
                    <Typography component='div' variant='h5'>
                        <Box display='inline' sx={{ fontWeight: 'bold' }}>Website: </Box>
                        <Link href={site.website} target="_blank" rel="noreferrer">{site.website}</Link>
                    </Typography> : <></>}
                    <Typography component='div' variant='h5'>
                        <Box display='inline' sx={{ fontWeight: 'bold' }}>Category: </Box>
                        {site.type}
                    </Typography>
                </Box>
            </Box>}
        </div>
    );
};