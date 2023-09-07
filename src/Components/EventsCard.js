import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import WanderDefaultImage from "../Images/WanderDefaultImage.png";
import "../Design/SiteCard.css";

function EventsCard( { props, mobileView } ) {

  let navigate = useNavigate();

  return (
    <div className={props.region ? props.region.replace(/ /g, '') : "card"}>
      <Card sx={{ maxWidth: 1000 }}>
        <Stack direction={mobileView ? "column" : "row"} >
            <CardMedia sx={mobileView ? { height: 200 } : { width: 400 }}
            image={props.image ? props.image : WanderDefaultImage} title={props.name} />
            <CardContent sx={mobileView ? {} : { width: 600 }}>
                <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'light' }}>
                {props.name}
                </Typography>
                <Box display="grid" alignItems="center" justifyContent="center">
                    {props.events.map((event, i) => 
                    <Typography key={i} padding={1} sx={{ fontWeight: 'light' }}>{event}</Typography>)}
                </Box>
                <Button size="small" onClick={() => {navigate("/sites/" + props.name, { state: props });window.scrollTo(0, 0);}}>
                    Learn More</Button>
            </CardContent>
        </Stack>
      </Card>
    </div>
  );
}

export default EventsCard;