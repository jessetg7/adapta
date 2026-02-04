// src/components/Dashboard/BlueprintSelector.jsx
import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    Button
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WomanIcon from '@mui/icons-material/Woman';

const BLUEPRINTS = [
    {
        id: 'general',
        title: 'General HMS',
        description: 'Standard OPD, Lab, and Billing modules.',
        icon: <LocalHospitalIcon />,
        color: '#1976d2'
    },
    {
        id: 'cardiology',
        title: 'Cardiology Center',
        description: 'Includes ECG tracking, Lipid profile rules, and Cardiac history forms.',
        icon: <FavoriteIcon />,
        color: '#e91e63'
    },
    {
        id: 'gynecology',
        title: 'Maternal Care (OBGYN)',
        description: 'Antenatal care templates, delivery records, and neonatal tracking.',
        icon: <WomanIcon />,
        color: '#9c27b0'
    }
];

const BlueprintSelector = ({ open, onClose, onSelect }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
                <Typography variant="h5" fontWeight={700}>Choose Your Hospital Blueprint</Typography>
                <Typography variant="body2" color="text.secondary">
                    Select a pre-configured template to jumpstart your hospital setup.
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pb: 4 }}>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {BLUEPRINTS.map((bp) => (
                        <Grid item xs={12} md={4} key={bp.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    border: '2px solid transparent',
                                    '&:hover': { borderColor: bp.color, transform: 'translateY(-4px)' },
                                    transition: 'all 0.2s'
                                }}
                            >
                                <CardActionArea onClick={() => onSelect(bp.id)} sx={{ height: '100%' }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Avatar sx={{ bgcolor: bp.color, width: 56, height: 56, mx: 'auto', mb: 2 }}>
                                            {bp.icon}
                                        </Avatar>
                                        <Typography variant="h6" gutterBottom>{bp.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {bp.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button onClick={onClose} color="inherit">Skip for now</Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default BlueprintSelector;
