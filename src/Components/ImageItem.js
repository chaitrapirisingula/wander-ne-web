import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, ImageListItem, ImageListItemBar, Popover, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

function ImageItem( { item, message } ) {

    let navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <ImageListItem>
            <img
                src={item.image}
                alt={item.name}
                loading="lazy"
            />
            <ImageListItemBar
                title={item.name}
                subtitle={item.city + ", " + item.state}
                actionIcon={
                <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    aria-label={`more info`}
                    onClick={handleClick}
                >
                    <InfoIcon />
                </IconButton>
                }
            />
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
            >
                <Box display="grid" textAlign="center">
                    <Typography sx={{ p: 2 }}>{message}</Typography>
                    <Button size="small" onClick={() => {navigate("/sites/" + item.name, { state: item });window.scrollTo(0, 0);}}>Learn More</Button>
                </Box>
            </Popover>
        </ImageListItem>
    );
};

export default ImageItem;