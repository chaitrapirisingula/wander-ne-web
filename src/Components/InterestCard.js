import React from 'react';
import { Box, Card, Link, Stack, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import PhoneIcon from '@mui/icons-material/Phone';

function InterestCard( { mobileView, information, links } ) {
    return (
        <Card>
            <Box padding={2}>
                <Typography variant="h4">Interested?</Typography>
                <Typography variant="h6">{information.interest[0]}</Typography>
                <br/>
                <Typography variant="h6">{information.interest[1]}</Typography>
                <Stack direction={mobileView ? "column" : "row"} spacing={mobileView ? 2 : 5} padding={1}>
                    <Link href="mailto:LFattig@nshsf.org" target="_blank" rel="noreferrer">
                        <Box display="flex" alignItems="center" gap={1}>
                            <EmailIcon fontSize="large"/>
                            <Typography variant="h6">{information.email}</Typography>
                        </Box>
                    </Link>
                    <Box display="flex" gap={1}>
                        <PhoneIcon fontSize="large" color="primary"/>
                        <Typography variant="h6" color="primary">{information.phone}</Typography>
                    </Box>
                    <Link href={links.interest_form} 
                    target="_blank" rel="noreferrer">
                        <Box display="flex" alignItems="center" gap={1}>
                            <LinkIcon fontSize="large"/>
                            <Typography variant="h6">Interest Form</Typography>
                        </Box>
                    </Link>
                </Stack>
            </Box>
        </Card>
    );
}

export default InterestCard;