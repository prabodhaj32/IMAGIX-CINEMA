import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Fade,
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
} from '@mui/icons-material';
import SearchBar from './SearchBar';

const Navbar = ({ darkMode }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isAuthPage =
    location.pathname === '/' || location.pathname === '/register';

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
                { label: 'Schedule', icon: <CalendarToday />, to: '/schedule' },
                { label: 'Movies', icon: <Movie />, to: '/home' },
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
                  variant="contained"
                  component={Link}
                  to="/"
                  startIcon={<Person />}
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
                  Sign In
                </Button>
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
                variant="contained"
                component={Link}
                to="/"
                startIcon={<Person />}
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  backgroundColor: '#475569',
                  color: '#fff',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.4,
                  '&:hover': {
                    backgroundColor: '#64748b',
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Fade>
      )}
    </>
  );
};

export default Navbar;
