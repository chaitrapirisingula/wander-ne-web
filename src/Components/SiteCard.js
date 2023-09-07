import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import WanderDefaultImage from "../Images/WanderDefaultImage.png";
import "../Design/SiteCard.css";

function SiteCard( { props } ) {

  let navigate = useNavigate();

  return (
    <div className={props.region ? props.region.replace(/ /g, '') : "card"}> 
      <Card sx={{ maxWidth: 280 }}>
        <CardMedia
          sx={{ height: 140, width: 280 }}
          image={props.image ? props.image : WanderDefaultImage}
          title={props.name}
        />
        <CardContent sx={{ height: 100 }}>
          <Typography gutterBottom variant="h5" component="div">
          {props.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          {props.city}, {props.state}
          </Typography>
        </CardContent>
        <Box display="flex" alignItems="center" justifyContent="center">
          <CardActions>
            <Button size="small" onClick={() => {navigate("/sites/" + props.name, { state: props });window.scrollTo(0, 0);}}>Learn More</Button>
          </CardActions>
        </Box>
      </Card>
    </div>
  );
}

export default SiteCard;