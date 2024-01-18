import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Typography } from '@mui/material';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../Data/firebase';
import SiteCard from "../Components/SiteCard";
import SearchBar from "../Components/SearchBar";
import "../Design/App.css";

function Sites( { sites } ) {

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    logEvent(analytics, "sites_visit");
  }, []);

  return (
    <div className="App">
      <Helmet>
          <meta charSet="utf-8" />
          <title>Sites</title>
      </Helmet>
      <div className="sites_title">
        <Typography variant="h2">Attractions</Typography>
        <SearchBar setSearchQuery={setSearchQuery} />
      </div>
      <div className="sites_wrapper">
        {sites.map((site) => {
            return (site.name.toLowerCase().includes(searchQuery.toLowerCase()) || site.city.toLowerCase().includes(searchQuery.toLowerCase()))
            ? <SiteCard key={site.name} props={site} /> : ""
        })} 
      </div>
    </div>
  );
}

export default Sites;