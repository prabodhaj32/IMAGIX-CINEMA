import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Alert,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import {
  CheckCircle,
  Download,
  Email,
  Share,
  Home,
  LocalPrintshop,
} from '@mui/icons-material';

const BookingConfirmation = ({ bookingData, movie, onComplete }) => {
  const [emailSent, setEmailSent] = useState(false);

  const handleDownloadTicket = () => {
    // Generate ticket content
    const ticketContent = `
BOOKING CONFIRMATION
=====================

Transaction ID: ${bookingData.paymentInfo?.transactionId}
Date: ${new Date(bookingData.paymentInfo?.timestamp).toLocaleString()}

MOVIE DETAILS
-------------
Movie: ${movie?.title}
Theater: ${bookingData.showtime?.theater?.name}
Address: ${bookingData.showtime?.theater?.address}
Date: ${new Date(bookingData.showtime?.date).toLocaleDateString()}
Time: ${bookingData.showtime?.time}
Screen: ${bookingData.showtime?.screenType}

SEATS
-----
${bookingData.seats?.map(seat => `${seat.id} - $${seat.price}`).join('\n')}

PAYMENT
-------
Total Amount: $${bookingData.totalPrice}
Payment Method: Credit Card ending in ${bookingData.paymentInfo?.cardNumber?.slice(-4)}

CUSTOMER INFORMATION
--------------------
Email: ${bookingData.paymentInfo?.email}
Phone: ${bookingData.paymentInfo?.phone}

IMPORTANT NOTES
---------------
- Please arrive at least 15 minutes before showtime
- Bring this confirmation email and a valid ID
- No refunds or exchanges after purchase
- Outside food and drinks are not allowed

Thank you for choosing our cinema!
    `.trim();

    // Create and download file
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${bookingData.paymentInfo?.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSendEmail = () => {
    // Simulate sending email
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Booking Confirmation - ${movie?.title}`,
        text: `I've booked tickets for ${movie?.title} on ${new Date(bookingData.showtime?.date).toLocaleDateString()} at ${bookingData.showtime?.time}!`,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      const text = `I've booked tickets for ${movie?.title} on ${new Date(bookingData.showtime?.date).toLocaleDateString()} at ${bookingData.showtime?.time}!`;
      navigator.clipboard.writeText(text);
      alert('Booking details copied to clipboard!');
    }
  };

  return (
    <Box>
      {/* Success Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircle sx={{ fontSize: 64, mb: 2, color: '#ff0000' }} />
        <Typography variant="h4" sx={{ color: '#ff0000', fontWeight: 'bold' }} gutterBottom>
          Booking Confirmed!
        </Typography>
        <Typography variant="body1" sx={{ color: '#cccccc' }}>
          Your tickets have been successfully booked. A confirmation email has been sent to your registered email address.
        </Typography>
      </Box>

      {/* Booking Details */}
      <Box sx={{ 
        p: 4, 
        mb: 3, 
        bgcolor: '#1a1a1a',
        border: '1px solid #333333',
        borderRadius: 2
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
          Booking Details
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#cccccc' }}>
                Transaction ID
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', color: '#ffffff' }}>
                {bookingData.paymentInfo?.transactionId}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#cccccc' }}>
                Movie
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                {movie?.title}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#cccccc' }}>
                Theater
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                {bookingData.showtime?.theater?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#cccccc' }}>
                {bookingData.showtime?.theater?.address}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#cccccc' }}>
                Date & Time
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                {new Date(bookingData.showtime?.date).toLocaleDateString()} at {bookingData.showtime?.time}
              </Typography>
              <Typography variant="body2" sx={{ color: '#cccccc' }}>
                {bookingData.showtime?.screenType}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              bgcolor: '#2a2a2a', 
              borderRadius: 2,
              border: '1px solid #333333'
            }}>
              <Typography variant="h4" sx={{ color: '#ff0000', fontWeight: 'bold' }} gutterBottom>
                ${bookingData.totalPrice}
              </Typography>
              <Typography variant="body2" sx={{ color: '#cccccc' }}>
                Total Paid
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: '#333333' }} />

        <Box>
          <Typography variant="subtitle2" sx={{ color: '#cccccc' }} gutterBottom>
            Seats
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {bookingData.seats?.map((seat) => (
              <Chip
                key={seat.id}
                label={seat.id}
                variant="outlined"
                size="small"
                sx={{ 
                  borderColor: '#ff0000',
                  color: '#ffffff'
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Important Information */}
      <Alert severity="warning" sx={{ 
        mb: 3,
        bgcolor: '#5a4a2d',
        color: '#ffffff',
        '& .MuiAlert-icon': { color: '#ffaa00' }
      }}>
        <Typography variant="subtitle2" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
          Important Information
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#cccccc' }}>
          <li>Please arrive at least 15 minutes before showtime</li>
          <li>Bring this confirmation and a valid ID</li>
          <li>No refunds or exchanges after purchase</li>
          <li>Outside food and drinks are not allowed</li>
        </ul>
      </Alert>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleDownloadTicket}
          sx={{
            color: '#ffffff',
            borderColor: '#333333',
            '&:hover': {
              borderColor: '#ff0000',
              bgcolor: 'rgba(255, 0, 0, 0.1)'
            }
          }}
        >
          Download Ticket
        </Button>

        <Button
          variant="outlined"
          startIcon={<Email />}
          onClick={handleSendEmail}
          disabled={emailSent}
          sx={{
            color: '#ffffff',
            borderColor: '#333333',
            '&:hover': {
              borderColor: '#ff0000',
              bgcolor: 'rgba(255, 0, 0, 0.1)'
            }
          }}
        >
          {emailSent ? 'Email Sent!' : 'Resend Email'}
        </Button>

        <Button
          variant="outlined"
          startIcon={<Share />}
          onClick={handleShare}
          sx={{
            color: '#ffffff',
            borderColor: '#333333',
            '&:hover': {
              borderColor: '#ff0000',
              bgcolor: 'rgba(255, 0, 0, 0.1)'
            }
          }}
        >
          Share
        </Button>

        <Button
          variant="outlined"
          startIcon={<LocalPrintshop />}
          onClick={() => window.print()}
          sx={{
            color: '#ffffff',
            borderColor: '#333333',
            '&:hover': {
              borderColor: '#ff0000',
              bgcolor: 'rgba(255, 0, 0, 0.1)'
            }
          }}
        >
          Print
        </Button>

        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={onComplete}
          sx={{
            bgcolor: '#ff0000',
            color: '#ffffff',
            '&:hover': {
              bgcolor: '#cc0000'
            }
          }}
        >
          Back to Home
        </Button>
      </Box>

      {/* Customer Support */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" sx={{ color: '#cccccc' }}>
          Need help? Contact our customer support at support@cinema.com or call 1-800-CINEMA
        </Typography>
      </Box>
    </Box>
  );
};

export default BookingConfirmation;
