import React from "react";
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneIcon from '@mui/icons-material/Phone';
import { days } from '../Data/Constants';
import "../Design/Site.css";

function HoursCard( { currSite, mobileView } ) {
  
    return (
        <Card sx={{ maxWidth: mobileView ? 300 : 500 }}>
            <CardContent>
                <Typography component='div' variant='h5'>
                    <Box display='inline' sx={{ fontWeight: 'bold' }}>Hours: </Box>
                    {currSite.hours.map((times, i) => 
                        <Typography variant='h6' key={i}>{days[i] + ': ' + times}</Typography>
                    )}
                </Typography>
                <Stack direction={'column'} spacing={2} padding={2}>
                    {currSite.phone ? <div className="site_link"><PhoneIcon fontSize="large"/>{currSite.phone}</div> : <></>}
                    {currSite.website ? <a className="site_link" href={currSite.website} target="_blank" rel="noreferrer"><LanguageIcon fontSize="large"/>Website</a> : <></>}
                  </Stack>
            </CardContent>
        </Card>
    );
}

export default HoursCard;