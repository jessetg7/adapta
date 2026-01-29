// src/components/TemplateGallery/StarterTemplatesGallery.jsx
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Box,
    IconButton,
    Tabs,
    Tab,
    Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArticleIcon from '@mui/icons-material/Article';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicationIcon from '@mui/icons-material/Medication';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { getStarterTemplates } from '../../utils/initializeStarterTemplates';
import { TEMPLATE_CATEGORIES } from '../../core/registry/fieldConfigs';

const StarterTemplatesGallery = ({ open, onClose, onSelectTemplate }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const starterTemplates = getStarterTemplates();

    // Filter templates by category
    const filteredTemplates =
        selectedCategory === 'all'
            ? starterTemplates
            : starterTemplates.filter((t) => t.category === selectedCategory);

    // Get icon for template type
    const getTemplateIcon = (type) => {
        const icons = {
            consultation: <LocalHospitalIcon />,
            prescription: <MedicationIcon />,
            patientIntake: <PersonAddIcon />,
            investigation: <ArticleIcon />,
        };
        return icons[type] || <ArticleIcon />;
    };

    // Handle template selection
    const handleUseTemplate = (template) => {
        onSelectTemplate(template);
        onClose();
    };

    // Handle preview
    const handlePreview = (template) => {
        setSelectedTemplate(template);
        setShowPreview(true);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ArticleIcon color="primary" />
                            <Typography variant="h6">Starter Templates</Typography>
                        </Box>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent dividers>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Choose from our professionally designed templates to get started quickly. All templates can be
                        customized after installation.
                    </Alert>

                    {/* Category Tabs */}
                    <Tabs
                        value={selectedCategory}
                        onChange={(e, v) => setSelectedCategory(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="All Templates" value="all" />
                        {Object.entries(TEMPLATE_CATEGORIES).map(([key, { label }]) => (
                            <Tab key={key} label={label} value={key} />
                        ))}
                    </Tabs>

                    {/* Templates Grid */}
                    {filteredTemplates.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <ArticleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No templates in this category
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredTemplates.map((template) => (
                                <Grid item xs={12} sm={6} md={4} key={template.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 6,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            {/* Icon */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: 2,
                                                    bgcolor: 'primary.50',
                                                    color: 'primary.main',
                                                    mb: 2,
                                                }}
                                            >
                                                {getTemplateIcon(template.type)}
                                            </Box>

                                            {/* Name */}
                                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                                {template.name}
                                            </Typography>

                                            {/* Description */}
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                                                {template.description}
                                            </Typography>

                                            {/* Tags */}
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                                                <Chip
                                                    label={TEMPLATE_CATEGORIES[template.category]?.label || template.category}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: TEMPLATE_CATEGORIES[template.category]?.color,
                                                        color: 'white',
                                                    }}
                                                />
                                                {template.genderSpecific !== 'all' && (
                                                    <Chip label={template.genderSpecific} size="small" variant="outlined" />
                                                )}
                                            </Box>

                                            {/* Stats */}
                                            <Typography variant="caption" color="text.secondary">
                                                {template.sections?.length || 0} sections •{' '}
                                                {template.sections?.reduce((acc, s) => acc + (s.fields?.length || 0), 0) || 0} fields
                                            </Typography>
                                        </CardContent>

                                        <CardActions sx={{ p: 2, pt: 0 }}>
                                            <Button
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => handlePreview(template)}
                                            >
                                                Preview
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={() => handleUseTemplate(template)}
                                                sx={{ ml: 'auto' }}
                                            >
                                                Use Template
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </DialogContent>

                <DialogActions>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 'auto', ml: 2 }}>
                        {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
                    </Typography>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Preview Dialog */}
            {selectedTemplate && (
                <Dialog
                    open={showPreview}
                    onClose={() => setShowPreview(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">{selectedTemplate.name}</Typography>
                            <IconButton onClick={() => setShowPreview(false)} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            {selectedTemplate.description}
                        </Typography>

                        <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                            Template Structure:
                        </Typography>

                        {selectedTemplate.sections?.map((section, index) => (
                            <Box key={section.id} sx={{ mb: 2, pl: 2, borderLeft: 2, borderColor: 'primary.main' }}>
                                <Typography variant="body2" fontWeight={600}>
                                    {index + 1}. {section.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {section.fields?.length || 0} fields
                                    {section.description && ` • ${section.description}`}
                                </Typography>
                                <Box sx={{ pl: 2, mt: 0.5 }}>
                                    {section.fields?.map((field) => (
                                        <Typography key={field.id} variant="caption" display="block" color="text.secondary">
                                            • {field.label} ({field.type})
                                            {field.required && ' *'}
                                        </Typography>
                                    ))}
                                </Box>
                            </Box>
                        ))}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setShowPreview(false)}>Close</Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                handleUseTemplate(selectedTemplate);
                                setShowPreview(false);
                            }}
                        >
                            Use This Template
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default StarterTemplatesGallery;
