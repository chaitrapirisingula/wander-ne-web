import React, { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Card, Slide, Typography } from '@mui/material';
import SiteCard from './SiteCard';

function Arrow(props) {
    const { direction, clickFunction } = props;
    const icon = direction === 'left' ? <ChevronLeftIcon sx={{ width: 50, height: 100 }}/> : 
        <ChevronRightIcon sx={{ width: 50, height: 100 }}/>;

    return <div onClick={clickFunction}>{icon}</div>;
}

function Slideshow( { slides, title } ) {

    const [index, setIndex] = useState(0);
    const content = slides[index];
    const numSlides = slides.length;

    const [slideIn, setSlideIn] = useState(true);
    const [slideDirection, setSlideDirection] = useState('down');

    const onArrowClick = (direction) => {
        const increment = direction === 'left' ? -1 : 1;
        const newIndex = (index + increment + numSlides) % numSlides;

        const oppDirection = direction === 'left' ? 'right' : 'left';
        setSlideDirection(direction);
        setSlideIn(false);

        setTimeout(() => {
            setIndex(newIndex);
            setSlideDirection(oppDirection);
            setSlideIn(true);
        }, 100);
    }

    return (
        <Card sx={{ maxWidth: 400 }}>
            <Box padding={2}>
                <Typography gutterBottom variant="h4" sx={{ fontWeight: 'light' }}>{title}</Typography>
                <Box display="flex" alignItems="center" justifyContent="center" padding={2}>
                    <Arrow direction='left' clickFunction={() => onArrowClick('left')}/>
                    <Slide in={slideIn} direction={slideDirection}>
                        <Box display="flex" gap={2}>
                            <SiteCard props={content} />
                        </Box>
                    </Slide>
                    <Arrow direction='right' clickFunction={() => onArrowClick('right')}/>
                </Box>
            </Box>
        </Card>
    );
}

export default Slideshow;