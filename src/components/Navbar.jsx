import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Switch,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Home,
  Favorite,
  Logout,
  Brightness4,
  Brightness7,
  Person,
  Movie,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MovieContext } from '../context/MovieContext';

const Navbar = ({ darkMode, onToggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(MovieContext);
  const favorites = context?.favorites || [];
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isAuthPage = location.pathname === '/' || location.pathname === '/register';
  const user = JSON.parse(localStorage.getItem("user") || '{}');

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: darkMode
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
        borderBottom: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.2)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
            component={Link}
            to="/home"
          >
            <Movie sx={{ fontSize: 32, color: '#ffd700' }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #fff 30%, #ffd700 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Movie Explorer
            </Typography>
          </Box>
        </Box>

        {!isAuthPage && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Tooltip title="Home">
              <Button
                color="inherit"
                component={Link}
                to="/home"
                startIcon={<Home />}
                sx={{
                  minWidth: { xs: 'auto', sm: 100 },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Home</Box>
              </Button>
            </Tooltip>

            <Tooltip title="Favorites">
              <Button
                color="inherit"
                component={Link}
                to="/favorites"
                startIcon={
                  <Badge badgeContent={favorites.length} color="error">
                    <Favorite />
                  </Badge>
                }
                sx={{
                  minWidth: { xs: 'auto', sm: 120 },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  Favorites
                  {favorites.length > 0 && (
                    <Chip
                      label={favorites.length}
                      size="small"
                      color="error"
                      sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </Button>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'rgba(255,255,255,0.2)' }} />

            <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
              <IconButton
                color="inherit"
                onClick={onToggleTheme}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'rotate(180deg)',
                  },
                  transition: 'transform 0.3s ease',
                }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <Tooltip title="User Menu">
                <IconButton
                  onClick={handleMenuClick}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontSize: '0.9rem',
                    }}
                  >
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    background: darkMode
                      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                  },
                }}
              >
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person sx={{ fontSize: 20 }} />
                    <Typography variant="body2">
                      {user.username || 'Guest'}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Logout sx={{ fontSize: 20 }} />
                    <Typography>Logout</Typography>
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;