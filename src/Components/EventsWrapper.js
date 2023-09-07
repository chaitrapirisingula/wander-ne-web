import React from "react";
import { Box } from '@mui/material';
import EventsCard from "../Components/EventsCard";
import "../Design/App.css";

function EventsWrapper( { sites, region, mobileView } ) {
  return (
    <div className="events_wrapper">
        {sites.map((site) => {
            return (!region || site.region === region) && site.events && site.events.length > 0 ? 
                <Box key={site.name} display="grid" alignItems="center" justifyContent="center">
                    <EventsCard props={site} mobileView={mobileView}/> 
                </Box>
        : ""})} 
    </div>
  );
}

export default EventsWrapper;