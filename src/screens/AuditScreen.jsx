import React, { useState } from 'react';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, InputAdornment, Button } from '@mui/material';
import { Search as SearchIcon, FileDownload as ExportIcon, History as HistoryIcon } from '@mui/icons-material';
import { useAudit } from '../context/AuditContext';

function AuditScreen() {
  const { auditLogs, exportLogs } = useAudit();
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter(log =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>Audit Logs</Typography>
          <Typography color="text.secondary">Track all system activities</Typography>
        </Box>
        <Button variant="outlined" startIcon={<ExportIcon />} onClick={exportLogs}>Export</Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <TextField fullWidth size="small" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        </Box>
      </Card>

      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'grey.50', borderRadius: 2, border: '2px dashed', borderColor: 'grey.300' }}>
          <HistoryIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">No audit logs yet</Typography>
        </Box>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.slice(0, 50).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell><Chip label={log.action} size="small" /></TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell><Typography variant="caption">{JSON.stringify(log.details)}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
}

export default AuditScreen;