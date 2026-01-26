import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon, Rule as RulesIcon } from '@mui/icons-material';

function RulesScreen() {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>Rules Engine</Typography>
          <Typography color="text.secondary">Create and manage IF-THEN rules</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>Create Rule</Button>
      </Box>

      <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'grey.50', borderRadius: 2, border: '2px dashed', borderColor: 'grey.300' }}>
        <RulesIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">No rules configured</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }}>Create Rule</Button>
      </Box>
    </Box>
  );
}

export default RulesScreen;