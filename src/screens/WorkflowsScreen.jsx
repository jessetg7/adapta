import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import { Add as AddIcon, AccountTree as WorkflowIcon } from '@mui/icons-material';
import { useWorkflow } from '../context/WorkflowContext';

function WorkflowsScreen() {
  const { workflows } = useWorkflow();

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>Workflows</Typography>
          <Typography color="text.secondary">Design and manage workflow processes</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>Create Workflow</Button>
      </Box>

      {workflows.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'grey.50', borderRadius: 2, border: '2px dashed', borderColor: 'grey.300' }}>
          <WorkflowIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">No workflows yet</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {workflows.map((wf) => (
            <Grid item xs={12} md={4} key={wf.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{wf.name}</Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>{wf.description}</Typography>
                  <Typography variant="body2">{wf.steps?.length || 0} steps</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default WorkflowsScreen;