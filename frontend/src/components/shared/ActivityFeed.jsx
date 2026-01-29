// src/components/shared/ActivityFeed.jsx
import React from 'react';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Chip,
    Box,
    Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MedicationIcon from '@mui/icons-material/Medication';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';

const ActivityFeed = ({ activities = [] }) => {
    const getActivityIcon = (type) => {
        switch (type) {
            case 'consultation':
                return <PersonIcon />;
            case 'prescription':
                return <MedicationIcon />;
            case 'form':
                return <ArticleIcon />;
            case 'appointment':
                return <EventIcon />;
            default:
                return <PersonIcon />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'consultation':
                return '#2e7d32';
            case 'prescription':
                return '#9c27b0';
            case 'form':
                return '#1976d2';
            case 'appointment':
                return '#ed6c02';
            default:
                return '#666666';
        }
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = Math.floor((now - time) / 1000); // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    // Sample data if no activities provided
    const sampleActivities = [
        {
            id: 1,
            type: 'consultation',
            title: 'New consultation completed',
            description: 'Patient: John Doe - General Checkup',
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
        },
        {
            id: 2,
            type: 'prescription',
            title: 'Prescription issued',
            description: 'Patient: Jane Smith - Antibiotics prescribed',
            timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
        },
        {
            id: 3,
            type: 'form',
            title: 'New form created',
            description: 'Pediatric Consultation Form v2.0',
            timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        },
        {
            id: 4,
            type: 'appointment',
            title: 'Appointment scheduled',
            description: 'Patient: Mike Johnson - Follow-up visit',
            timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        },
    ];

    const displayActivities = activities.length > 0 ? activities : sampleActivities;

    return (
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={600}>
                    Recent Activity
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Latest updates from your practice
                </Typography>
            </Box>

            <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
                {displayActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                        {index > 0 && <Divider variant="inset" component="li" />}
                        <ListItem
                            alignItems="flex-start"
                            sx={{
                                py: 2,
                                px: 2,
                                transition: 'background-color 0.2s',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        bgcolor: getActivityColor(activity.type),
                                        width: 40,
                                        height: 40,
                                    }}
                                >
                                    {getActivityIcon(activity.type)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography variant="body2" fontWeight={600}>
                                            {activity.title}
                                        </Typography>
                                        <Chip
                                            label={formatTime(activity.timestamp)}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.7rem',
                                                bgcolor: 'action.hover',
                                            }}
                                        />
                                    </Box>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {activity.description}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </React.Fragment>
                ))}
            </List>

            <Box
                sx={{
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    textAlign: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    color="primary"
                    sx={{
                        cursor: 'pointer',
                        fontWeight: 600,
                        '&:hover': { textDecoration: 'underline' },
                    }}
                >
                    View All Activity
                </Typography>
            </Box>
        </Paper>
    );
};

export default ActivityFeed;
