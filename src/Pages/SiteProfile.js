import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getDoc } from 'firebase/firestore';
import { Box, Card, CardContent, Stack, Typography, } from '@mui/material';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../Data/firebase';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneIcon from '@mui/icons-material/Phone';
import Loading from '../Components/Loading';
import WanderNebraskaLogo from '../Images/WanderNebraskaLogo.png';
import AddressCard from '../Components/AddressCard';
import HoursCard from '../Components/HoursCard';
import EventsList from '../Components/EventsList';
import ErrorPage from './ErrorPage';
import Slideshow from '../Components/Slideshow';
import '../Design/Site.css';

export default function SiteProfile( { sites, mobileView } ) {

    const [loading, setLoading] = useState(true);
    const [site, setSite] = useState({});
    const [events, setEvents] = useState([]);

    const location = useLocation();
    let routeParams = useParams();

    const fetchSiteInfo = async (data) => {
        try {
            setSite(data);
            console.log(data.name);
            if (data.events) {
                let events = [];
                data.events.forEach(async (doc) => {
                    let event = await getDoc(doc);
                    if (event.exists()) {
                        events.push({id: event.id, ...event.data()});
                        setEvents(events);
                    }
                });
            }
        } catch (err) {
            console.error(err);
            alert('An error occured while fetching site data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location.state) {
            fetchSiteInfo(location.state);
            setLoading(false);
        } else {
            fetchSiteInfo(sites.find((s) => { return s.name === routeParams.site }));
            setLoading(false);
        }
        logEvent(analytics, `${routeParams.site}_visit`);
    }, [location.state, routeParams.site, sites])

    if (!site && !loading) {
        return (
            <ErrorPage />
        );
    } else if (loading) {
        return (
            <Loading />
        );
    } else {
  
    return (
        <div className='profile'>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{routeParams.site}</title>
            </Helmet>
            {loading ? <Loading /> : 
            <div>
                <img className="site_image" src={site.image || WanderNebraskaLogo} alt={site.name}></img>
                <Box display="grid" alignItems="center" justifyContent="center" textAlign="center" padding={2}>
                    <Stack direction={mobileView ? 'column' : 'row'} gap={2}>
                        <Card sx={{ maxWidth: 900 }}>
                            <Box display="grid" alignItems="center" justifyContent="center" textAlign="center" padding={5}>
                                <Typography gutterBottom variant="h3" component="div">{site.name}</Typography>
                                <Box display="grid" justifyContent="center" padding={2}>
                                    <Stack direction={mobileView ? 'column' : 'row'} spacing={3}>
                                        {site.email ? <a className="site_link" href={'mailto:'+site.email} target="_blank" rel="noreferrer"><EmailIcon fontSize="large"/>{site.email}</a> : <></>}
                                        {site.phone ? <div className="site_link"><PhoneIcon fontSize="large"/>{site.phone}</div> : <></>}
                                        {site.website ? <a className="site_link" href={site.website} target="_blank" rel="noreferrer"><LanguageIcon fontSize="large"/>Website</a> : <></>}
                                    </Stack>
                                </Box>
                            </Box>
                        </Card>
                        {mobileView ?
                        <Box display='grid' alignItems='center' justifyContent='center' textAlign='center'>
                            <HoursCard currSite={site} mobileView={mobileView} />
                        </Box> : 
                        <HoursCard currSite={site} mobileView={mobileView} />}
                    </Stack>
                </Box>
                <Stack direction='column' gap={2} padding={2} paddingBottom={5}>
                    <Stack direction={mobileView ? 'column' : 'row'} gap={2} justifyContent='center'>
                        <AddressCard currSite={site} mobileView={mobileView}/>
                        {site.region ? 
                        <Box display='grid' alignItems='center' justifyContent='center' textAlign='center'>
                            <Slideshow slides={sites.filter(s => s.name !== site.name && s.region === site.region)} title={"More in the " + site.region + " region:"}/> 
                        </Box>
                        : <></>}
                    </Stack>
                    <Stack direction={mobileView ? 'column' : 'row'} gap={2} justifyContent='center'>
                        {site.description ?
                        <Card sx={{ maxWidth: mobileView ? 350 : 800 }}>
                            <CardContent>
                                <Box display='grid' justifyContent='center' textAlign='center' padding={1}>
                                    <Typography variant='h5'>{site.description}</Typography>
                                </Box>
                            </CardContent>
                        </Card> : <></>}
                        <br/>
                        {events.length > 0 ? 
                        <Card sx={{ maxWidth: mobileView ? 350 : 500 }}>
                            <EventsList events={events} /> 
                        </Card>
                        : <></>}
                    </Stack>
                </Stack>
            </div>}
        </div>
    );
};

};