import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Fade,
  CircularProgress,
} from '@mui/material';
import {
  ConfirmationNumber,
  CalendarToday,
  AccessTime,
  LocationOn,
  Download,
  Share,
  Delete,
  Info,
  Search,
  FilterList,
  Sort,
  PictureAsPdf,
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

const MyBookings = ({ darkMode }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentTab, setCurrentTab] = useState(0);
  const [qrCodes, setQrCodes] = useState({});
  const ticketRefs = useRef({});

  useEffect(() => {
    // Load bookings from localStorage with error handling
    try {
      const savedBookings = localStorage.getItem('userBookings');
      if (savedBookings) {
        const parsedBookings = JSON.parse(savedBookings);
        // Validate booking data structure
        const validBookings = parsedBookings.filter(booking => 
          booking && 
          booking.paymentInfo?.transactionId && 
          booking.movie?.title &&
          booking.showtime?.date
        );
        setBookings(validBookings);
        
        if (validBookings.length !== parsedBookings.length) {
          console.warn('Some invalid bookings were filtered out');
          // Update localStorage with clean data
          localStorage.setItem('userBookings', JSON.stringify(validBookings));
        }
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load your bookings. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Enhanced status functions
  const getBookingStatus = (booking) => {
    const showDateTime = new Date(`${booking.showtime?.date} ${booking.showtime?.time}`);
    const now = new Date();
    const hoursUntilShow = (showDateTime - now) / (1000 * 60 * 60);
    
    if (booking.status === 'cancelled') return 'cancelled';
    if (hoursUntilShow < 0) return 'completed';
    if (hoursUntilShow < 2) return 'starting-soon';
    return 'upcoming';
  };

  const getStatusColor = (booking) => {
    const status = getBookingStatus(booking);
    switch (status) {
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      case 'starting-soon': return 'warning';
      case 'upcoming': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (booking) => {
    const status = getBookingStatus(booking);
    switch (status) {
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'starting-soon': return 'Starting Soon';
      case 'upcoming': return 'Upcoming';
      default: return 'Unknown';
    }
  };

  // Filter and sort bookings
  const getFilteredAndSortedBookings = () => {
    let filtered = bookings;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.showtime?.theater?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.paymentInfo?.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => getBookingStatus(booking) === statusFilter);
    }

    // Apply tab filter
    if (currentTab === 0) { // Upcoming
      filtered = filtered.filter(booking => getBookingStatus(booking) === 'upcoming' || getBookingStatus(booking) === 'starting-soon');
    } else if (currentTab === 1) { // Completed
      filtered = filtered.filter(booking => getBookingStatus(booking) === 'completed');
    } else if (currentTab === 2) { // Cancelled
      filtered = filtered.filter(booking => getBookingStatus(booking) === 'cancelled');
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.showtime?.date) - new Date(a.showtime?.date);
        case 'title':
          return (a.movie?.title || '').localeCompare(b.movie?.title || '');
        case 'price':
          return b.totalPrice - a.totalPrice;
        case 'bookingDate':
          return new Date(b.bookingDate) - new Date(a.bookingDate);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredBookings = getFilteredAndSortedBookings();

  // Generate QR codes for all bookings
  useEffect(() => {
    const generateQRCodes = async () => {
      const newQrCodes = {};
      
      for (const booking of bookings) {
        if (!qrCodes[booking.paymentInfo?.transactionId]) {
          try {
            const qrData = JSON.stringify({
              transactionId: booking.paymentInfo?.transactionId,
              movie: booking.movie?.title,
              date: booking.showtime?.date,
              time: booking.showtime?.time,
              seats: booking.seats?.map(s => s.id)
            });
            
            const url = await QRCode.toDataURL(qrData, {
              width: 200,
              margin: 1,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            });
            newQrCodes[booking.paymentInfo?.transactionId] = url;
          } catch (error) {
            console.error('Error generating QR code:', error);
          }
        }
      }
      
      setQrCodes(prev => ({ ...prev, ...newQrCodes }));
    };

    if (bookings.length > 0) {
      generateQRCodes();
    }
  }, [bookings]);

  const handleDownloadPDF = async (booking) => {
    const ticketRef = ticketRefs.current[booking.paymentInfo?.transactionId];
    if (!ticketRef) return;

    try {
      const canvas = await html2canvas(ticketRef, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`booking-${booking.paymentInfo?.transactionId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleDownloadTicket = (booking) => {
    const ticketContent = `
BOOKING CONFIRMATION
=====================

Transaction ID: ${booking.paymentInfo?.transactionId}
Date: ${new Date(booking.paymentInfo?.timestamp).toLocaleString()}

MOVIE DETAILS
-------------
Movie: ${booking.movie?.title}
Theater: ${booking.showtime?.theater?.name}
Address: ${booking.showtime?.theater?.address}
Date: ${new Date(booking.showtime?.date).toLocaleDateString()}
Time: ${booking.showtime?.time}
Screen: ${booking.showtime?.screenType}

SEATS
-----
${booking.seats?.map(seat => `${seat.id} - $${seat.price}`).join('\n')}

PAYMENT
-------
Total Amount: $${booking.totalPrice}
Payment Method: Credit Card ending in ${booking.paymentInfo?.cardNumber?.slice(-4)}

CUSTOMER INFORMATION
--------------------
Email: ${booking.paymentInfo?.email}
Phone: ${booking.paymentInfo?.phone}
    `.trim();

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${booking.paymentInfo?.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShare = (booking) => {
    const text = `I've booked tickets for ${booking.movie?.title} on ${new Date(booking.showtime?.date).toLocaleDateString()} at ${booking.showtime?.time}!`;
    if (navigator.share) {
      navigator.share({
        title: `Booking Confirmation - ${booking.movie?.title}`,
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Booking details copied to clipboard!');
    }
  };

  const handleCancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.paymentInfo?.transactionId === bookingId);
    const status = getBookingStatus(booking);
    
    if (status === 'completed') {
      alert('Cannot cancel completed bookings.');
      return;
    }
    
    if (status === 'cancelled') {
      alert('This booking is already cancelled.');
      return;
    }
    
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      try {
        const updatedBookings = bookings.map(b => {
          if (b.paymentInfo?.transactionId === bookingId) {
            return { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() };
          }
          return b;
        });
        setBookings(updatedBookings);
        localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
        alert('Booking cancelled successfully');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress size={60} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ConfirmationNumber sx={{ fontSize: 24 }} />
          </Box>
        </Box>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your bookings...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please wait while we fetch your booking history
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      {/* Search and Filter Controls */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<Sort sx={{ mr: 1 }} />}
              >
                <MenuItem value="date">Show Date</MenuItem>
                <MenuItem value="title">Movie Title</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="bookingDate">Booking Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="starting-soon">Starting Soon</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs for quick filtering */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab label={`Upcoming (${bookings.filter(b => getBookingStatus(b) === 'upcoming' || getBookingStatus(b) === 'starting-soon').length})`} />
          <Tab label={`Completed (${bookings.filter(b => getBookingStatus(b) === 'completed').length})`} />
          <Tab label={`Cancelled (${bookings.filter(b => getBookingStatus(b) === 'cancelled').length})`} />
        </Tabs>
      </Box>

      {filteredBookings.length === 0 ? (
        <Alert severity="info">
          {searchTerm || statusFilter !== 'all' || currentTab !== 0 
            ? 'No bookings match your current filters.' 
            : 'You haven\'t made any bookings yet. Start exploring movies and book your tickets!'
          }
        </Alert>
      ) : (
        <Fade in={true}>
          <Grid container spacing={3}>
            {filteredBookings.map((booking) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={booking.paymentInfo?.transactionId}>
                {/* Hidden Ticket Template for PDF Generation */}
                <Box
                  ref={el => ticketRefs.current[booking.paymentInfo?.transactionId] = el}
                  sx={{
                    position: 'absolute',
                    left: '-9999px',
                    top: '-9999px',
                    width: '600px',
                    bgcolor: '#ffffff',
                    p: 4,
                    fontFamily: 'Arial, sans-serif'
                  }}
                >
                  <Box sx={{ borderBottom: '3px solid #ff0000', pb: 3, mb: 3 }}>
                    <Typography variant="h4" sx={{ color: '#000000', fontWeight: 'bold', textAlign: 'center' }}>
                      CINEMA TICKET
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666666', textAlign: 'center' }}>
                      BOOKING CONFIRMATION
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={8}>
                      <Typography variant="h6" sx={{ color: '#000000', fontWeight: 'bold', mb: 2 }}>
                        {booking.movie?.title}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#666666', fontWeight: 'bold' }}>
                          Transaction ID:
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#000000', fontFamily: 'monospace' }}>
                          {booking.paymentInfo?.transactionId}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#666666', fontWeight: 'bold' }}>
                          Theater:
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#000000' }}>
                          {booking.showtime?.theater?.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666666' }}>
                          {booking.showtime?.theater?.address}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#666666', fontWeight: 'bold' }}>
                          Date & Time:
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#000000' }}>
                          {new Date(booking.showtime?.date).toLocaleDateString()} at {booking.showtime?.time}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666666' }}>
                          {booking.showtime?.screenType}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#666666', fontWeight: 'bold' }}>
                          Seats:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {booking.seats?.map((seat) => (
                            <Box
                              key={seat.id}
                              sx={{
                                px: 2,
                                py: 1,
                                bgcolor: '#f5f5f5',
                                border: '1px solid #ddd',
                                borderRadius: 1
                              }}
                            >
                              <Typography variant="body2" sx={{ color: '#000000' }}>
                                {seat.id}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#666666', fontWeight: 'bold' }}>
                          Total Amount:
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#ff0000', fontWeight: 'bold' }}>
                          ${booking.totalPrice}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        {qrCodes[booking.paymentInfo?.transactionId] && (
                          <img src={qrCodes[booking.paymentInfo?.transactionId]} alt="QR Code" style={{ width: '150px', height: '150px' }} />
                        )}
                        <Typography variant="caption" sx={{ color: '#666666', mt: 1, display: 'block' }}>
                          Scan for verification
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ borderTop: '2px dashed #ccc', pt: 3, mt: 3 }}>
                    <Typography variant="body2" sx={{ color: '#666666', textAlign: 'center' }}>
                      Please arrive at least 15 minutes before showtime
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666666', textAlign: 'center' }}>
                      Bring this confirmation and a valid ID
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666666', textAlign: 'center' }}>
                      No refunds or exchanges after purchase
                    </Typography>
                  </Box>
                </Box>

                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: darkMode 
                      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
                      : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                    border: darkMode ? '1px solid #333333' : '1px solid #e0e0e0',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 100,
                    height: 100,
                    background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.1) 0%, rgba(255, 0, 0, 0.05) 100%)',
                    borderRadius: '50%',
                    transform: 'translate(30%, -30%)'
                  }} />
                  
                  <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Typography variant="h6" noWrap sx={{ 
                        color: darkMode ? '#ffffff' : '#000000',
                        fontWeight: 'bold',
                        flex: 1,
                        mr: 1
                      }}>
                        🎬 {booking.movie?.title}
                      </Typography>
                      <Chip
                        label={getStatusText(booking)}
                        color={getStatusColor(booking)}
                        size="small"
                        sx={{
                          fontWeight: 'bold',
                          minWidth: 100
                        }}
                      />
                    </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: darkMode ? '#cccccc' : '#666666', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      🏢 {booking.showtime?.theater?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#cccccc' : '#666666', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      📅 {new Date(booking.showtime?.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#cccccc' : '#666666', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      ⏰ {booking.showtime?.time}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: darkMode ? '#333333' : '#e0e0e0' }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: darkMode ? '#cccccc' : '#666666', mb: 1, fontWeight: 'bold' }}>
                      🎫 Seats ({booking.seats?.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {booking.seats?.slice(0, 4).map((seat) => (
                        <Chip 
                          key={seat.id} 
                          label={seat.id} 
                          size="small" 
                          variant="outlined"
                          sx={{
                            borderColor: '#ff0000',
                            color: darkMode ? '#ffffff' : '#000000',
                            bgcolor: 'rgba(255, 0, 0, 0.1)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 0, 0, 0.2)'
                            }
                          }}
                        />
                      ))}
                      {booking.seats?.length > 4 && (
                        <Chip 
                          label={`+${booking.seats.length - 4}`} 
                          size="small" 
                          variant="outlined"
                          sx={{
                            borderColor: '#ff0000',
                            color: darkMode ? '#ffffff' : '#000000'
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ 
                      color: '#ff0000', 
                      fontWeight: 'bold',
                      fontSize: '1.5rem'
                    }}>
                      ${booking.totalPrice}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: darkMode ? '#cccccc' : '#666666',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem'
                    }}>
                      ID: {booking.paymentInfo?.transactionId?.slice(0, 8)}...
                    </Typography>
                  </Box>
                  </CardContent>

                  <Box sx={{ 
                    p: 2, 
                    display: 'flex', 
                    gap: 1,
                    bgcolor: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                    borderTop: `1px solid ${darkMode ? '#333333' : '#e0e0e0'}`
                  }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PictureAsPdf />}
                      onClick={() => handleDownloadPDF(booking)}
                      sx={{
                        borderColor: '#ff0000',
                        color: '#ff0000',
                        '&:hover': {
                          bgcolor: 'rgba(255, 0, 0, 0.1)',
                          borderColor: '#cc0000'
                        }
                      }}
                    >
                      PDF
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Info />}
                      onClick={() => handleViewDetails(booking)}
                      sx={{
                        borderColor: darkMode ? '#555555' : '#cccccc',
                        color: darkMode ? '#ffffff' : '#000000',
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }
                      }}
                    >
                      Details
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleDownloadTicket(booking)}
                      title="Download Text Ticket"
                      sx={{
                        color: darkMode ? '#ffffff' : '#000000',
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }
                      }}
                    >
                      <Download />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleShare(booking)}
                      title="Share"
                      sx={{
                        color: darkMode ? '#ffffff' : '#000000',
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }
                      }}
                    >
                      <Share />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleCancelBooking(booking.paymentInfo?.transactionId)}
                      title="Cancel Booking"
                      color="error"
                      disabled={getBookingStatus(booking) === 'completed' || getBookingStatus(booking) === 'cancelled'}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(244, 67, 54, 0.1)'
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Fade>
      )}

      {/* Booking Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedBooking.movie?.title}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {selectedBooking.paymentInfo?.transactionId}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Booking Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedBooking.paymentInfo?.timestamp).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Theater
                  </Typography>
                  <Typography variant="body1">
                    {selectedBooking.showtime?.theater?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedBooking.showtime?.theater?.address}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedBooking.showtime?.date).toLocaleDateString()} at {selectedBooking.showtime?.time}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Screen
                  </Typography>
                  <Typography variant="body1">
                    {selectedBooking.showtime?.screenType}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Seats
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {selectedBooking.seats?.map((seat) => (
                      <Chip key={seat.id} label={`${seat.id} ($${seat.price})`} size="small" />
                    ))}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    ${selectedBooking.totalPrice}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          {selectedBooking && (
            <Button
              onClick={() => handleDownloadTicket(selectedBooking)}
              startIcon={<Download />}
              variant="outlined"
            >
              Download Ticket
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings;
