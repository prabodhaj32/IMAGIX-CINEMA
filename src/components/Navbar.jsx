import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Fade,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import {
  Link,
  useLocation,
} from 'react-router-dom';
import {
  Menu as MenuIcon,
  Home,
  Movie,
  CalendarToday,
  Article,
  Person,
  BookmarkBorder,
  AccountCircle,
  Logout,
  Settings,
  Edit,
} from '@mui/icons-material';
import SearchBar from './SearchBar';

const Navbar = ({ darkMode }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
  });

  // Load current user data on component mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setCurrentUser({
        name: userData.name || userData.fullName || 'User',
        email: userData.email || 'user@example.com',
      });
    }
  }, []);

  const isAuthPage =
    location.pathname === '/' || location.pathname === '/register';

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleProfile = () => {
    handleProfileMenuClose();
    // Navigate to profile
  };

  const handleSettings = () => {
    handleProfileMenuClose();
    // Navigate to settings
  };

  const handleLogout = () => {
    // Clear user session and redirect to login
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    setCurrentUser({
      name: 'John Doe',
      email: 'john.doe@example.com',
    });
    window.location.href = '/';
    handleProfileMenuClose();
  };

  // Listen for storage changes to update user data
  React.useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setCurrentUser({
          name: userData.name || userData.fullName || 'User',
          email: userData.email || 'user@example.com',
        });
      }
    };

    // Listen for custom storage event
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleStorageChange);
    };
  }, []);

  return (
    <>
      {/* ================== APP BAR ================== */}
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          backgroundColor: '#1e293b', // 🔥 ONE COLOR
          color: '#fff',
          py: 1,
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
          }}
        >
          {/* ================== LOGO ================== */}
          <Box
            component={Link}
            to="/home"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: '0.2s',
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                backgroundColor: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <Movie sx={{ color: '#fff', fontSize: '1.5rem' }} />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                fontSize: '1.4rem',
                color: '#fff',
                letterSpacing: '1px',
              }}
            >
              IMAGIX CINEMA
            </Typography>
          </Box>

          {/* ================== DESKTOP MENU ================== */}
          {!isAuthPage && (
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1,
              }}
            >
              {[
                { label: 'Home', icon: <Home />, to: '/home' },
                // { label: 'Schedule', icon: <CalendarToday />, to: '/schedule' },
                // { label: 'Movies', icon: <Movie />, to: '/home' },
                // { label: 'News', icon: <Article />, to: '/news' },
              ].map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.to}
                  startIcon={item.icon}
                  sx={{
                    color: '#fff',
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    px: 2,
                    py: 1,
                    borderRadius: '10px',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-2px)',
                    },
                    transition: '0.3s',
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* SEARCH */}
              <Box sx={{ minWidth: 260, ml: 2 }}>
                <SearchBar darkMode={darkMode} variant="glass" />
              </Box>

              {/* ACTIONS */}
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/favorites"
                  sx={{
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.4)',
                    textTransform: 'none',
                    borderRadius: '10px',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  Favorites
                </Button>

                <Button
                  variant="outlined"
                  component={Link}
                  to="/my-bookings"
                  startIcon={<BookmarkBorder />}
                  sx={{
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.4)',
                    textTransform: 'none',
                    borderRadius: '10px',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  My Bookings
                </Button>

                {/* Profile Button with Dropdown */}
                <Box sx={{ position: 'relative' }}>
                  <Button
                    variant="contained"
                    onClick={handleProfileMenuOpen}
                    startIcon={<AccountCircle />}
                    sx={{
                      backgroundColor: '#475569',
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderRadius: '10px',
                      '&:hover': {
                        backgroundColor: '#64748b',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Profile
                  </Button>

                  <Menu
                    anchorEl={profileMenuAnchor}
                    open={Boolean(profileMenuAnchor)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                      sx: {
                        backgroundColor: '#1e293b',
                        color: '#fff',
                        mt: 1,
                        minWidth: 220,
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        '& .MuiMenuItem-root': {
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          },
                        },
                      },
                    }}
                  >
                    {/* User Info Section */}
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#475569',
                          }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {currentUser.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {currentUser.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                    {/* Menu Items */}
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleProfileMenuClose}
                    >
                      <ListItemIcon>
                        <AccountCircle sx={{ color: '#fff' }} />
                      </ListItemIcon>
                      <ListItemText>My Profile</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={handleSettings}>
                      <ListItemIcon>
                        <Settings sx={{ color: '#fff' }} />
                      </ListItemIcon>
                      <ListItemText>Settings</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={handleProfileMenuClose}>
                      <ListItemIcon>
                        <Edit sx={{ color: '#fff' }} />
                      </ListItemIcon>
                      <ListItemText>Edit Profile</ListItemText>
                    </MenuItem>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout sx={{ color: '#ef4444' }} />
                      </ListItemIcon>
                      <ListItemText sx={{ color: '#ef4444' }}>
                        Logout
                      </ListItemText>
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            </Box>
          )}

          {/* ================== MOBILE BUTTON ================== */}
          {!isAuthPage && (
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#fff' }}
              onClick={toggleMobileMenu}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* ================== MOBILE MENU ================== */}
      {!isAuthPage && mobileMenuOpen && (
        <Fade in={mobileMenuOpen}>
          <Box
            sx={{
              position: 'fixed',
              top: 64,
              left: 0,
              right: 0,
              backgroundColor: '#1e293b',
              borderBottom: '1px solid rgba(255,255,255,0.15)',
              zIndex: 1200,
              py: 2,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', px: 2, gap: 1 }}>
              {[
                { label: 'Home', icon: <Home />, to: '/home' },
                { label: 'Schedule', icon: <CalendarToday />, to: '/schedule' },
                { label: 'Movies', icon: <Movie />, to: '/home' },
                { label: 'News', icon: <Article />, to: '/news' },
              ].map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.to}
                  startIcon={item.icon}
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    color: '#fff',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    py: 1.4,
                    '&:hover': {
                      background: 'rgba(255,255,255,0.15)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              <Box sx={{ py: 1 }}>
                <SearchBar darkMode={darkMode} variant="glass" />
              </Box>

              <Button
                variant="outlined"
                component={Link}
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.4)',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.4,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                Favorites
              </Button>

              <Button
                variant="outlined"
                component={Link}
                to="/my-bookings"
                startIcon={<BookmarkBorder />}
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.4)',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.4,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                My Bookings
              </Button>

              {/* Mobile Profile Section */}
              <Box sx={{ py: 1 }}>
                <Box sx={{ px: 2, py: 1.5, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', mx: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: '#475569',
                      }}
                    >
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {currentUser.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        {currentUser.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Button
                variant="outlined"
                component={Link}
                to="/profile"
                startIcon={<AccountCircle />}
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.4)',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.4,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                My Profile
              </Button>

              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSettings();
                }}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.4)',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.4,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                Settings
              </Button>

              <Button
                variant="contained"
                startIcon={<Logout />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                sx={{
                  backgroundColor: '#dc2626',
                  color: '#fff',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.4,
                  '&:hover': {
                    backgroundColor: '#b91c1c',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Fade>
      )}
    </>
  );
};

export default Navbar;
