import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Typography } from '@mui/material';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../Data/firebase';
import SiteCard from "../Components/SiteCard";
import SearchBar from "../Components/SearchBar";
import "../Design/App.css";

function Libraries( { sites } ) {

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        logEvent(analytics, "libraries_visit");
    }, []);

    return (
        <div className="App">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Libraries</title>
            </Helmet>
            <div className="sites_title">
                <Typography variant="h2">Libraries</Typography>
                <SearchBar setSearchQuery={setSearchQuery} />
            </div>
            <div className="sites_wrapper">
                {sites.map((lib) => {
                    return (lib.name.toLowerCase().includes("library")) && 
                    (lib.name.toLowerCase().includes(searchQuery.toLowerCase()) || lib.city.toLowerCase().includes(searchQuery.toLowerCase()))
                    ? <SiteCard key={lib.name} props={lib} /> : ""
                })} 
            </div>
        </div>
    );
}

export default Libraries;