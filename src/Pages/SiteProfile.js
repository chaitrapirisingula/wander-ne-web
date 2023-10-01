import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { query, collection, getDoc, getDocs, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Box, Button, Alert, Stack, Typography, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { auth, db, logout } from '../Data/firebase';
import AlertModal from '../Components/AlertModal';
import Loading from '../Components/Loading';
import WanderNebraskaLogo from '../Images/WanderNebraskaLogo.png';
import AddressCard from '../Components/AddressCard';
import HoursCard from '../Components/HoursCard';
import '../Design/Site.css';
import EventsList from '../Components/EventsList';

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
            <Box display="grid" justifyContent="center">
                <Stack>
                    <img className="site_image" src={site.image || WanderNebraskaLogo} alt={site.name}></img>
                    <Box display="grid" justifyContent="center">
                        <Typography variant='h2' textAlign="center">{site.name}</Typography>
                    </Box>
                    <Box display="grid" justifyContent="center">
                        <Typography variant='h5'>{user.email}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" gap={2}>
                        <AlertModal title={'Logout'} 
                        description={'Are you sure you want to logout?'} 
                        handleClick={logout}/>
                        <Button sx={{ fontSize: 18 }} startIcon={<EditIcon sx={{ width: 22, height: 22 }}/>} 
                        onClick={() => navigate('/profile/edit')}>Edit</Button> 
                    </Box>
                </Stack>
                <Box padding={2}>
                    <Stack direction={mobileView ? 'column' : 'row'} gap={2} justifyContent='center'>
                        <AddressCard currSite={site} mobileView={mobileView} />
                        <Box display="grid" justifyContent="center">
                            <HoursCard currSite={site} mobileView={mobileView}/>
                        </Box>
                    </Stack>
                    <br/>
                    <Typography component='div' variant='h5' sx={{ bgcolor: 'background.paper' }} padding={2}>
                        <Box display='inline' sx={{ fontWeight: 'bold' }}>Description: </Box>
                        {site.description}
                        <br/><br/>
                        <Box display='inline' sx={{ fontWeight: 'bold' }}>Category: </Box>
                        {site.type}
                    </Typography>
                    <br/>
                    {events ? <EventsList events={events} /> : <></>}
                </Box>
            </Box>}
        </div>
    );
};