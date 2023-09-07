import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function RegionSelect( { handleChild } ) {

    const [region, setRegion] = useState('');

    const handleChange = (event) => {
        setRegion(event.target.value);
        handleChild(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="demo-controlled-open-select-label">Region</InputLabel>
                <Select labelId="demo-controlled-open-select-label" id="demo-controlled-open-select"
                value={region} label="Region" onChange={handleChange}>
                    <MenuItem value={""}><em>All</em></MenuItem>
                    <MenuItem value={"Panhandle"}>Panhandle/Northwest</MenuItem>
                    <MenuItem value={"Sandhills"}>Sandhills/North Central</MenuItem>
                    <MenuItem value={"North East"}>North East</MenuItem>
                    <MenuItem value={"South West"}>South West</MenuItem>
                    <MenuItem value={"South Central"}>South Central</MenuItem>
                    <MenuItem value={"South East"}>South East</MenuItem>
                    <MenuItem value={"Metro"}>Metro</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}

export default RegionSelect;