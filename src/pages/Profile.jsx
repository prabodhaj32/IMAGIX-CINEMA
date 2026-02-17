import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  CalendarToday,
  LocationOn,
  Edit,
  Logout,
  Settings,
  AccountCircle,
  Movie,
  BookmarkBorder,
  History,
  Lock,
  Save,
  Close,
} from '@mui/icons-material';

const Profile = ({ darkMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    joinDate: 'January 15, 2024',
    location: 'New York, USA',
    avatar: null,
  });

  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // User activity state
  const [userActivity, setUserActivity] = useState({
    moviesWatched: 0,
    favorites: 0,
    bookings: 0,
    daysActive: 0,
    recentMovies: [],
    upcomingBookings: [],
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('userCredentials');
    const currentUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(prevUser => ({
        ...prevUser,
        name: userData.fullName || userData.name || 'User',
        email: userData.email || 'user@example.com',
        joinDate: userData.joinDate || new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
      }));
      setEditForm({
        name: userData.fullName || userData.name || 'User',
        email: userData.email || 'user@example.com',
        phone: userData.phone || '+1 234 567 8900',
        location: userData.location || 'New York, USA',
      });
    }
    
    if (currentUser) {
      const currentData = JSON.parse(currentUser);
      setUser(prevUser => ({
        ...prevUser,
        ...currentData,
      }));
      setEditForm(prevForm => ({
        ...prevForm,
        ...currentData,
      }));
    }
  }, []);

  // Update editForm when user data changes
  useEffect(() => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
    });
  }, [user]);

  // Load and calculate user activity data
  useEffect(() => {
    const loadUserActivity = () => {
      // Get stored activity data or initialize with defaults
      const storedActivity = localStorage.getItem('userActivity');
      const storedFavorites = localStorage.getItem('favorites');
      const storedBookings = localStorage.getItem('userBookings');
      
      let activity = {
        moviesWatched: 0,
        favorites: 0,
        bookings: 0,
        daysActive: 0,
        recentMovies: [],
        upcomingBookings: [],
      };

      // Parse real data from localStorage
      let favorites = [];
      let bookings = [];
      
      if (storedFavorites) {
        try {
          favorites = JSON.parse(storedFavorites);
        } catch (e) {
          favorites = [];
        }
      }
      
      if (storedBookings) {
        try {
          bookings = JSON.parse(storedBookings);
        } catch (e) {
          bookings = [];
        }
      }

      if (storedActivity) {
        activity = JSON.parse(storedActivity);
        // Update with real counts
        activity.favorites = Array.isArray(favorites) ? favorites.length : 0;
        activity.bookings = Array.isArray(bookings) ? bookings.length : 0;
      } else {
        // Calculate days active from join date
        const joinDate = user.joinDate || new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        const joinDateTime = new Date(joinDate);
        const today = new Date();
        const diffTime = Math.abs(today - joinDateTime);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        activity = {
          moviesWatched: Math.floor(Math.random() * 50) + 10, // Simulated data
          favorites: Array.isArray(favorites) ? favorites.length : 0, // Real data
          bookings: Array.isArray(bookings) ? bookings.length : 0, // Real data
          daysActive: diffDays,
          recentMovies: [
            { id: 1, title: "The Matrix", date: "2024-01-15", rating: 4.5 },
            { id: 2, title: "Inception", date: "2024-01-10", rating: 4.8 },
            { id: 3, title: "Interstellar", date: "2024-01-05", rating: 4.7 },
          ],
          upcomingBookings: Array.isArray(bookings) ? bookings.slice(0, 3).map(booking => ({
            id: booking.id || Math.random().toString(36).substr(2, 9),
            movie: booking.movieTitle || booking.movie?.title || "Movie Title",
            date: booking.date || new Date().toISOString().split('T')[0],
            time: booking.time || "7:30 PM",
            seats: booking.seats || "A12, A13"
          })) : [
            { id: 1, movie: "Dune: Part Two", date: "2024-02-15", time: "7:30 PM", seats: "A12, A13" },
            { id: 2, movie: "Oppenheimer", date: "2024-02-20", time: "8:00 PM", seats: "B5, B6" },
          ],
        };
        
        // Save to localStorage
        localStorage.setItem('userActivity', JSON.stringify(activity));
      }
      
      setUserActivity(activity);
    };

    loadUserActivity();
    
    // Listen for changes in favorites and bookings
    const handleStorageChange = () => {
      loadUserActivity();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleStorageChange);
    window.addEventListener('bookingsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
      window.removeEventListener('bookingsUpdated', handleStorageChange);
    };
  }, [user.joinDate]);

  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear user session and redirect to login
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    window.location.href = '/';
    handleMenuClose();
  };

  const handleEditProfile = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleSettings = () => {
    // Handle settings logic here
    console.log('Opening settings...');
    handleMenuClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEditFormChange = (field) => (event) => {
    setEditForm({ ...editForm, [field]: event.target.value });
  };

  const handlePasswordFormChange = (field) => (event) => {
    setPasswordForm({ ...passwordForm, [field]: event.target.value });
  };

  const handleSaveProfile = () => {
    // Validate form
    if (!editForm.name || !editForm.email) {
      setSnackbar({
        open: true,
        message: 'Name and email are required',
        severity: 'error',
      });
      return;
    }

    // Update user data
    const updatedUser = { ...user, ...editForm };
    setUser(updatedUser);
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Also update userCredentials if it exists
    const storedCredentials = localStorage.getItem('userCredentials');
    if (storedCredentials) {
      const credentials = JSON.parse(storedCredentials);
      const updatedCredentials = { ...credentials, ...editForm };
      localStorage.setItem('userCredentials', JSON.stringify(updatedCredentials));
    }
    
    // Dispatch custom events to notify other components
    window.dispatchEvent(new CustomEvent('userUpdated', { 
      detail: updatedUser 
    }));
    window.dispatchEvent(new CustomEvent('profileUpdated', { 
      detail: updatedUser 
    }));
    
    setEditDialogOpen(false);
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Profile updated successfully!',
      severity: 'success',
    });
  };

  const handleChangePassword = () => {
    // Validate password form
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setSnackbar({
        open: true,
        message: 'Current password and new password are required',
        severity: 'error',
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'New passwords do not match',
        severity: 'error',
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setSnackbar({
        open: true,
        message: 'Password must be at least 6 characters long',
        severity: 'error',
      });
      return;
    }

    // Simulate password change
    setPasswordDialogOpen(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    
    setSnackbar({
      open: true,
      message: 'Password changed successfully!',
      severity: 'success',
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 12,
        px: 3,
        background: darkMode 
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper
        elevation={8}
        sx={{
          p: 4,
          mb: 4,
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          color: darkMode ? '#ffffff' : '#1e293b',
          borderRadius: '24px',
          border: darkMode 
            ? '1px solid rgba(139, 92, 246, 0.3)'
            : '1px solid rgba(139, 92, 246, 0.2)',
          backdropFilter: 'blur(10px)',
          boxShadow: darkMode
            ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.2)'
            : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(139, 92, 246, 0.1)',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                src={user.avatar}
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '3rem',
                  border: '4px solid #8b5cf6',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                }}
              >
                <Person sx={{ fontSize: '4rem' }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#a78bfa' : '#6b7280', mb: 2 }}>
                {user.email}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                size="small"
                onClick={handleEditProfile}
                sx={{
                  borderColor: '#8b5cf6',
                  color: '#8b5cf6',
                  background: 'rgba(139, 92, 246, 0.1)',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderColor: '#7c3aed',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Edit Photo
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Profile Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 2,
                borderRadius: '12px',
                background: darkMode 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)',
                border: darkMode 
                  ? '1px solid rgba(139, 92, 246, 0.2)'
                  : '1px solid rgba(139, 92, 246, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(167, 139, 250, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
                  transform: 'translateX(4px)',
                },
              }}>
                <Person sx={{ color: '#8b5cf6', fontSize: '1.5rem' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: darkMode ? '#a78bfa' : '#6b7280', fontSize: '0.875rem' }}>
                    Full Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: '500' }}>
                    {user.name || 'Not specified'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 2,
                borderRadius: '12px',
                background: darkMode 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)',
                border: darkMode 
                  ? '1px solid rgba(139, 92, 246, 0.2)'
                  : '1px solid rgba(139, 92, 246, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(167, 139, 250, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
                  transform: 'translateX(4px)',
                },
              }}>
                <Email sx={{ color: '#8b5cf6', fontSize: '1.5rem' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: darkMode ? '#a78bfa' : '#6b7280', fontSize: '0.875rem' }}>
                    Email Address
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: '500' }}>
                    {user.email || 'Not specified'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 2,
                borderRadius: '12px',
                background: darkMode 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)',
                border: darkMode 
                  ? '1px solid rgba(139, 92, 246, 0.2)'
                  : '1px solid rgba(139, 92, 246, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(167, 139, 250, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
                  transform: 'translateX(4px)',
                },
              }}>
                <Phone sx={{ color: '#8b5cf6', fontSize: '1.5rem' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: darkMode ? '#a78bfa' : '#6b7280', fontSize: '0.875rem' }}>
                    Phone Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: '500' }}>
                    {user.phone || 'Not specified'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 2,
                borderRadius: '12px',
                background: darkMode 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)',
                border: darkMode 
                  ? '1px solid rgba(139, 92, 246, 0.2)'
                  : '1px solid rgba(139, 92, 246, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(167, 139, 250, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
                  transform: 'translateX(4px)',
                },
              }}>
                <LocationOn sx={{ color: '#8b5cf6', fontSize: '1.5rem' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: darkMode ? '#a78bfa' : '#6b7280', fontSize: '0.875rem' }}>
                    Location
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: '500' }}>
                    {user.location || 'Not specified'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 2,
                borderRadius: '12px',
                background: darkMode 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)',
                border: darkMode 
                  ? '1px solid rgba(139, 92, 246, 0.2)'
                  : '1px solid rgba(139, 92, 246, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(167, 139, 250, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
                  transform: 'translateX(4px)',
                },
              }}>
                <CalendarToday sx={{ color: '#8b5cf6', fontSize: '1.5rem' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: darkMode ? '#a78bfa' : '#6b7280', fontSize: '0.875rem' }}>
                    Member Since
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: '500' }}>
                    {user.joinDate || 'Not specified'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Quick Actions
              </Typography>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditProfile}
                fullWidth
                sx={{
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  border: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={handleSettings}
                fullWidth
                sx={{
                  mb: 2,
                  borderColor: '#8b5cf6',
                  color: '#8b5cf6',
                  background: 'rgba(139, 92, 246, 0.1)',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderColor: '#7c3aed',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Settings
              </Button>
              <Button
                variant="outlined"
                startIcon={<Lock />}
                onClick={() => setPasswordDialogOpen(true)}
                fullWidth
                sx={{
                  borderColor: '#8b5cf6',
                  color: '#8b5cf6',
                  background: 'rgba(139, 92, 246, 0.1)',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderColor: '#7c3aed',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Change Password
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Activity Overview */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Activity Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: darkMode ? '#1e293b' : '#ffffff',
              color: darkMode ? '#ffffff' : '#000000',
              textAlign: 'center',
              py: 3,
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              },
            }}
          >
            <CardContent>
              <Movie sx={{ fontSize: '3rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {userActivity.moviesWatched}
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#a78bfa' : '#6b7280' }}>
                Movies Watched
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#c4b5fd' : '#9ca3af', mt: 1 }}>
                All time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              color: darkMode ? '#ffffff' : '#1e293b',
              textAlign: 'center',
              py: 3,
              border: darkMode 
                ? '1px solid rgba(139, 92, 246, 0.3)'
                : '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '16px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: darkMode
                  ? '0 20px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.2)'
                  : '0 20px 40px rgba(139, 92, 246, 0.2), 0 0 0 1px rgba(139, 92, 246, 0.1)',
              },
            }}
          >
            <CardContent>
              <BookmarkBorder sx={{ fontSize: '3rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {userActivity.favorites}
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#a78bfa' : '#6b7280' }}>
                Favorites
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#c4b5fd' : '#9ca3af', mt: 1 }}>
                Total saved
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              color: darkMode ? '#ffffff' : '#1e293b',
              textAlign: 'center',
              py: 3,
              border: darkMode 
                ? '1px solid rgba(139, 92, 246, 0.3)'
                : '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '16px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: darkMode
                  ? '0 20px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.2)'
                  : '0 20px 40px rgba(139, 92, 246, 0.2), 0 0 0 1px rgba(139, 92, 246, 0.1)',
              },
            }}
          >
            <CardContent>
              <History sx={{ fontSize: '3rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {userActivity.bookings}
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#a78bfa' : '#6b7280' }}>
                Bookings
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#c4b5fd' : '#9ca3af', mt: 1 }}>
                Active & Past
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              color: darkMode ? '#ffffff' : '#1e293b',
              textAlign: 'center',
              py: 3,
              border: darkMode 
                ? '1px solid rgba(139, 92, 246, 0.3)'
                : '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '16px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: darkMode
                  ? '0 20px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.2)'
                  : '0 20px 40px rgba(139, 92, 246, 0.2), 0 0 0 1px rgba(139, 92, 246, 0.1)',
              },
            }}
          >
            <CardContent>
              <CalendarToday sx={{ fontSize: '3rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {userActivity.daysActive}
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#a78bfa' : '#6b7280' }}>
                Days Active
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#c4b5fd' : '#9ca3af', mt: 1 }}>
                Since joining
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      
      {/* Account Actions */}
      <Paper
        elevation={8}
        sx={{
          p: 4,
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          color: darkMode ? '#ffffff' : '#1e293b',
          borderRadius: '24px',
          border: darkMode 
            ? '1px solid rgba(139, 92, 246, 0.3)'
            : '1px solid rgba(139, 92, 246, 0.2)',
          backdropFilter: 'blur(10px)',
          boxShadow: darkMode
            ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.2)'
            : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(139, 92, 246, 0.1)',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Account Management
        </Typography>
        <Divider sx={{ mb: 3, borderColor: 'rgba(139, 92, 246, 0.2)' }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Profile Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                fullWidth
                onClick={handleEditProfile}
                sx={{
                  borderColor: '#8b5cf6',
                  color: '#8b5cf6',
                  background: 'rgba(139, 92, 246, 0.1)',
                  py: 1.5,
                  justifyContent: 'flex-start',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderColor: '#7c3aed',
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Update Profile Information
              </Button>
              <Button
                variant="outlined"
                startIcon={<Lock />}
                fullWidth
                onClick={() => setPasswordDialogOpen(true)}
                sx={{
                  borderColor: '#8b5cf6',
                  color: '#8b5cf6',
                  background: 'rgba(139, 92, 246, 0.1)',
                  py: 1.5,
                  justifyContent: 'flex-start',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderColor: '#7c3aed',
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Change Password
              </Button>
              <Button
                variant="outlined"
                startIcon={<Settings />}
                fullWidth
                onClick={handleSettings}
                sx={{
                  borderColor: '#8b5cf6',
                  color: '#8b5cf6',
                  background: 'rgba(139, 92, 246, 0.1)',
                  py: 1.5,
                  justifyContent: 'flex-start',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderColor: '#7c3aed',
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Account Settings
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Quick Access
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                component="a"
                href="/favorites"
                startIcon={<BookmarkBorder />}
                fullWidth
                sx={{
                  borderColor: '#8b5cf6',
                  color: '#8b5cf6',
                  background: 'rgba(139, 92, 246, 0.1)',
                  py: 1.5,
                  justifyContent: 'flex-start',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderColor: '#7c3aed',
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                View Favorites
              </Button>
              <Button
                variant="outlined"
                component="a"
                href="/my-bookings"
                startIcon={<History />}
                fullWidth
                sx={{
                  borderColor: '#8b5cf6',
                  color: '#8b5cf6',
                  background: 'rgba(139, 92, 246, 0.1)',
                  py: 1.5,
                  justifyContent: 'flex-start',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderColor: '#7c3aed',
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                My Bookings
              </Button>
              <Button
                variant="contained"
                startIcon={<Logout />}
                fullWidth
                onClick={handleLogout}
                sx={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                  },
                  py: 1.5,
                  justifyContent: 'flex-start',
                  transition: 'all 0.3s ease',
                }}
              >
                Logout from Account
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(51, 65, 85, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
            color: darkMode ? '#ffffff' : '#1e293b',
            borderRadius: '20px',
            border: darkMode 
              ? '1px solid rgba(139, 92, 246, 0.3)'
              : '1px solid rgba(139, 92, 246, 0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: darkMode
              ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.2)'
              : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <Edit />
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={editForm.name}
              onChange={handleEditFormChange('name')}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                    borderWidth: '2px',
                  },
                },
              }}
            />
            <TextField
              label="Email"
              type="email"
              value={editForm.email}
              onChange={handleEditFormChange('email')}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                    borderWidth: '2px',
                  },
                },
              }}
            />
            <TextField
              label="Phone"
              value={editForm.phone}
              onChange={handleEditFormChange('phone')}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                    borderWidth: '2px',
                  },
                },
              }}
            />
            <TextField
              label="Location"
              value={editForm.location}
              onChange={handleEditFormChange('location')}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                    borderWidth: '2px',
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            startIcon={<Close />}
            sx={{
              borderColor: '#8b5cf6',
              color: '#8b5cf6',
              background: 'rgba(139, 92, 246, 0.1)',
              '&:hover': {
                background: 'rgba(139, 92, 246, 0.2)',
                borderColor: '#7c3aed',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            variant="contained"
            startIcon={<Save />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(51, 65, 85, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
            color: darkMode ? '#ffffff' : '#1e293b',
            borderRadius: '20px',
            border: darkMode 
              ? '1px solid rgba(139, 92, 246, 0.3)'
              : '1px solid rgba(139, 92, 246, 0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: darkMode
              ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.2)'
              : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <Lock />
          Change Password
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordFormChange('currentPassword')}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                    borderWidth: '2px',
                  },
                },
              }}
            />
            <TextField
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordFormChange('newPassword')}
              fullWidth
              variant="outlined"
              helperText="Password must be at least 6 characters long"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                    borderWidth: '2px',
                  },
                },
              }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordFormChange('confirmPassword')}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                    borderWidth: '2px',
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setPasswordDialogOpen(false)}
            startIcon={<Close />}
            sx={{
              borderColor: '#8b5cf6',
              color: '#8b5cf6',
              background: 'rgba(139, 92, 246, 0.1)',
              '&:hover': {
                background: 'rgba(139, 92, 246, 0.2)',
                borderColor: '#7c3aed',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            startIcon={<Save />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            background: snackbar.severity === 'error' 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    </Box>
  );
};

export default Profile;
