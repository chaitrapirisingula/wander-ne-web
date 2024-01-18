import React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, Link } from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SignpostIcon from '@mui/icons-material/Signpost';
import InfoIcon from '@mui/icons-material/Info';
import WanderLogo from "../Images/WanderNebraskaLogo.png";
import "../Design/HeaderFooter.css";

function Header( { mobileView, links } ) {

    let navigate = useNavigate();

    return (
        <header className={mobileView ? "header-mobile" : "header"}>
            <div className="logo_wrapper">
                <img src={WanderLogo} alt="Wander Nebraska" className="logo" onClick={() => {navigate("/"); window.scrollTo(0, 0);}}/>
            </div>
            <div className="buttons_section">
                <Button onClick={() => {navigate("/sites"); window.scrollTo(0, 0);}}>
                    <Box display="grid" justifyContent="center"><TravelExploreIcon /></Box>
                    Sites
                </Button>
                <Button onClick={() => {navigate("/map"); window.scrollTo(0, 0);}}>
                    <Box display="grid" justifyContent="center"><SignpostIcon /></Box>
                    Regions
                </Button>
                <Button>
                    <Link href={links.donation} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        <Box display="grid" justifyContent="center"><InfoIcon /></Box>
                        Donate
                    </Link>
                </Button>
            </div>
        </header>
    );
};

export default Header;