// src/components/TemplateSelector/TemplateSelector.jsx
import React, { useState, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Box,
    InputAdornment,
    Alert,
    Tabs,
    Tab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import useTemplateStore from '../../core/store/useTemplateStore';
import { TEMPLATE_CATEGORIES } from '../../core/registry/fieldConfigs';

/**
 * TemplateSelector - Unified template selection component
 * Allows selecting templates from Template Manager for use in Patient Consultation and Prescription Builder
 */
const TemplateSelector = ({ open, onClose, onSelect, filterCategory = null, title = 'Select Template' }) => {
    const { templates, prescriptionTemplates } = useTemplateStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // Combine all templates
    const allTemplates = useMemo(() => {
        const templateList = Object.values(templates);
        const prescriptionList = Object.values(prescriptionTemplates);
        return [...templateList, ...prescriptionList];
    }, [templates, prescriptionTemplates]);

    // Filter templates
    const filteredTemplates = useMemo(() => {
        return allTemplates.filter((template) => {
            // Filter by search query
            const matchesSearch =
                !searchQuery ||
                template.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.category?.toLowerCase().includes(searchQuery.toLowerCase());

            // Filter by category tab
            const matchesCategory =
                selectedCategory === 'all' || template.category === selectedCategory;

            // Filter by prop filterCategory (e.g., only show 'consultation' templates)
            const matchesFilterCategory =
                !filterCategory || template.category === filterCategory;

            return matchesSearch && matchesCategory && matchesFilterCategory;
        });
    }, [allTemplates, searchQuery, selectedCategory, filterCategory]);

    // Handle template selection
    const handleSelect = () => {
        if (selectedTemplate) {
            onSelect(selectedTemplate);
            handleClose();
        }
    };

    // Handle close
    const handleClose = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedTemplate(null);
        onClose();
    };

    // Get available categories
    const availableCategories = useMemo(() => {
        const categories = new Set(allTemplates.map(t => t.category).filter(Boolean));
        return Array.from(categories);
    }, [allTemplates]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ArticleIcon color="primary" />
                    <Typography variant="h6">{title}</Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {/* Search Bar */}
                <TextField
                    fullWidth
                    placeholder="Search templates by name, type, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    size="small"
                />

                {/* Category Tabs */}
                {!filterCategory && availableCategories.length > 0 && (
                    <Tabs
                        value={selectedCategory}
                        onChange={(e, v) => setSelectedCategory(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="All" value="all" />
                        {availableCategories.map((cat) => (
                            <Tab
                                key={cat}
                                label={TEMPLATE_CATEGORIES[cat]?.label || cat}
                                value={cat}
                            />
                        ))}
                    </Tabs>
                )}

                {/* Templates Grid */}
                {filteredTemplates.length === 0 ? (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        No templates found. Create templates in the Template Manager to use them here.
                    </Alert>
                ) : (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {filteredTemplates.map((template) => (
                            <Grid item xs={12} sm={6} key={template.id}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        border: 2,
                                        borderColor: selectedTemplate?.id === template.id ? 'primary.main' : 'transparent',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            borderColor: 'primary.light',
                                            boxShadow: 2,
                                        },
                                        position: 'relative',
                                    }}
                                    onClick={() => setSelectedTemplate(template)}
                                >
                                    {selectedTemplate?.id === template.id && (
                                        <CheckCircleIcon
                                            color="primary"
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                fontSize: 28,
                                            }}
                                        />
                                    )}

                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 1, pr: 4 }}>
                                            {template.name}
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                                            {template.category && (
                                                <Chip
                                                    label={TEMPLATE_CATEGORIES[template.category]?.label || template.category}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: TEMPLATE_CATEGORIES[template.category]?.color || 'primary.main',
                                                        color: 'white',
                                                    }}
                                                />
                                            )}
                                            {template.type && (
                                                <Chip
                                                    label={template.type}
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            )}
                                        </Box>

                                        <Typography variant="body2" color="text.secondary">
                                            {template.sections?.length || 0} sections •{' '}
                                            {template.sections?.reduce((acc, s) => acc + (s.fields?.length || 0), 0) || 0}{' '}
                                            fields
                                        </Typography>

                                        {template.genderSpecific && template.genderSpecific !== 'all' && (
                                            <Chip
                                                label={`${template.genderSpecific} only`}
                                                size="small"
                                                sx={{ mt: 1 }}
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSelect}
                    variant="contained"
                    disabled={!selectedTemplate}
                    startIcon={<CheckCircleIcon />}
                >
                    Use Template
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TemplateSelector;
