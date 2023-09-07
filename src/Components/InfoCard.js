import React, { useState } from "react";
import { Box, Card, CardContent, CardActions, Collapse, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MessageIcon from '@mui/icons-material/Message';
import { ExpandMore } from "./StyledExpand";
import "../Design/Site.css";

function InfoCard( { currSite } ) {

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
  
    return (
        <Card sx={{ maxWidth: 1100 }}>
            <CardContent>
                {currSite.description ?
                <Box display="grid" justifyContent="center" padding={1}>
                    <Typography variant="h5">{currSite.description}</Typography>
                </Box> : <></>}
                {currSite.special ?
                <Box display="grid" justifyContent="center" padding={1}>
                    <Typography variant="h5" sx={{ fontWeight: 'light', fontStyle: 'italic' }}>{currSite.special}</Typography>
                </Box> : <></>}
                <div className="site_info">
                    {currSite.contact ? <div className="site_link"><AccountCircleIcon fontSize="large"/>{currSite.contact}</div> : <></>}
                    {currSite.contactInfo ? <div className="site_link"><MessageIcon fontSize="large"/>{currSite.contactInfo}</div> : <></>}
                </div>
                {currSite.events && currSite.events.length > 0 ?
                <Box>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <CardActions>
                        <Typography variant="h6">View Events</Typography>
                        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                            <ExpandMoreIcon fontSize="large"/>
                        </ExpandMore>
                    </CardActions>
                </Box>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {currSite.events.map((event, i)=> 
                    <Typography key={i} variant="h6" padding={1}>{event}</Typography>)}
                </Collapse> 
                </Box> : <></>} 
            </CardContent>
        </Card>
    );
}

export default InfoCard;