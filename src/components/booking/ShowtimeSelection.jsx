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
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  TheaterComedy,
  AttachMoney,
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
      <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
        Select Showtime
      </Typography>
      
      <Alert severity="info" sx={{ 
        mb: 3, 
        bgcolor: '#2a2a2a',
        color: '#ffffff',
        '& .MuiAlert-icon': { color: '#ff0000' }
      }}>
        Choose your preferred date, theater, and showtime. All prices are per ticket.
      </Alert>

      {uniqueDates.map((date) => (
        <Box key={date} sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ 
            mb: 2, 
            display: 'flex', 
            alignItems: 'center',
            color: '#ffffff',
            fontWeight: 'bold'
          }}>
            <CalendarToday sx={{ mr: 1, color: '#ff0000' }} />
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
          
          <Grid container spacing={2}>
            {groupedShowtimes[date].map((showtime) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={showtime.id}>
                <Box
                  sx={{
                    cursor: showtime.availableSeats > 0 ? 'pointer' : 'not-allowed',
                    opacity: showtime.availableSeats > 0 ? 1 : 0.6,
                    border: selectedShowtime?.id === showtime.id ? 2 : 1,
                    borderColor: selectedShowtime?.id === showtime.id ? '#ff0000' : '#333333',
                    borderRadius: 2,
                    p: 2,
                    bgcolor: '#1a1a1a',
                    transition: 'all 0.2s ease',
                    '&:hover': showtime.availableSeats > 0 ? {
                      bgcolor: '#2a2a2a',
                      transform: 'translateY(-2px)',
                      borderColor: '#ff0000'
                    } : {},
                  }}
                  onClick={() => handleShowtimeSelect(showtime)}
                >
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    color: '#ffffff'
                  }}>
                    {showtime.theater.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime fontSize="small" sx={{ color: '#ff0000' }} />
                      <Typography variant="body2" sx={{ color: '#cccccc' }}>
                        {showtime.time}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TheaterComedy fontSize="small" sx={{ color: '#ff0000' }} />
                      <Typography variant="body2" sx={{ color: '#cccccc' }}>
                        {showtime.screenType}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoney fontSize="small" sx={{ color: '#ff0000' }} />
                      <Typography variant="body2" sx={{ color: '#cccccc' }}>
                        ${showtime.price}
                      </Typography>
                    </Box>
                    
                    <Chip
                      label={`${showtime.availableSeats} seats available`}
                      size="small"
                      color={showtime.availableSeats > 10 ? 'success' : showtime.availableSeats > 0 ? 'warning' : 'error'}
                      sx={{ 
                        mt: 1,
                        bgcolor: showtime.availableSeats > 10 ? '#2d5a2d' : 
                                showtime.availableSeats > 0 ? '#5a4a2d' : '#5a2d2d',
                        color: '#ffffff'
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
      
      {showtimes.length === 0 && (
        <Alert severity="warning" sx={{ 
          bgcolor: '#5a4a2d',
          color: '#ffffff',
          '& .MuiAlert-icon': { color: '#ffaa00' }
        }}>
          No showtimes available for this movie. Please check back later.
        </Alert>
      )}
    </Box>
  );
};

export default ShowtimeSelection;
