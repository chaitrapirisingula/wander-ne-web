import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { query, collection, getDoc, getDocs, where } from 'firebase/firestore';
import { Box, Card, CardContent, Stack, Typography, } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneIcon from '@mui/icons-material/Phone';
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
            <div>
                {/* TODO: use tabs for overview (hours, description), events, map/others in region, similar sites */}
                <img className="site_image" src={site.image || WanderNebraskaLogo} alt={site.name}></img>
                {/* site title card starts */}
                <Box display="grid" alignItems="center" justifyContent="center" textAlign="center" padding={2}>
                    <Card sx={{ maxWidth: 1100 }}>
                    <Box display="grid" alignItems="center" justifyContent="center" textAlign="center" padding={5}>
                        <Typography gutterBottom variant="h2" component="div">{site.name}</Typography>
                        <Box display="grid" justifyContent="center" padding={2}>
                        <Stack direction={mobileView ? 'column' : 'row'} spacing={3}>
                            {site.email ? <a className="site_link" href={'mailto:'+site.email} target="_blank" rel="noreferrer"><EmailIcon fontSize="large"/>{site.email}</a> : <></>}
                            {site.phone ? <div className="site_link"><PhoneIcon fontSize="large"/>{site.phone}</div> : <></>}
                            {site.website ? <a className="site_link" href={site.website} target="_blank" rel="noreferrer"><LanguageIcon fontSize="large"/>Website</a> : <></>}
                        </Stack>
                        </Box>
                    </Box>
                    </Card>
                </Box>
                {/* site title card ends */}
                <Stack direction={mobileView ? 'column' : 'row'} gap={2} justifyContent='center'>
                    <HoursCard currSite={site} mobileView={mobileView} />
                    {/* site description card starts */}
                    <Box padding={1}>
                        <Card sx={{ maxWidth: mobileView ? 300 : 800 }}>
                            <CardContent>
                                <Box display='grid' justifyContent='center' textAlign='center' padding={1}>
                                    <Typography variant='h5'>{site.description}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                    {/* site description card ends */}
                </Stack>
                <Box padding={5}>
                    {events ? <EventsList events={events} /> : <></>}
                    <br/>
                    <AddressCard currSite={site} mobileView={mobileView}/>
                </Box>
            </div>}
        </div>
    );
};