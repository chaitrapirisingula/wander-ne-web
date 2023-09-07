import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Box, Typography, Tab } from '@mui/material';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../Data/firebase';
import RegionSelect from "../Components/RegionSelect";
import EventsWrapper from "../Components/EventsWrapper";
import "../Design/App.css";

function Events( { sites, mobileView } ) {

    const [region, setRegion] = useState('');
    const [tab, setTab] = useState('sites');

    const handleChange = (event, newTab) => {
        setTab(newTab);
        logEvent(analytics, `${newTab}_events_selected`);
    };

    const handleChild = (region) => {
        setRegion(region);
        logEvent(analytics, `${region}_events_selected`);
    };

    useEffect(() => {
        logEvent(analytics, "events_visit");
    }, []);

    return (
        <div className="App">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Events</title>
            </Helmet>
            <div className="sites_title">
                <Typography variant="h2">Events</Typography>
                <RegionSelect handleChild={handleChild}/>
            </div>
            <Box sx={{ width: '100%', typography: 'body1', display: 'grid' }}>
                <TabContext value={tab}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={(event, newTab) => handleChange(event, newTab)}  
                        sx={{'& .MuiTabs-flexContainer': { flexWrap: 'wrap' }}}
                        aria-label="lab API tabs example" centered>
                            <Tab label={"Historical Sites"} value="sites" />
                            <Tab label={"Libraries"} value="libs" />
                        </TabList>
                    </Box>
                    <TabPanel value="sites">
                        <EventsWrapper sites={sites.filter(site => !site.name.toLowerCase().includes("library"))} region={region} mobileView={mobileView}/>
                    </TabPanel>
                    <TabPanel value="libs">
                        <EventsWrapper sites={sites.filter(site => site.name.toLowerCase().includes("library"))} region={region} mobileView={mobileView}/>
                    </TabPanel>
                </TabContext>
            </Box>
        </div>
    );
}

export default Events;