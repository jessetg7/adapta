// src/components/Dashboard/BrandingCustomizer.jsx
import React from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Grid,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import CloseIcon from '@mui/icons-material/Close';
import { useAdapta } from '../../context/AdaptaContext';

const PRESET_COLORS = [
    '#1976d2', // Blue (General)
    '#2e7d32', // Green (Wellness/Pharmacy)
    '#d32f2f', // Red (Emergency)
    '#9c27b0', // Purple (Maternal/OBGYN)
    '#ed6c02', // Orange (Pediatrics)
    '#009688', // Teal (Diagnostic)
];

const BrandingCustomizer = ({ open, onClose }) => {
    const { clinicInfo, setClinicInfo } = useAdapta();
    const [localInfo, setLocalInfo] = React.useState(clinicInfo);

    const handleSave = () => {
        setClinicInfo(localInfo);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PaletteIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">Branding & White-labeling</Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Customize your hospital's appearance. These changes apply across the entire platform in real-time.
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Hospital / Clinic Name"
                            value={localInfo.name}
                            onChange={(e) => setLocalInfo(prev => ({ ...prev, name: e.target.value }))}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Primary Theme Color</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            {PRESET_COLORS.map(color => (
                                <Box
                                    key={color}
                                    onClick={() => setLocalInfo(prev => ({ ...prev, primaryColor: color }))}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        bgcolor: color,
                                        cursor: 'pointer',
                                        border: localInfo.primaryColor === color ? '3px solid #000' : '1px solid #ddd',
                                        boxShadow: 1,
                                        '&:hover': { transform: 'scale(1.1)' },
                                        transition: 'transform 0.2s'
                                    }}
                                />
                            ))}
                        </Box>
                        <TextField
                            fullWidth
                            size="small"
                            label="Custom Hex Color"
                            value={localInfo.primaryColor}
                            onChange={(e) => setLocalInfo(prev => ({ ...prev, primaryColor: e.target.value }))}
                            helperText="Enter a hex code (e.g., #FF5733)"
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed #ccc' }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>Preview</Typography>
                    <Button variant="contained" sx={{ bgcolor: localInfo.primaryColor, '&:hover': { bgcolor: localInfo.primaryColor, opacity: 0.9 } }}>
                        {localInfo.name} Button
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save Branding
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BrandingCustomizer;
