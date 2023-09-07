import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link, Typography } from '@mui/material';
import NSHSFLogo from "../Images/NSHSFLogo.png";
import DonateImg from "../Images/DonateImage.png";
import "../Design/HeaderFooter.css";

function Footer( { mobileView, links } ) {

    return (
        <footer className={mobileView ? "footer-mobile" : "footer"}>
            <div className='footer-main'>
                <div className="logo_wrapper">
                    <a href={links.nshsf_website} target="_blank" rel="noreferrer">
                        <img className="nshsf_logo" src={NSHSFLogo}
                        alt="Nebraska State Historical Society Foundation"></img>
                    </a>
                </div>
                <div className="logo_wrapper">
                    <a href={links.donation} target="_blank" rel="noreferrer">
                        <img className="donate_logo" src={DonateImg}
                        alt="Donate"></img>
                    </a>    
                </div>
                <div className="social_media">
                    <Link href={links.facebook} target="_blank" rel="noreferrer"><FacebookIcon fontSize='large'/></Link>
                    <Link href={links.instagram} target="_blank" rel="noreferrer"><InstagramIcon fontSize='large'/></Link>
                    <Link href={links.twitter} target="_blank" rel="noreferrer"><TwitterIcon fontSize='large'/></Link>
                    <Link href={links.linkedin} target="_blank" rel="noreferrer"><LinkedInIcon fontSize='large'/></Link>
                </div>
            </div>
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © Nebraska State Historical Society Foundation, '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </footer>
    );
};

export default Footer;