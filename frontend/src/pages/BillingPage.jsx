import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Autocomplete,
    List,
    ListItem,
    ListItemText,
    Divider,
    Container,
    Card,
    CardContent,
    Avatar,
    useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation, useNavigate } from 'react-router-dom';
import usePatientStore from '../core/store/usePatientStore';
import useTemplateStore from '../core/store/useTemplateStore';

const BillingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const { patients } = usePatientStore();
    const { templates } = useTemplateStore();

    const [selectedPatientId, setSelectedPatientId] = useState(location.state?.patientId || '');
    const [items, setItems] = useState([
        { id: 1, description: 'Consultation Fee', quantity: 1, unitPrice: 500 },
    ]);
    const [discount, setDiscount] = useState(0);
    const [paymentMode, setPaymentMode] = useState('cash');
    const [showInvoiceOpen, setShowInvoiceOpen] = useState(false);

    const selectedPatient = useMemo(() => {
        return patients[selectedPatientId] || null;
    }, [selectedPatientId, patients]);

    const totalAmount = useMemo(() => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        return Math.max(0, subtotal - discount);
    }, [items, discount]);

    // --- Service Catalog State ---
    const [services, setServices] = useState(() => {
        const saved = localStorage.getItem('adapta_services');
        return saved ? JSON.parse(saved) : [
            { id: 'S001', name: 'General Consultation', price: 500 },
            { id: 'S002', name: 'Specialist Consultation', price: 800 },
            { id: 'S003', name: 'Follow-up Visit', price: 300 },
            { id: 'S004', name: 'Emergency Consultation', price: 1000 },

            // Lab Tests
            { id: 'L001', name: 'CBC (Complete Blood Count)', price: 350 },
            { id: 'L002', name: 'Blood Sugar (Fasting)', price: 100 },
            { id: 'L003', name: 'Blood Sugar (PP)', price: 100 },
            { id: 'L004', name: 'HbA1c', price: 600 },
            { id: 'L005', name: 'Lipid Profile', price: 650 },
            { id: 'L006', name: 'Liver Function Test (LFT)', price: 550 },
            { id: 'L007', name: 'Kidney Function Test (KFT)', price: 600 },
            { id: 'L008', name: 'Thyroid Profile (T3, T4, TSH)', price: 800 },
            { id: 'L009', name: 'Urine Routine', price: 150 },
            { id: 'L010', name: 'Vitamin D', price: 1200 },
            { id: 'L011', name: 'Vitamin B12', price: 1000 },

            // Radiology/Imaging
            { id: 'R001', name: 'X-Ray (Chest PA)', price: 400 },
            { id: 'R002', name: 'X-Ray (Knee AP/LAT)', price: 600 },
            { id: 'R003', name: 'Ultrasound (Whole Abdomen)', price: 1200 },
            { id: 'R004', name: 'Ultrasound (Pelvis)', price: 900 },
            { id: 'R005', name: 'ECG', price: 300 },
            { id: 'R006', name: 'CT Scan (Head)', price: 3500 },

            // Procedures
            { id: 'P001', name: 'Dressing (minor)', price: 200 },
            { id: 'P002', name: 'Dressing (major)', price: 500 },
            { id: 'P003', name: 'Injection (IM/IV)', price: 150 },
            { id: 'P004', name: 'IV Cannulation', price: 250 },
            { id: 'P005', name: 'IV Fluids (Drip)', price: 500 },
            { id: 'P006', name: 'Nebulization', price: 150 },
            { id: 'P007', name: 'Suture Removal', price: 300 },
            { id: 'P008', name: 'Catheterization', price: 800 },

            // Surgeries/Packages
            { id: 'PKG001', name: 'Normal Delivery Package', price: 25000 },
            { id: 'PKG002', name: 'C-Section Package', price: 45000 },
            { id: 'PKG003', name: 'Appendectomy', price: 30000 },
            { id: 'PKG004', name: 'Cataract Surgery', price: 20000 },

            // Inpatient Charges
            { id: 'IPD001', name: 'General Ward (Per Day)', price: 1000 },
            { id: 'IPD002', name: 'Semi-Private Room (Per Day)', price: 2500 },
            { id: 'IPD003', name: 'Private Room (Per Day)', price: 4000 },
            { id: 'IPD004', name: 'ICU Charges (Per Day)', price: 8000 },
            { id: 'IPD005', name: 'Nursing Charges (Per Day)', price: 500 },
        ];
    });

    const [selectedService, setSelectedService] = useState(null);
    const [showServiceManager, setShowServiceManager] = useState(false);
    const [newService, setNewService] = useState({ name: '', price: '' });
    const [editingServiceId, setEditingServiceId] = useState(null);

    // --- Service Management Handlers ---
    const handleSaveService = () => {
        if (!newService.name || !newService.price) return;

        let updatedServices;
        if (editingServiceId) {
            updatedServices = services.map(s =>
                s.id === editingServiceId ? { ...s, name: newService.name, price: Number(newService.price) } : s
            );
            setEditingServiceId(null);
        } else {
            const newId = `CUST-${Date.now()}`;
            updatedServices = [...services, { id: newId, name: newService.name, price: Number(newService.price) }];
        }

        setServices(updatedServices);
        localStorage.setItem('adapta_services', JSON.stringify(updatedServices));
        setNewService({ name: '', price: '' });
    };

    const handleEditService = (service) => {
        setNewService({ name: service.name, price: service.price });
        setEditingServiceId(service.id);
    };

    const handleDeleteService = (id) => {
        const updatedServices = services.filter(s => s.id !== id);
        setServices(updatedServices);
        localStorage.setItem('adapta_services', JSON.stringify(updatedServices));
        if (editingServiceId === id) {
            setNewService({ name: '', price: '' });
            setEditingServiceId(null);
        }
    };

    const handleAddService = () => {
        if (selectedService) {
            setItems([
                ...items,
                {
                    id: Date.now(),
                    description: selectedService.name,
                    quantity: 1,
                    unitPrice: selectedService.price
                }
            ]);
            setSelectedService(null);
        } else {
            // Fallback for manual entry
            setItems([
                ...items,
                { id: Date.now(), description: 'New Item', quantity: 1, unitPrice: 0 }
            ]);
        }
    };

    const handleUpdateItem = (id, field, value) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleDeleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', flexGrow: 1, pb: 4 }}>

            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    py: 3,
                    px: 3,
                    mb: 4,
                    borderRadius: 0,
                    bgcolor: 'background.paper',

                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '@media print': { display: 'none' }
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>

                                <ArrowBackIcon />
                            </IconButton>
                            <Box>
                                <Typography variant="h5" fontWeight={700} color="text.primary">
                                    Patient Billing
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Create invoices and manage payments
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ReceiptLongIcon />}
                            onClick={() => setShowInvoiceOpen(true)}
                            disabled={!selectedPatient}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                boxShadow: theme.shadows[4]
                            }}
                        >
                            Generate Invoice
                        </Button>
                    </Box>
                </Container>
            </Paper>

            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    {/* Patient Selection */}
                    <Grid item xs={12} md={4} sx={{ '@media print': { display: 'none' } }}>
                        <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>Patient Details</Typography>
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel>Select Patient</InputLabel>
                                    <Select
                                        value={selectedPatientId}
                                        label="Select Patient"
                                        onChange={(e) => setSelectedPatientId(e.target.value)}
                                    >
                                        {Object.values(patients).map(patient => (
                                            <MenuItem key={patient.id} value={patient.id}>
                                                {patient.firstName} {patient.lastName} (ID: {patient.id.slice(0, 8)})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {selectedPatient && (
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: 'primary.light',
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'primary.main',
                                        opacity: 0.9
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                                                <PersonIcon fontSize="large" />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" fontWeight={600} color="primary.dark">
                                                    {selectedPatient.firstName} {selectedPatient.lastName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: {selectedPatient.id.slice(0, 12)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Typography variant="body2" color="text.primary">
                                                <strong>Age:</strong> {selectedPatient.age} years
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                <strong>Gender:</strong> {selectedPatient.gender}
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                <strong>Phone:</strong> {selectedPatient.phone}
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                <strong>Last Visit:</strong> {new Date().toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Start Invoice Creator */}
                    <Grid item xs={12} md={8}>
                        <Card elevation={2} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>Invoice Items</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width="40%">Description</TableCell>
                                                <TableCell width="15%" align="center">Qty</TableCell>
                                                <TableCell width="20%" align="right">Price</TableCell>
                                                <TableCell width="15%" align="right">Total</TableCell>
                                                <TableCell width="10%"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            value={item.description}
                                                            onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                                                            placeholder="Item Name"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            value={item.quantity}
                                                            onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                            inputProps={{ min: 1, style: { textAlign: 'center' } }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            value={item.unitPrice}
                                                            onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        ₹{(item.quantity * item.unitPrice).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton size="small" color="error" onClick={() => handleDeleteItem(item.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Service Selection */}
                                <Box sx={{ mt: 3, mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="subtitle2">Add Service / Item</Typography>
                                        <Button
                                            startIcon={<SettingsIcon />}
                                            size="small"
                                            onClick={() => setShowServiceManager(true)}
                                        >
                                            Manage Services
                                        </Button>
                                    </Box>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={8}>
                                            <Autocomplete
                                                options={services}
                                                getOptionLabel={(option) => `${option.name} (₹${option.price})`}
                                                value={selectedService}
                                                onChange={(event, newValue) => setSelectedService(newValue)}
                                                renderInput={(params) => <TextField {...params} label="Search Service..." size="small" fullWidth />}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={handleAddService}
                                                fullWidth
                                                disabled={!selectedService}
                                            >
                                                Add to Bill
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        Can't find a service? You can still manually edit the rows above or add a blank row.
                                    </Typography>
                                    <Button size="small" onClick={() => setItems([...items, { id: Date.now(), description: '', quantity: 1, unitPrice: 0 }])}>
                                        Add Manual Row
                                    </Button>
                                </Box>

                                {/* ... (existing total calculation section) ... */}
                                <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
                                    <Grid container spacing={2} justifyContent="flex-end">
                                        <Grid item xs={6} md={4}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography>Subtotal:</Typography>
                                                <Typography>₹{items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0).toFixed(2)}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography>Discount:</Typography>
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={discount}
                                                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                                    sx={{ width: 100 }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                <Typography variant="h6" fontWeight="bold">Total:</Typography>
                                                <Typography variant="h6" fontWeight="bold" color="primary.main">
                                                    ₹{totalAmount.toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            {/* Invoice Preview Dialog */}
            <Dialog
                open={showInvoiceOpen}
                onClose={() => setShowInvoiceOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Invoice Preview
                    <IconButton
                        onClick={() => setShowInvoiceOpen(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <DeleteIcon /> {/* Using DeleteIcon for close button temporarily */}
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ p: 2 }} id="printable-invoice">
                        {/* Invoice Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" color="primary">HOSPITAL NAME</Typography>
                                <Typography variant="body2" color="text.secondary">123 Health Street, Medical District</Typography>
                                <Typography variant="body2" color="text.secondary">Phone: +91 98765 43210</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h5" color="text.secondary">INVOICE</Typography>
                                <Typography variant="body1">#{Math.floor(Math.random() * 10000)}</Typography>
                                <Typography variant="body2">Date: {new Date().toLocaleDateString()}</Typography>
                            </Box>
                        </Box>

                        {/* Bill To */}
                        {selectedPatient && (
                            <Box sx={{ mb: 4, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>

                                <Typography variant="subtitle2" color="text.secondary">BILL TO:</Typography>
                                <Typography variant="h6">{selectedPatient.firstName} {selectedPatient.lastName}</Typography>
                                <Typography variant="body2">{selectedPatient.phone}</Typography>
                            </Box>
                        )}

                        {/* Print Friendly Table */}
                        <TableContainer sx={{ mb: 4 }}>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: 'action.hover' }}>

                                    <TableRow>
                                        <TableCell><strong>Description</strong></TableCell>
                                        <TableCell align="center"><strong>Qty</strong></TableCell>
                                        <TableCell align="right"><strong>Unit Price</strong></TableCell>
                                        <TableCell align="right"><strong>Total</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell align="center">{item.quantity}</TableCell>
                                            <TableCell align="right">₹{item.unitPrice.toFixed(2)}</TableCell>
                                            <TableCell align="right">₹{(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={2} />
                                        <TableCell align="right"><strong>Subtotal:</strong></TableCell>
                                        <TableCell align="right">₹{items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0).toFixed(2)}</TableCell>
                                    </TableRow>
                                    {discount > 0 && (
                                        <TableRow>
                                            <TableCell colSpan={2} />
                                            <TableCell align="right">Discount:</TableCell>
                                            <TableCell align="right" sx={{ color: 'error.main' }}>-₹{discount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow>
                                        <TableCell colSpan={2} />
                                        <TableCell align="right"><Typography variant="h6">Total:</Typography></TableCell>
                                        <TableCell align="right"><Typography variant="h6">₹{totalAmount.toFixed(2)}</Typography></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Footer */}
                        <Box sx={{ textAlign: 'center', mt: 8, pt: 2, borderTop: '1px solid #ddd' }}>
                            <Typography variant="body2" color="text.secondary">Thank you for choosing us!</Typography>
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                                This is a computer-generated invoice. No signature required.
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowInvoiceOpen(false)}>Close</Button>
                    <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>Print Invoice</Button>
                </DialogActions>
            </Dialog>

            {/* --- Service Manager Dialog --- */}
            <Dialog open={showServiceManager} onClose={() => setShowServiceManager(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Manage Services</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>

                        <Typography variant="subtitle2" gutterBottom>{editingServiceId ? 'Edit Service' : 'Add New Service'}</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={7}>
                                <TextField
                                    label="Service Name"
                                    size="small"
                                    fullWidth
                                    value={newService.name}
                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    label="Price"
                                    size="small"
                                    type="number"
                                    fullWidth
                                    value={newService.price}
                                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ height: '100%' }}
                                    onClick={handleSaveService}
                                    disabled={!newService.name || !newService.price}
                                >
                                    {editingServiceId ? 'Save' : 'Add'}
                                </Button>
                            </Grid>
                            {editingServiceId && (
                                <Grid item xs={12}>
                                    <Button size="small" onClick={() => { setEditingServiceId(null); setNewService({ name: '', price: '' }); }}>Cancel Edit</Button>
                                </Grid>
                            )}
                        </Grid>
                    </Box>

                    <List>
                        {services.map((service) => (
                            <React.Fragment key={service.id}>
                                <ListItem
                                    secondaryAction={
                                        <Box>
                                            <IconButton edge="end" aria-label="edit" onClick={() => handleEditService(service)} sx={{ mr: 1 }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteService(service.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={service.name}
                                        secondary={`Rate: ₹${service.price}`}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                        {services.length === 0 && (
                            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                                No services added yet. Add one above.
                            </Typography>
                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowServiceManager(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default BillingPage;
