import React, { useState, useEffect, useRef } from 'react';
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
  PictureAsPdf,
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

const BookingConfirmation = ({ bookingData, movie, onComplete }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [bookingSaved, setBookingSaved] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const ticketRef = useRef(null);

  // Save booking to localStorage on component mount
  useEffect(() => {
    const saveBookingToStorage = () => {
      try {
        // Get existing bookings from localStorage
        const existingBookings = localStorage.getItem('userBookings');
        const bookings = existingBookings ? JSON.parse(existingBookings) : [];
        
        // Create complete booking object with movie data
        const completeBooking = {
          ...bookingData,
          movie: {
            id: movie?.id,
            title: movie?.title,
            poster_path: movie?.poster_path,
            genres: movie?.genres
          },
          bookingDate: new Date().toISOString(),
          status: 'confirmed'
        };
        
        // Check if booking already exists (by transaction ID)
        const existingIndex = bookings.findIndex(
          b => b.paymentInfo?.transactionId === bookingData.paymentInfo?.transactionId
        );
        
        if (existingIndex === -1) {
          // Add new booking
          bookings.push(completeBooking);
        } else {
          // Update existing booking
          bookings[existingIndex] = completeBooking;
        }
        
        // Save updated bookings to localStorage
        localStorage.setItem('userBookings', JSON.stringify(bookings));
        setBookingSaved(true);
        
        console.log('Booking saved successfully:', completeBooking);
      } catch (error) {
        console.error('Error saving booking:', error);
      }
    };
    
    if (bookingData && bookingData.paymentInfo?.transactionId && movie) {
      saveBookingToStorage();
    }
  }, [bookingData, movie]);

  // Generate QR Code for booking
  useEffect(() => {
    const generateQRCode = async () => {
      if (bookingData?.paymentInfo?.transactionId) {
        try {
          const qrData = JSON.stringify({
            transactionId: bookingData.paymentInfo.transactionId,
            movie: movie?.title,
            date: bookingData.showtime?.date,
            time: bookingData.showtime?.time,
            seats: bookingData.seats?.map(s => s.id)
          });
          
          const url = await QRCode.toDataURL(qrData, {
            width: 200,
            margin: 1,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setQrCodeUrl(url);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQRCode();
  }, [bookingData, movie]);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
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
      pdf.save(`booking-${bookingData.paymentInfo?.transactionId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

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
      <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
        <Box sx={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(255, 0, 0, 0.3)'
        }}>
          <CheckCircle sx={{ fontSize: 64, color: '#ffffff' }} />
        </Box>
        <Box sx={{ pt: 16 }}>
          <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 2 }}>
            Booking Confirmed!
          </Typography>
          <Typography variant="h6" sx={{ color: '#cccccc', mb: 3, maxWidth: 600, mx: 'auto' }}>
            Your tickets have been successfully booked. A confirmation email has been sent to your registered email address.
          </Typography>
          {bookingSaved && (
            <Alert 
              severity="success" 
              sx={{ 
                mt: 2, 
                bgcolor: 'rgba(26, 58, 26, 0.8)', 
                color: '#ffffff',
                border: '1px solid #4caf50',
                borderRadius: 2,
                '& .MuiAlert-icon': { color: '#4caf50' }
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                ✓ Booking has been saved to your account!
              </Typography>
            </Alert>
          )}
        </Box>
      </Box>

      {/* Hidden Ticket Template for PDF Generation */}
      <Box
        ref={ticketRef}
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
              {movie?.title}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#666666', fontWeight: 'bold' }}>
                Transaction ID:
              </Typography>
              <Typography variant="body1" sx={{ color: '#000000', fontFamily: 'monospace' }}>
                {bookingData.paymentInfo?.transactionId}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#666666', fontWeight: 'bold' }}>
                Theater:
              </Typography>
              <Typography variant="body1" sx={{ color: '#000000' }}>
                {bookingData.showtime?.theater?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                {bookingData.showtime?.theater?.address}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#666666', fontWeight: 'bold' }}>
                Date & Time:
              </Typography>
              <Typography variant="body1" sx={{ color: '#000000' }}>
                {new Date(bookingData.showtime?.date).toLocaleDateString()} at {bookingData.showtime?.time}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                {bookingData.showtime?.screenType}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#666666', fontWeight: 'bold' }}>
                Seats:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {bookingData.seats?.map((seat) => (
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
                ${bookingData.totalPrice}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              {qrCodeUrl && (
                <img src={qrCodeUrl} alt="QR Code" style={{ width: '150px', height: '150px' }} />
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

      {/* Booking Details */}
      <Box sx={{ 
        p: 4, 
        mb: 3, 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        border: '1px solid #333333',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 200,
          height: 200,
          background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.1) 0%, rgba(255, 0, 0, 0.05) 100%)',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)'
        }} />
        
        <Typography variant="h5" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold', position: 'relative', zIndex: 1 }}>
          🎬 Booking Details
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#ff0000', fontWeight: 'bold', mb: 1 }}>
                Transaction ID
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', color: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.1)', p: 1, borderRadius: 1 }}>
                {bookingData.paymentInfo?.transactionId}
              </Typography>
            </Box>

            <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#ff0000', fontWeight: 'bold', mb: 1 }}>
                🎭 Movie
              </Typography>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'medium' }}>
                {movie?.title}
              </Typography>
            </Box>

            <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#ff0000', fontWeight: 'bold', mb: 1 }}>
                🏢 Theater
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                {bookingData.showtime?.theater?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#cccccc' }}>
                {bookingData.showtime?.theater?.address}
              </Typography>
            </Box>

            <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#ff0000', fontWeight: 'bold', mb: 1 }}>
                📅 Date & Time
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
              p: 3, 
              background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)', 
              borderRadius: 3,
              border: '2px solid #ff0000',
              boxShadow: '0 4px 16px rgba(255, 0, 0, 0.2)',
              position: 'relative',
              zIndex: 1
            }}>
              <Typography variant="h3" sx={{ color: '#ff0000', fontWeight: 'bold' }} gutterBottom>
                ${bookingData.totalPrice}
              </Typography>
              <Typography variant="body2" sx={{ color: '#cccccc' }}>
                Total Paid
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#ff0000', opacity: 0.3 }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#ff0000', fontWeight: 'bold', mb: 2 }}>
            🎫 Seats ({bookingData.seats?.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {bookingData.seats?.map((seat) => (
              <Chip
                key={seat.id}
                label={seat.id}
                variant="outlined"
                size="medium"
                sx={{ 
                  borderColor: '#ff0000',
                  color: '#ffffff',
                  bgcolor: 'rgba(255, 0, 0, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 0, 0, 0.2)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease'
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
          variant="contained"
          startIcon={<PictureAsPdf />}
          onClick={handleDownloadPDF}
          sx={{
            bgcolor: '#ff0000',
            color: '#ffffff',
            '&:hover': {
              bgcolor: '#cc0000'
            }
          }}
        >
          Download PDF Ticket
        </Button>

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
          Download Text Ticket
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
