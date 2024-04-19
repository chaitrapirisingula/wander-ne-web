import React from 'react';
import { ImageList, ImageListItem, ListSubheader } from '@mui/material';
import ImageItem from './ImageItem';

function ImageTable( { items, show_note, title, mobileView } ) {

    return (
        <ImageList sx={{ height: 500 }} cols={mobileView ? 2 : 4}>
            <ImageListItem key="Subheader" cols={4}>
                <ListSubheader component="div">{title}</ListSubheader>
            </ImageListItem>
            {items.map((item, index) => (
                <ImageItem key={index} item={item} message={item.note && show_note ? item.note 
                    : item.address + ", " + item.city + " " + item.state + " " + item.zipCode}/>
            ))}
        </ImageList>
    );

};

export default ImageTable;