import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Box, Card, Stack, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LanguageIcon from '@mui/icons-material/Language';
import LinkIcon from '@mui/icons-material/Link';
import PhoneIcon from '@mui/icons-material/Phone';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../Data/firebase';
import WanderNebraskaLogo from '../Images/WanderNebraskaLogo.png';
import MapCard from '../Components/MapCard';
import Slideshow from '../Components/Slideshow';
import InfoCard from '../Components/InfoCard';
import Loading from '../Components/Loading';
import ErrorPage from './ErrorPage';
import '../Design/Site.css';

function Site( { sites, mobileView} ) {

  const [currSite, setCurrSite] = useState({});
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  let routeParams = useParams();

  useEffect(() => {
    if (location.state) {
      setCurrSite(location.state);
      setLoading(false);
    } else {
      setCurrSite(sites.find((site) => { return site.name === routeParams.site }))
      setLoading(false);
    }
    logEvent(analytics, `${routeParams.site}_visit`);
  }, [location.state, routeParams.site, sites])
  
  if (!currSite && !loading) {
    return (
      <ErrorPage />
    );
  } else if (loading) {
    return (
      <Loading />
    );
  } else {
    return (
      <div className="site_main">
        <Helmet>
            <meta charSet="utf-8" />
            <title>{routeParams.site}</title>
        </Helmet>
        <div>
          <img className="site_image" src={currSite.image || WanderNebraskaLogo} alt={currSite.name}></img>
          <Box display="grid" alignItems="center" justifyContent="center" textAlign="center" padding={2}>
            <Card sx={{ maxWidth: 1100 }}>
              <Box display="grid" alignItems="center" justifyContent="center" textAlign="center" padding={5}>
                <Typography gutterBottom variant="h3" component="div">{currSite.name}</Typography>
                <Typography variant="h5" sx={{fontStyle: 'italic'}} padding={1}>Hours: {currSite.hours}</Typography>
                <Box display="grid" justifyContent="center" padding={2}>
                  <Stack direction={mobileView ? 'column' : 'row'} spacing={3}>
                    {currSite.phone ? <div className="site_link"><PhoneIcon fontSize="large"/>{currSite.phone}</div> : <></>}
                    {currSite.website ? <a className="site_link" href={currSite.website} target="_blank" rel="noreferrer"><LanguageIcon fontSize="large"/>Website</a> : <></>}
                    {currSite.socialMedia ? <a className="site_link" href={currSite.socialMedia} target="_blank" rel="noreferrer"><FacebookIcon fontSize="large"/>Facebook</a> : <></>}
                    {currSite.extra ? <a className="site_link" href={currSite.extra} target="_blank" rel="noreferrer"><LinkIcon fontSize="large"/>Additional Information</a> : <></>}
                  </Stack>
                </Box>
              </Box>
            </Card>
          </Box>
          <div className="site_body">
            <Box display="grid" justifyContent="center">
              <Stack direction={mobileView ? "column" : "row"} spacing={2}>
                <MapCard currSite={currSite} mobileView={mobileView} />
                {currSite.region ? 
                  <Box display="grid" alignItems="center" justifyContent="center">
                    <Slideshow slides={sites.filter(site => site.name !== currSite.name && site.region === currSite.region)} title={"More in the " + currSite.region + " region:"}/> 
                  </Box>
                : <></>}
              </Stack>
            </Box>
            <Box display="grid" alignItems="center" justifyContent="center" textAlign="center" padding={2}>
                <InfoCard currSite={currSite} />
            </Box>
          </div>      
        </div> 
      </div>
    );
  }
}

export default Site;