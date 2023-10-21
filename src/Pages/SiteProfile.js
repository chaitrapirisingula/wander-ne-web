import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { query, collection, getDoc, getDocs, where } from 'firebase/firestore';
import { Box, Stack, Typography, } from '@mui/material';
import { db } from '../Data/firebase';
import Loading from '../Components/Loading';
import WanderNebraskaLogo from '../Images/WanderNebraskaLogo.png';
import AddressCard from '../Components/AddressCard';
import HoursCard from '../Components/HoursCard';
import EventsList from '../Components/EventsList';
import '../Design/Site.css';

export default function SiteProfile( { mobileView } ) {

    const [loading, setLoading] = useState(true);
    const [site, setSite] = useState({});
    const [events, setEvents] = useState([]);

    // query name from params
    const name = 'Walk to the Rock';

    const fetchSiteInfo = async () => {
        try {
            const q = query(collection(db, 'test_sites'), where('name', '==', name));
            const querySnaphot = await getDocs(q);
            const doc = querySnaphot.docs[0];
            const data = {id: doc.id, ...doc.data()};
            let events = [];
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
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchSiteInfo();
    }, []);
  
    return (
        <div className='profile'>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Profile</title>
            </Helmet>
            {loading ? <Loading /> : 
            <Box display="grid" justifyContent="center">
                <Box display="grid" justifyContent="center">
                    <Typography variant='h2' textAlign="center">{site.name}</Typography>
                </Box>
                <Box display='grid' padding={2}>
                    <Stack direction={mobileView ? 'column' : 'row'} gap={2} justifyContent='center'>
                        <Box padding={1}>
                            <img src={site.image || WanderNebraskaLogo} alt={site.name} width={mobileView ? 400 : 600} height={400}></img>
                        </Box>
                        <AddressCard currSite={site} mobileView={mobileView} />
                    </Stack>
                    <Stack direction={mobileView ? 'column' : 'row'} gap={2} justifyContent='center'>
                        <Box padding={1}>
                            <HoursCard currSite={site} mobileView={mobileView}/>
                        </Box>
                        <Typography variant='h5'>{site.description}</Typography>
                    </Stack>
                    <br/>
                    {events ? <EventsList events={events} /> : <></>}
                </Box>
            </Box>}
        </div>
    );
};