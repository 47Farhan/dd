import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, Avatar, CircularProgress, TextField, InputAdornment,
  IconButton, Menu, MenuItem, Select, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Use admin orders endpoint for admin management
      const res = await fetch('/api/admin/orders', { headers });
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await res.json();
      setOrders(data.data || data || []);
    } catch (err) {
      console.error('Failed to load orders', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => {
        if (statusFilter === 'paid') return order.payment?.status === 'completed';
        if (statusFilter === 'pending') return order.payment?.status !== 'completed';
        return true;
      });
    }

    setFilteredOrders(filtered);
  };

  const handleMenuClick = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setViewOpen(true);
    handleMenuClose();
  };

  const handleCloseView = () => {
    setViewOpen(false);
    setSelectedOrder(null);
  };

  const handleOpenUpdateStatus = () => {
    setStatusValue(selectedOrder?.status || 'pending');
    setTrackingNumber(selectedOrder?.trackingNumber || '');
    setStatusOpen(true);
    handleMenuClose();
  };

  const handleCloseUpdateStatus = () => {
    setStatusOpen(false);
    setStatusValue('');
    setTrackingNumber('');
    setSelectedOrder(null);
  };

  const handlePrintInvoice = () => {
    if (!selectedOrder) return handleMenuClose();
    const order = selectedOrder;
    const win = window.open('', '_blank');
    const html = `\n      <html>\n      <head>\n        <title>Invoice - ${order._id}</title>\n        <style>\n          body { font-family: Arial, sans-serif; padding: 20px; }\n          h1 { font-size: 20px }\n          table { width: 100%; border-collapse: collapse; }\n          th, td { border: 1px solid #ddd; padding: 8px; }\n        </style>\n      </head>\n      <body>\n        <h1>Invoice</h1>\n        <p><strong>Order:</strong> ${order._id}</p>\n        <p><strong>Customer:</strong> ${order.user?.name || 'Guest'} &lt;${order.user?.email || ''}&gt;</p>\n        <h3>Items</h3>\n        <table>\n          <thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead>\n          <tbody>\n            ${(order.orderItems || order.items || []).map(i => `<tr><td>${i.name || i.title || ''}</td><td>${i.qty || i.quantity || 1}</td><td>£${Number(i.price||i.unitPrice||0).toFixed(2)}</td></tr>`).join('')}\n          </tbody>\n        </table>\n        <h3>Total: £${Number(order.totalPrice||order.totalAmount||0).toFixed(2)}</h3>\n      </body>\n      </html>\n    `;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
    handleMenuClose();
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: statusValue, trackingNumber: trackingNumber || undefined })
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Status ${res.status}`);
      }
      await fetchOrders();
      handleCloseUpdateStatus();
    } catch (err) {
      console.error('Failed to update order status', err);
      setError(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (order) => {
    if (order.payment?.status === 'completed') return 'success';
    if (order.status === 'shipped') return 'info';
    if (order.status === 'cancelled') return 'error';
    return 'warning';
  };

  const getStatusLabel = (order) => {
    if (order.payment?.status === 'completed') return 'Paid';
    if (order.status) return order.status.charAt(0).toUpperCase() + order.status.slice(1);
    return 'Pending';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={600} color="#2c3e50">
          Orders Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage all customer orders
        </Typography>
      </Box>

      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={<FilterListIcon sx={{ ml: 1, mr: -0.5, color: 'action.active' }} />}
              >
                <MenuItem value="all">All Orders</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#5f6368' }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#5f6368' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#5f6368' }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#5f6368' }}>Total Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#5f6368' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#5f6368' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#5f6368' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow
                      key={order._id}
                      sx={{
                        '&:hover': { bgcolor: '#f5f5f5' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500} color="primary">
                          #{order._id.slice(-8).toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#2196f3', fontSize: '0.875rem' }}>
                            {(order.user?.name || 'G')[0].toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {order.user?.name || 'Guest'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.user?.email || '—'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.items?.length || order.orderItems?.length || 0} items
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="#4caf50">
                          £{Number(order.totalPrice || order.totalAmount || 0).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(order)}
                          size="small"
                          color={getStatusColor(order)}
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, order)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {searchTerm || statusFilter !== 'all' ? 'No orders match your filters' : 'No orders found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>View Details</MenuItem>
        <MenuItem onClick={handleOpenUpdateStatus}>Update Status</MenuItem>
        <MenuItem onClick={handlePrintInvoice}>Print Invoice</MenuItem>
      </Menu>

      {/* View Details Dialog */}
      {selectedOrder && (
        <Dialog open={viewOpen} onClose={handleCloseView} maxWidth="md" fullWidth>
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent dividers>
            <Typography variant="subtitle1" gutterBottom><strong>Order ID:</strong> {selectedOrder._id}</Typography>
            <Typography variant="body2" gutterBottom><strong>Customer:</strong> {selectedOrder.user?.name || 'Guest'} ({selectedOrder.user?.email || '—'})</Typography>
            <Typography variant="body2" gutterBottom><strong>Status:</strong> {selectedOrder.status || (selectedOrder.payment?.status === 'completed' ? 'Paid' : 'Pending')}</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Items</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(selectedOrder.orderItems || selectedOrder.items || []).map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{it.name || it.title || it.product || '—'}</TableCell>
                      <TableCell>{it.qty || it.quantity || 1}</TableCell>
                      <TableCell>£{Number(it.price || it.unitPrice || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2"><strong>Total:</strong> £{Number(selectedOrder.totalPrice || selectedOrder.totalAmount || 0).toFixed(2)}</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseView}>Close</Button>
            <Button onClick={() => { handlePrintInvoice(); handleCloseView(); }} variant="contained">Print</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Update Status Dialog */}
      {selectedOrder && (
        <Dialog open={statusOpen} onClose={handleCloseUpdateStatus} maxWidth="sm" fullWidth>
          <DialogTitle>Update Order Status</DialogTitle>
          <form onSubmit={handleUpdateStatusSubmit}>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select value={statusValue} label="Status" onChange={(e) => setStatusValue(e.target.value)}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Tracking Number (optional)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseUpdateStatus}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save'}</Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </div>
  );
};

export default Orders;
