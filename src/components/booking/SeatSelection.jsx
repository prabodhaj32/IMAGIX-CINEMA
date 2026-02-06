import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Button,
  Alert,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import {
  EventSeat,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';

const SeatSelection = ({ showtime, onSeatsSelected, onBack }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatLayout, setSeatLayout] = useState([]);

  // Generate seat layout (10 rows x 12 seats)
  useEffect(() => {
    const layout = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    rows.forEach((row, rowIndex) => {
      const rowSeats = [];
      for (let seatNum = 1; seatNum <= 12; seatNum++) {
        const seatId = `${row}${seatNum}`;
        // Randomly mark some seats as occupied for demo
        const isOccupied = Math.random() > 0.8;
        rowSeats.push({
          id: seatId,
          row,
          number: seatNum,
          isOccupied,
          price: rowIndex < 3 ? 15 : rowIndex < 7 ? 12 : 10, // Premium, regular, economy
        });
      }
      layout.push(rowSeats);
    });
    
    setSeatLayout(layout);
  }, []);

  const handleSeatClick = (seat) => {
    if (seat.isOccupied) return;

    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.id === seat.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    onSeatsSelected(selectedSeats, calculateTotal());
  };

  const getSeatColor = (seat) => {
    if (seat.isOccupied) return 'grey.400';
    if (selectedSeats.some((s) => s.id === seat.id)) return 'primary.main';
    return 'grey.200';
  };

  const getSeatIcon = (seat) => {
    if (seat.isOccupied) return 'block';
    if (selectedSeats.some((s) => s.id === seat.id)) return 'check_circle';
    return 'event_seat';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
        Select Your Seats
      </Typography>

      <Alert severity="info" sx={{ 
        mb: 3, 
        bgcolor: '#2a2a2a',
        color: '#ffffff',
        '& .MuiAlert-icon': { color: '#ff0000' }
      }}>
        Click on available seats to select them. Premium seats (rows A-C) cost $15, 
        regular seats (rows D-G) cost $12, and economy seats (rows H-J) cost $10.
      </Alert>

      {/* Screen */}
      <Box sx={{ 
        p: 2, 
        mb: 4, 
        bgcolor: '#2a2a2a',
        border: '1px solid #ff0000',
        borderRadius: 1,
        textAlign: 'center'
      }}>
        <Typography variant="body2" sx={{ 
          fontWeight: 'bold',
          color: '#ffffff'
        }}>
          SCREEN
        </Typography>
      </Box>

      {/* Seat Layout */}
      <Box sx={{ mb: 4, overflowX: 'auto' }}>
        <Box sx={{ minWidth: '600px' }}>
          {seatLayout.map((row, rowIndex) => (
            <Box key={rowIndex} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ 
                width: '30px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                color: '#ffffff'
              }}>
                {row[0]?.row}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                {row.map((seat) => (
                  <Box
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    sx={{
                      width: '35px',
                      height: '35px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: seat.isOccupied ? 'not-allowed' : 'pointer',
                      backgroundColor: getSeatColor(seat),
                      borderRadius: 1,
                      border: '1px solid #333333',
                      transition: 'all 0.2s ease',
                      '&:hover': !seat.isOccupied && {
                        transform: 'scale(1.1)',
                        boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
                      },
                    }}
                  >
                    <EventSeat
                      fontSize="small"
                      sx={{
                        color: seat.isOccupied ? '#666666' : 
                               selectedSeats.some((s) => s.id === seat.id) ? '#ffffff' : '#cccccc',
                      }}
                    />
                  </Box>
                ))}
              </Box>
              
              <Typography variant="body2" sx={{ 
                width: '30px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                color: '#ffffff'
              }}>
                {row[0]?.row}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#333333', 
            border: '1px solid #555555' 
          }} />
          <Typography variant="caption" sx={{ color: '#cccccc' }}>Available</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#ff0000', 
            border: '1px solid #ff0000' 
          }} />
          <Typography variant="caption" sx={{ color: '#cccccc' }}>Selected</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#666666', 
            border: '1px solid #666666' 
          }} />
          <Typography variant="caption" sx={{ color: '#cccccc' }}>Occupied</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3, borderColor: '#333333' }} />

      {/* Selected Seats Summary */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
          Selected Seats ({selectedSeats.length})
        </Typography>
        
        {selectedSeats.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#cccccc' }}>
            No seats selected
          </Typography>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {selectedSeats.map((seat) => (
                <Chip
                  key={seat.id}
                  label={`${seat.id} ($${seat.price})`}
                  size="small"
                  sx={{ 
                    bgcolor: '#ff0000',
                    color: '#ffffff',
                    '& .MuiChip-deleteIcon': { color: '#ffffff' }
                  }}
                  onDelete={() => handleSeatClick(seat)}
                />
              ))}
            </Box>
            
            <Typography variant="h6" sx={{ color: '#ff0000', fontWeight: 'bold' }}>
              Total: ${calculateTotal()}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{
            color: '#ffffff',
            borderColor: '#333333',
            '&:hover': {
              borderColor: '#ff0000',
              bgcolor: 'rgba(255, 0, 0, 0.1)'
            }
          }}
        >
          Back
        </Button>
        
        <Button
          onClick={handleContinue}
          endIcon={<ArrowForward />}
          variant="contained"
          disabled={selectedSeats.length === 0}
          sx={{
            bgcolor: '#ff0000',
            color: '#ffffff',
            '&:hover': {
              bgcolor: '#cc0000'
            },
            '&:disabled': {
              bgcolor: '#333333',
              color: '#666666'
            }
          }}
        >
          Continue to Payment
        </Button>
      </Box>
    </Box>
  );
};

export default SeatSelection;
