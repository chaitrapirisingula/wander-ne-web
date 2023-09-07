import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import { itemData } from '../Data/PageImages';
import '../Design/Home.css';

function LineImageList( { mobileView } ) {

  let navigate = useNavigate();

  return (
    <div>
      <ImageList cols={mobileView ? 2 : 4}>
        {itemData.map((item, index) => (
          <Button key={index} onClick={() => {navigate(item.link);window.scrollTo(0, 0);}}>
            <ImageListItem key={item.img} className='content'>
              <img src={item.img} alt={item.title} />
              <ImageListItemBar
                title={item.title}
                actionIcon={
                  <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }} >
                    <HighlightAltIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          </Button>
        ))}
      </ImageList>
    </div>
  );
};

export default LineImageList;
