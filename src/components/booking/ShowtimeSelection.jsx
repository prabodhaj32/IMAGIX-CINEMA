import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Fade,
  Zoom,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  TheaterComedy,
  AttachMoney,
  LocationOn,
  Star,
} from '@mui/icons-material';

// Mock showtime data - in a real app, this would come from an API
const generateMockShowtimes = (movie) => {
  const theaters = [
    { id: 1, name: 'AMC Theater Downtown', address: '123 Main St, City' },
    { id: 2, name: 'Cineplex Premium', address: '456 Oak Ave, City' },
    { id: 3, name: 'Star Cinema', address: '789 Pine Rd, City' },
  ];

  const showtimes = [];
  const today = new Date();
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    
    theaters.forEach(theater => {
      const times = ['10:00', '13:00', '16:00', '19:00', '22:00'];
      times.forEach(time => {
        showtimes.push({
          id: `${theater.id}-${date.toISOString().split('T')[0]}-${time}`,
          theater,
          date: date.toISOString().split('T')[0],
          time,
          price: Math.floor(Math.random() * 5) + 12, // $12-$16
          availableSeats: Math.floor(Math.random() * 30) + 20, // 20-50 seats
          screenType: Math.random() > 0.5 ? 'Standard' : 'IMAX',
        });
      });
    });
  }
  
  return showtimes;
};

const ShowtimeSelection = ({ movie, onSelectShowtime }) => {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setShowtimes(generateMockShowtimes(movie));
      setLoading(false);
    }, 500);
  }, [movie]);

  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    if (!acc[showtime.date]) {
      acc[showtime.date] = [];
    }
    acc[showtime.date].push(showtime);
    return acc;
  }, {});

  const uniqueDates = Object.keys(groupedShowtimes).sort();

  const handleShowtimeSelect = (showtime) => {
    if (showtime.availableSeats === 0) return;
    
    setSelectedShowtime(showtime);
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      `You've selected:\n` +
      `Theater: ${showtime.theater.name}\n` +
      `Date: ${new Date(showtime.date).toLocaleDateString()}\n` +
      `Time: ${showtime.time}\n` +
      `Screen: ${showtime.screenType}\n` +
      `Price: $${showtime.price} per ticket\n\n` +
      `Continue to seat selection?`
    );
    
    if (confirmed) {
      onSelectShowtime(showtime);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading showtimes...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ 
        color: '#ffffff', 
        fontWeight: 'bold',
        mb: 3,
        background: 'linear-gradient(135deg, #fff 0%, #e5e7eb 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
      }}>
        📅 Select Showtime
      </Typography>
      
      <Fade in={true} timeout={800}>
        <Alert severity="info" sx={{ 
          mb: 4, 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)',
          color: '#ffffff',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '15px',
          '& .MuiAlert-icon': { 
            color: '#3b82f6',
            fontSize: '1.5rem'
          }
        }}>
          Choose your preferred date, theater, and showtime. All prices are per ticket.
        </Alert>
      </Fade>

      {uniqueDates.map((date, dateIndex) => (
        <Zoom in={true} timeout={1000 + dateIndex * 200} key={date}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center',
              color: '#ffffff',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent',
            }}>
              <CalendarToday sx={{ 
                mr: 2, 
                color: '#a855f7',
                fontSize: '1.8rem',
                filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))'
              }} />
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
            
            <Grid container spacing={3}>
              {groupedShowtimes[date].map((showtime, index) => (
                <Grid item xs={12} sm={6} md={4} key={showtime.id}>
                  <Zoom in={true} timeout={1200 + dateIndex * 200 + index * 100}>
                    <Paper
                      elevation={showtime.availableSeats > 0 ? 8 : 2}
                      sx={{
                        cursor: showtime.availableSeats > 0 ? 'pointer' : 'not-allowed',
                        opacity: showtime.availableSeats > 0 ? 1 : 0.6,
                        border: selectedShowtime?.id === showtime.id ? 3 : 2,
                        borderColor: selectedShowtime?.id === showtime.id ? '#a855f7' : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        p: 3,
                        background: showtime.availableSeats > 0 
                          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'
                          : 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': showtime.availableSeats > 0 ? {
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
                          transform: 'translateY(-4px) scale(1.02)',
                          borderColor: '#a855f7',
                          boxShadow: '0 12px 24px rgba(168, 85, 247, 0.3)',
                        } : {},
                      }}
                      onClick={() => handleShowtimeSelect(showtime)}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          mb: 1,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <TheaterComedy sx={{ color: '#f472b6', fontSize: '1.2rem' }} />
                          {showtime.theater.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <LocationOn fontSize="small" sx={{ color: '#a855f7' }} />
                          <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                            {showtime.theater.address}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            background: 'rgba(59, 130, 246, 0.2)',
                            px: 2,
                            py: 1,
                            borderRadius: '10px'
                          }}>
                            <AccessTime fontSize="small" sx={{ color: '#3b82f6' }} />
                            <Typography variant="body2" sx={{ 
                              color: '#ffffff',
                              fontWeight: 'bold'
                            }}>
                              {showtime.time}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            background: showtime.screenType === 'IMAX' 
                              ? 'rgba(251, 146, 60, 0.2)' 
                              : 'rgba(16, 185, 129, 0.2)',
                            px: 2,
                            py: 1,
                            borderRadius: '10px'
                          }}>
                            <Star fontSize="small" sx={{ 
                              color: showtime.screenType === 'IMAX' ? '#fb923c' : '#10b981' 
                            }} />
                            <Typography variant="body2" sx={{ 
                              color: '#ffffff',
                              fontWeight: 'bold',
                              fontSize: '0.8rem'
                            }}>
                              {showtime.screenType}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            background: 'rgba(16, 185, 129, 0.2)',
                            px: 2,
                            py: 1,
                            borderRadius: '10px'
                          }}>
                            <AttachMoney fontSize="small" sx={{ color: '#10b981' }} />
                            <Typography variant="body2" sx={{ 
                              color: '#ffffff',
                              fontWeight: 'bold'
                            }}>
                              ${showtime.price}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mt: 'auto' }}>
                          <Chip
                            label={`${showtime.availableSeats} seats left`}
                            size="small"
                            sx={{ 
                              width: '100%',
                              background: showtime.availableSeats > 20 
                                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(5, 150, 105, 0.4) 100%)' 
                                : showtime.availableSeats > 10 
                                ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.4) 0%, rgba(245, 158, 11, 0.4) 100%)'
                                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.4) 100%)',
                              color: '#ffffff',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              fontWeight: 'bold',
                              fontSize: '0.8rem'
                            }}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Zoom>
      ))}
      
      {showtimes.length === 0 && (
        <Zoom in={true} timeout={1400}>
          <Alert severity="warning" sx={{ 
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
            color: '#ffffff',
            border: '1px solid rgba(251, 146, 60, 0.3)',
            borderRadius: '15px',
            '& .MuiAlert-icon': { 
              color: '#fb923c',
              fontSize: '1.5rem'
            }
          }}>
            🎭 No showtimes available for this movie. Please check back later.
          </Alert>
        </Zoom>
      )}
    </Box>
  );
};

export default ShowtimeSelection;
