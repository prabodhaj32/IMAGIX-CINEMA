import React, { useState, useEffect } from 'react';
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
} from '@mui/icons-material';

const MyBookings = ({ darkMode }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('userBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
    setLoading(false);
  }, []);

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
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const updatedBookings = bookings.filter(b => b.paymentInfo?.transactionId !== bookingId);
      setBookings(updatedBookings);
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
      alert('Booking cancelled successfully');
    }
  };

  const getStatusColor = (showtime) => {
    const showDateTime = new Date(`${showtime?.date} ${showtime?.time}`);
    const now = new Date();
    const hoursUntilShow = (showDateTime - now) / (1000 * 60 * 60);
    
    if (hoursUntilShow < 0) return 'error'; // Past
    if (hoursUntilShow < 2) return 'warning'; // Soon
    return 'success'; // Upcoming
  };

  const getStatusText = (showtime) => {
    const showDateTime = new Date(`${showtime?.date} ${showtime?.time}`);
    const now = new Date();
    const hoursUntilShow = (showDateTime - now) / (1000 * 60 * 60);
    
    if (hoursUntilShow < 0) return 'Completed';
    if (hoursUntilShow < 2) return 'Starting Soon';
    return 'Upcoming';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading bookings...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Alert severity="info">
          You haven't made any bookings yet. Start exploring movies and book your tickets!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={booking.paymentInfo?.transactionId}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: darkMode ? 'grey.800' : 'background.paper',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" noWrap>
                      {booking.movie?.title}
                    </Typography>
                    <Chip
                      label={getStatusText(booking.showtime)}
                      color={getStatusColor(booking.showtime)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn fontSize="small" />
                      {booking.showtime?.theater?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarToday fontSize="small" />
                      {new Date(booking.showtime?.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AccessTime fontSize="small" />
                      {booking.showtime?.time}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Seats ({booking.seats?.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {booking.seats?.slice(0, 4).map((seat) => (
                        <Chip key={seat.id} label={seat.id} size="small" variant="outlined" />
                      ))}
                      {booking.seats?.length > 4 && (
                        <Chip label={`+${booking.seats.length - 4}`} size="small" variant="outlined" />
                      )}
                    </Box>
                  </Box>

                  <Typography variant="h6" color="primary.main" gutterBottom>
                    ${booking.totalPrice}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Transaction ID: {booking.paymentInfo?.transactionId}
                  </Typography>
                </CardContent>

                <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Info />}
                    onClick={() => handleViewDetails(booking)}
                  >
                    Details
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => handleDownloadTicket(booking)}
                    title="Download Ticket"
                  >
                    <Download />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleShare(booking)}
                    title="Share"
                  >
                    <Share />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleCancelBooking(booking.paymentInfo?.transactionId)}
                    title="Cancel Booking"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
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
