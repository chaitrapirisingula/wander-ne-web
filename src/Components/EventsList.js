import * as React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListSubheader, ListItemIcon } from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';

export default function EventsList( { events } ) {
  return (
    <List sx={{ bgcolor: 'background.paper' }} 
        subheader={
            <ListSubheader component="div" id="nested-list-subheader">
                <Typography variant="h4" color="text.primary" textAlign="center" padding={1}>Events</Typography>
            </ListSubheader>
        }>
        <Box padding={1}>
            {events.map((event, i) => 
                <ListItem alignItems="flex-start" key={i}>
                    <ListItemIcon>
                        <DateRangeIcon />
                    </ListItemIcon>
                    <ListItemText
                    primary={event.name}
                    secondary={
                        <React.Fragment>
                            <Typography
                                variant="body2"
                                color="text.primary"
                            >
                                {event.date.toDate().toDateString()}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {event.description}
                            </Typography>
                        </React.Fragment>
                    }
                    />
                </ListItem>
            )}
        </Box>
    </List>
  );
}