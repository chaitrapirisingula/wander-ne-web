import React from "react";
import { Card, CardContent, Typography } from '@mui/material';
import "../Design/Site.css";

function AddressCard( { currSite, mobileView } ) {
  
    return (
        <Card sx={{ maxWidth: mobileView ? 400 : 700 }}>
            <CardContent>
                <iframe title="map" className="site_map" src={`https://maps.google.com/maps?q=
                ${currSite.name + " " + currSite.streetAddress + " " + currSite.city + " " + currSite.state + " " + currSite.zipCode} &t=&z=13&ie=UTF8&iwloc=&output=embed`} 
                width={ mobileView ? "300" : "600"} height="300"></iframe>
                <Typography gutterBottom variant="h6" component="div" textAlign="center" padding={1} sx={{ fontStyle: 'italic' }}>
                {currSite.address}, {currSite.city}, {currSite.state}, {currSite.zipCode}</Typography>
            </CardContent>
        </Card>
    );
}

export default AddressCard;