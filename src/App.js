import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { db, analytics } from './Data/firebase';
import { logEvent } from 'firebase/analytics';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Box, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './Data/Constants';
import Home from './Pages/Home';
import Sites from './Pages/Sites';
import Map from './Pages/Map';
import ErrorPage from './Pages/ErrorPage';
import SiteProfile from './Pages/SiteProfile';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Loading from './Components/Loading';
import './Design/App.css';

function App() {
  
  const [sites, setSites] = useState([]);
  const [links, setLinks] = useState({});

  const [linksLoaded, setLinksLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const mql = window.matchMedia('(max-width: 750px)');
  mql.addEventListener('change', (e) => {
      setMobileView(e.matches);
  });
  const [mobileView, setMobileView] = useState(mql.matches);
  
  useEffect(() => {
    const getSites = async () => {
      try {
        const sitesRef = collection(db, "2024_sites");
        const data = await getDocs(query(sitesRef, orderBy("name")));
        const sitesData = data.docs.map((doc) => ({...doc.data(), id: doc.id }));
        setSites(sitesData);
        setLoaded(true);
        // var formattedJSON = sitesData.map(item => {
        //   return {
        //     name : item.name,
        //     region : item.region,
        //     address : item.address,
        //     city : item.city,
        //     state : item.state,
        //     zip : item.zipCode,
        //     contact : item.contact,
        //     phone : item.phone,
        //     hours : item.hours.toString(),
        //     email : item.email,
        //     website : item.website
        //   }
        // });
      } catch (err) {
        console.error(err);
        setError(true);
        logEvent(analytics, "error_fetching_sites");
      }
    }
    const getLinks = async () => {
      try {
        const linksRef = collection(db, "links");
        const data = await getDocs(linksRef);
        const linksData = data.docs[0].data();
        setLinks(linksData);
        setLinksLoaded(true);
      } catch (err) {
        console.error(err);
        setError(true);
        logEvent(analytics, "error_fetching_links");
      }
    }
    getSites();
    getLinks();
  }, []);


  return (
    <Router>
      <div className="background-image"></div>   
      <ThemeProvider theme={theme}>
        <Header mobileView={mobileView} links={linksLoaded ? links : {}}/>
        {error ? 
          <Box padding={5} display="grid" justifyContent="center">
            <Typography variant='h4'>An error occured. Please try again later.</Typography>
          </Box> 
        : <></>}
        {!loaded && !error ? <Loading/> : <></>}
        {loaded && linksLoaded && !error ? 
        <Routes>
          <Route path="/" element={<Home sites={sites} mobileView={mobileView} links={links}/>} />
          <Route path="/sites" element={<Sites sites={sites} />} />
          <Route path="/sites/:site" element={<SiteProfile sites={sites} mobileView={mobileView} />} />
          <Route path="/map" element={<Map sites={sites} mobileView={mobileView} />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
        : <></>}
        {linksLoaded && !error ? <Footer mobileView={mobileView} links={links}/> : <></>}
      </ThemeProvider>
    </Router>
  );
}

export default App;
