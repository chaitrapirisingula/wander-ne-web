import React from "react";
import { Card, CardContent, Typography } from '@mui/material';
import { days } from '../Data/Constants';
import "../Design/Site.css";

function HoursCard( { currSite, mobileView } ) {
  
    return (
        <Card sx={{ maxWidth: mobileView ? 300 : 500 }}>
            <CardContent>
                <Typography component='div' variant='h5'>
                    <Typography variant='h4'>Hours</Typography>
                    {currSite.hours.map((times, i) => 
                        <Typography variant='h5' key={i}>{days[i] + ': ' + times}</Typography>
                    )}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default HoursCard;