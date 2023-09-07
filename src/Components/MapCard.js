import React, { useState } from "react";
import { Box, Card, CardContent, CardActions, Collapse, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from "./StyledExpand";
import "../Design/Site.css";

function MapCard( { currSite, mobileView } ) {

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
  
    return (
        <Card sx={{ maxWidth: mobileView ? 400 : 700 }}>
            <CardContent>
                <iframe title="map" className="site_map" src={`https://maps.google.com/maps?q=
                ${currSite.name + " " + currSite.streetAddress + " " + currSite.city + " " + currSite.state + " " + currSite.postalCode} &t=&z=13&ie=UTF8&iwloc=&output=embed`} 
                width={ mobileView ? "300" : "600"} height="300"></iframe>
                <Typography gutterBottom variant="h6" component="div" padding={1} sx={{ fontStyle: 'italic' }}>
                {currSite.streetAddress}, {currSite.city} {currSite.state}, {currSite.postalCode}</Typography>
            </CardContent>
            {currSite.attractions ? 
            <Box>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <CardActions>
                        <Typography variant="h6">View Attractions Nearby</Typography>
                        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                            <ExpandMoreIcon fontSize="large"/>
                        </ExpandMore>
                    </CardActions>
                </Box>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography variant="h6">{currSite.attractions}</Typography> 
                    </CardContent>
                </Collapse> 
            </Box>: <></>}
        </Card>
    );
}

export default MapCard;