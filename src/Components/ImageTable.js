import React from 'react';
import { ImageList, ImageListItem, ListSubheader } from '@mui/material';
import ImageItem from './ImageItem';

function ImageTable( { items, note, title, mobileView } ) {

    return (
        <ImageList sx={{ height: 500 }} cols={mobileView ? 2 : 4}>
            <ImageListItem key="Subheader" cols={4}>
                <ListSubheader component="div">{title}</ListSubheader>
            </ImageListItem>
            {items.map((item, index) => (
                <ImageItem key={index} item={item} message={item.special && note ? item.special 
                    : item.streetAddress + ", " + item.city + " " + item.state + " " + item.postalCode}/>
            ))}
        </ImageList>
    );

};

export default ImageTable;