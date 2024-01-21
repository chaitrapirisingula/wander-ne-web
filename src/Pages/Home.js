import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Card, Link, Stack, Typography } from '@mui/material';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { logEvent } from 'firebase/analytics';
import { collection, getDocs } from 'firebase/firestore';
import { db, analytics } from '../Data/firebase';
import Loading from '../Components/Loading';
import ImageTable from '../Components/ImageTable';
import HomePageImage from '../Images/HomePageImage.png';
import '../Design/App.css';
import '../Design/Home.css';
import '@fontsource/oswald';

function Home( { sites, mobileView, links } ) {

  const [information, setInformation] = useState({});

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const infoRef = collection(db, "homepage");
        const data = await getDocs(infoRef);
        const infoData = data.docs[0].data();
        setInformation(infoData);
        setLoaded(true);
      } catch (err) {
        console.error(err);
        setError(true);
        logEvent(analytics, "error_fetching_homepage_data");
      }
    }
    getInfo();
    logEvent(analytics, "homepage_visit");
  }, []);

  return (
    <div className="Home">
      <Helmet>
          <meta charSet="utf-8" />
          <title>WanderNebraska</title>
      </Helmet>
      {error ? 
      <Box padding={5} display="grid" justifyContent="center">
          <Typography variant='h4'>An error occured. Please try again later.</Typography>
      </Box> 
      : <></>}
      {!loaded && !error ? <Loading/> : <></>}
      {loaded && !error ? <div>
        <div className = "head_text">
          <div className = "head_image">
          <img src={HomePageImage} alt="Wander Nebraska" className="home_image"/>
          </div>
          <div className="center_text">
            <div className="title">
              {mobileView ? <p>Wander Nebraska</p> : <p>WanderNebraska</p>}
            </div>
            <Typography variant="h5" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>{information.motto}</Typography>
          </div>
        </div>
        <div className="home_overview">
          <br/>
          <Box padding={1}>
            <Card>
              <Box padding={2}>
                <Typography variant="h4">About</Typography>
                <Typography variant="h6">{information.about}</Typography>
              </Box>
            </Card>
          </Box>
          <Box padding={1}>
            <Card>
              <Box padding={2}>
                <Typography variant="h4">Support</Typography>
                <Stack direction={mobileView ? "column" : "row"} spacing={mobileView ? 2 : 5} padding={1}>
                    <Link href="mailto:LFattig@nshsf.org" target="_blank" rel="noreferrer">
                        <Box display="flex" alignItems="center" gap={1}>
                            <EmailIcon fontSize="large"/>
                            <Typography variant="h6">{information.email}</Typography>
                        </Box>
                    </Link>
                    <Box display="flex" gap={1}>
                        <PhoneIcon fontSize="large" color="primary"/>
                        <Typography variant="h6" color="primary">{information.phone}</Typography>
                    </Box>
                    <Link href={links.donation} target="_blank" rel="noreferrer">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Diversity1Icon fontSize='large'/>
                        <Typography variant="h6">Donate</Typography>
                      </Box>
                    </Link>
                </Stack>
                <Typography variant="h6">{information.support[0]}</Typography>
                <br/>
                <Typography variant="h6">{information.support[1]}</Typography>
                <br/>
                <Typography variant="h6">{information.support[2]}</Typography>
              </Box>
            </Card>
          </Box>
          <Box padding={1} textAlign="center">
            <ImageTable items={sites.filter(site => site.note)} show_note={true} title={"Past Statewide Grants Recipients"} mobileView={mobileView}/>
          </Box>
        </div>
      </div> : <></>}
    </div>
  );
}

export default Home;