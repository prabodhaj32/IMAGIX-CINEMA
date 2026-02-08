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
  Fade,
  Zoom,
} from '@mui/material';
import {
  EventSeat,
  ArrowBack,
  ArrowForward,
  Theaters,
  LocalActivity,
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
        🎭 Select Your Seats
      </Typography>

      <Fade in={true} timeout={800}>
        <Alert severity="info" sx={{ 
          mb: 4, 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
          color: '#ffffff',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '15px',
          '& .MuiAlert-icon': { 
            color: '#8b5cf6',
            fontSize: '1.5rem'
          }
        }}>
          Click on available seats to select them. Premium seats (rows A-C) cost $15, 
          regular seats (rows D-G) cost $12, and economy seats (rows H-J) cost $10.
        </Alert>
      </Fade>

      {/* Enhanced Screen */}
      <Zoom in={true} timeout={1000}>
        <Paper
          elevation={8}
          sx={{ 
            p: 3, 
            mb: 4, 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)',
            border: '2px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '20px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
              animation: 'shimmer 2s infinite',
              '@keyframes shimmer': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' }
              }
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Theaters sx={{ 
              fontSize: '2rem', 
              color: '#3b82f6',
              mb: 1,
              filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))'
            }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              color: '#ffffff',
              textShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
            }}>
              SCREEN
            </Typography>
          </Box>
        </Paper>
      </Zoom>

      {/* Enhanced Seat Layout */}
      <Zoom in={true} timeout={1200}>
        <Paper
          elevation={12}
          sx={{
            mb: 4,
            p: 3,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            overflowX: 'auto'
          }}
        >
          <Box sx={{ minWidth: '700px' }}>
            {seatLayout.map((row, rowIndex) => (
              <Zoom in={true} timeout={1400 + rowIndex * 100} key={rowIndex}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ 
                    width: '40px', 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    color: '#a855f7',
                    fontSize: '1rem'
                  }}>
                    {row[0]?.row}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, flex: 1, justifyContent: 'center' }}>
                    {row.map((seat) => (
                      <Box
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        sx={{
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: seat.isOccupied ? 'not-allowed' : 'pointer',
                          background: seat.isOccupied 
                            ? 'linear-gradient(135deg, rgba(107, 114, 128, 0.4) 0%, rgba(75, 85, 99, 0.4) 100%)'
                            : selectedSeats.some((s) => s.id === seat.id)
                            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.6) 0%, rgba(124, 58, 237, 0.6) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                          borderRadius: '12px',
                          border: selectedSeats.some((s) => s.id === seat.id) 
                            ? '2px solid #8b5cf6' 
                            : '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          '&:hover': !seat.isOccupied && {
                            transform: 'scale(1.15)',
                            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)',
                            borderColor: '#a855f7',
                            boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)',
                          },
                        }}
                      >
                        <EventSeat
                          fontSize="medium"
                          sx={{
                            color: seat.isOccupied ? '#6b7280' : 
                                   selectedSeats.some((s) => s.id === seat.id) ? '#ffffff' : '#cbd5e1',
                            filter: selectedSeats.some((s) => s.id === seat.id) 
                              ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.8))' 
                              : 'none'
                          }}
                        />
                        {selectedSeats.some((s) => s.id === seat.id) && (
                          <Box sx={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            width: '16px',
                            height: '16px',
                            background: '#10b981',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            color: '#ffffff'
                          }}>
                            ✓
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                  
                  <Typography variant="body2" sx={{ 
                    width: '40px', 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    color: '#a855f7',
                    fontSize: '1rem'
                  }}>
                    {row[0]?.row}
                  </Typography>
                </Box>
              </Zoom>
            ))}
          </Box>
        </Paper>
      </Zoom>

      {/* Enhanced Legend */}
      <Zoom in={true} timeout={1600}>
        <Paper
          elevation={4}
          sx={{
            mb: 3,
            p: 3,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '15px'
          }}
        >
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                width: '24px', 
                height: '24px', 
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)', 
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <EventSeat fontSize="small" sx={{ color: '#cbd5e1' }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 'medium' }}>Available</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                width: '24px', 
                height: '24px', 
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.6) 0%, rgba(124, 58, 237, 0.6) 100%)', 
                border: '2px solid #8b5cf6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <EventSeat fontSize="small" sx={{ color: '#ffffff' }} />
                <Box sx={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  background: '#10b981',
                  borderRadius: '50%',
                  fontSize: '6px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>✓</Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 'medium' }}>Selected</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                width: '24px', 
                height: '24px', 
                background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.4) 0%, rgba(75, 85, 99, 0.4) 100%)', 
                border: '1px solid rgba(107, 114, 128, 0.4)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <EventSeat fontSize="small" sx={{ color: '#6b7280' }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 'medium' }}>Occupied</Typography>
            </Box>
          </Box>
        </Paper>
      </Zoom>

      <Divider sx={{ 
        mb: 3, 
        borderColor: 'rgba(255, 255, 255, 0.1)',
        background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), transparent)'
      }} />

      {/* Enhanced Selected Seats Summary */}
      <Zoom in={true} timeout={1800}>
        <Paper
          elevation={8}
          sx={{
            mb: 3,
            p: 3,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '15px'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ 
            color: '#ffffff', 
            fontWeight: 'bold',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <LocalActivity sx={{ color: '#f472b6' }} />
            Selected Seats ({selectedSeats.length})
          </Typography>
          
          {selectedSeats.length === 0 ? (
            <Typography variant="body1" sx={{ 
              color: '#9ca3af',
              fontStyle: 'italic',
              textAlign: 'center',
              py: 2
            }}>
              No seats selected. Please select at least one seat to continue.
            </Typography>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
                {selectedSeats.map((seat) => (
                  <Chip
                    key={seat.id}
                    label={`${seat.id} ($${seat.price})`}
                    size="medium"
                    onDelete={() => handleSeatClick(seat)}
                    sx={{ 
                      background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%)',
                      color: '#ffffff',
                      border: '1px solid rgba(244, 114, 182, 0.3)',
                      fontWeight: 'bold',
                      '& .MuiChip-deleteIcon': { 
                        color: '#ffffff',
                        '&:hover': {
                          color: '#f87171',
                          background: 'rgba(248, 113, 113, 0.1)'
                        }
                      }
                    }}
                  />
                ))}
              </Box>
              
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'medium' }}>
                  Total Amount:
                </Typography>
                <Typography variant="h5" sx={{ 
                  color: '#10b981', 
                  fontWeight: 'bold',
                  textShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                }}>
                  ${calculateTotal()}
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Zoom>

      {/* Enhanced Action Buttons */}
      <Zoom in={true} timeout={2000}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={onBack}
            startIcon={<ArrowBack />}
            variant="outlined"
            sx={{
              px: 4,
              py: 2,
              color: '#cbd5e1',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#a855f7',
                background: 'rgba(168, 85, 247, 0.1)',
                transform: 'translateX(-4px)',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
              px: 4,
              py: 2,
              background: selectedSeats.length > 0 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'rgba(255, 255, 255, 0.05)',
              color: selectedSeats.length > 0 ? '#ffffff' : '#9ca3af',
              border: selectedSeats.length > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              fontWeight: 'bold',
              '&:hover': selectedSeats.length > 0 ? {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
              } : {},
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#9ca3af',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Continue to Payment
          </Button>
        </Box>
      </Zoom>
    </Box>
  );
};

export default SeatSelection;
