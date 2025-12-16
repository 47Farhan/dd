import React, { useEffect, useState } from 'react';
import { 
  Grid, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, 
  CircularProgress, Box, Card, CardContent, Avatar, Chip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/admin/dashboard', { headers });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `Status ${res.status}`);
        }
        const data = await res.json();
        setStats(data.data || {});
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
        setError(err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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

  const statCards = [
    {
      title: 'Total Revenue',
      value: `£${Number(stats.totalRevenue ?? 0).toFixed(2)}`,
      icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      bgColor: '#e8f5e9',
      change: '+12.5%'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders ?? 0,
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: '#2196f3',
      bgColor: '#e3f2fd',
      change: '+8.2%'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts ?? 0,
      icon: <Inventory2Icon sx={{ fontSize: 40 }} />,
      color: '#ff9800',
      bgColor: '#fff3e0',
      change: '+5.1%'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers ?? 0,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      bgColor: '#f3e5f5',
      change: '+15.3%'
    },
  ];

  return (
    <div>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={600} color="#2c3e50">
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's what's happening with your store today.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color={stat.color} sx={{ mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                      <Typography variant="caption" color="#4caf50" fontWeight={600}>
                        {stat.change}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        vs last month
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      width: 56,
                      height: 56
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card 
        elevation={0}
        sx={{ 
          borderRadius: 3,
          border: '1px solid #e0e0e0'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Recent Orders
            </Typography>
            <Chip label="Live" color="success" size="small" />
          </Box>
          
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#5f6368' }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#5f6368' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#5f6368' }}>Total Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#5f6368' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#5f6368' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(stats.recentOrders || []).length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <TableRow 
                      key={order._id}
                      sx={{ 
                        '&:hover': { bgcolor: '#f5f5f5' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          #{order._id.slice(-8).toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#2196f3', fontSize: '0.875rem' }}>
                            {(order.user?.name || 'U')[0].toUpperCase()}
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
                        <Typography variant="body2" fontWeight={600} color="#4caf50">
                          £{Number(order.totalPrice ?? order.totalAmount ?? 0).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.payment?.status === 'completed' ? 'Paid' : order.status || 'Pending'}
                          size="small"
                          color={order.payment?.status === 'completed' ? 'success' : 'warning'}
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
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.createdAt).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No recent orders</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
