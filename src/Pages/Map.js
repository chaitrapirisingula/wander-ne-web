import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Box, Card, Stack, Typography } from '@mui/material';
import ImageMapper from 'react-img-mapper';
import { logEvent } from 'firebase/analytics';
import { collection, getDocs } from 'firebase/firestore';
import { db, analytics } from '../Data/firebase';
import RegionsMap from "../Images/RegionsMap.png";
import ImageTable from "../Components/ImageTable";
import Loading from '../Components/Loading';
import { MAP } from "../Data/MapInfo";
import "../Design/Map.css";

function Map( { sites, mobileView } ) {

    const [currArea, setCurrArea] = useState({});
    const [regions, setRegions] = useState([]);

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const currRegion = currArea.name ? regions.find((region) => { return region.name === currArea.name }) : {};
    const nickname = currRegion.nickname ? currRegion.nickname : 'Regions';
    const description = currRegion.description ? currRegion.description : '';

    function clicked(area) {
        setCurrArea(area);
        logEvent(analytics, `${area.name}_clicked`);
    }

    function clickedOutside(evt) {
        setCurrArea({});
    }
    
    useEffect(() => {
        const getRegions = async () => {
            try {
                const regionsRef = collection(db, "regions");
                const data = await getDocs(regionsRef);
                const regionsData = data.docs.map((doc) => ({...doc.data(), id: doc.id }));
                setRegions(regionsData);
                setLoaded(true);
            } catch (err) {
                console.error(err);
                setError(true);
                logEvent(analytics, "error_fetching_regions");
            }
        }
        getRegions();
        logEvent(analytics, "map_visit");
    }, []);
    
    return (
        <div className="App">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Regions</title>
            </Helmet>
            {error ? 
            <Box padding={5} display="grid" justifyContent="center">
                <Typography variant='h4'>An error occured. Please try again later.</Typography>
            </Box> 
            : <></>}
            {!loaded && !error ? <Loading/> : <></>}
            {loaded && !error ? 
            <div>
                <Typography variant="h2" sx={{m:2}}>{nickname}</Typography>
                <Stack direction={mobileView ? "column" : "row"} spacing={2}>
                    <div className="map">
                        <div className="map_container">
                            <ImageMapper src={RegionsMap} map={MAP} width={700} height={300}
                                onClick={area => clicked(area)}
                                onImageClick={evt => clickedOutside(evt)}
                            />
                        </div>
                    </div>
                    {currRegion.name ? 
                    <Box padding={1} display="grid" justifyContent="center">
                        <Card sx={{ maxWidth: 600 }}>
                            <Box padding={1}>
                                <div className="region_info">
                                    <Box display="grid" alignItems="center" justifyContent="center">
                                        <Typography>{description}</Typography>
                                    </Box>
                                </div>
                            </Box>
                        </Card> 
                    </Box> : <Typography variant="h6" padding={2}>Select to a region to learn more.</Typography>}
                </Stack>
                <Box padding={1} textAlign="center">
                    <ImageTable items={currRegion.name ? sites.filter(site => site.region === currRegion.name) : sites} 
                        title={currRegion.name ? "Attractions of the " + nickname : "Historical Attractions of Nebraska"} 
                            mobileView={mobileView}/>
                </Box>
            </div> : <></>}
        </div>
    );
}

export default Map;