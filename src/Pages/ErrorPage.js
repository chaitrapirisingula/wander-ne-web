import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { logEvent } from 'firebase/analytics';
import { analytics } from '../Data/firebase';
import "../Design/App.css";

function ErrorPage() {

    useEffect(() => {
        logEvent(analytics, "404_visit");
    }, []);

    return (
        <div className="App">
            <Box padding={5}>
                <Typography variant='h4'>404: Page Not Found.</Typography>
            </Box>
        </div>
    );
}

export default ErrorPage;