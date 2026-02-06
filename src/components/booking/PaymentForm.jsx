import React, { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  Paper,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  CreditCard,
  ArrowBack,
  ArrowForward,
  Security,
} from '@mui/icons-material';

const PaymentForm = ({ bookingData, movie, onPaymentSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (event) => {
    let value = event.target.value;
    
    // Format card number with spaces
    if (field === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      value = value.slice(0, 19); // Max 19 characters (16 digits + 3 spaces)
    }
    
    // Format expiry date
    if (field === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      value = value.slice(0, 5);
    }
    
    // Only allow digits for CVV and phone
    if (field === 'cvv' || field === 'phone') {
      value = value.replace(/\D/g, '');
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const paymentInfo = {
        ...formData,
        transactionId: 'TXN' + Date.now(),
        timestamp: new Date().toISOString(),
      };
      
      // Save booking to localStorage
      const bookingDataWithPayment = {
        ...bookingData,
        paymentInfo,
        movie: {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
        },
      };
      
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      const updatedBookings = [...existingBookings, bookingDataWithPayment];
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
      
      onPaymentSuccess(paymentInfo);
      setProcessing(false);
    }, 2000);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
        Payment Information
      </Typography>

      <Alert severity="info" sx={{ 
        mb: 3, 
        bgcolor: '#2a2a2a',
        color: '#ffffff',
        '& .MuiAlert-icon': { color: '#ff0000' }
      }}>
        Your payment information is secure and encrypted. We accept Visa, Mastercard, and American Express.
      </Alert>

      {/* Booking Summary */}
      <Box sx={{ 
        p: 3, 
        mb: 3, 
        bgcolor: '#1a1a1a',
        border: '1px solid #333333',
        borderRadius: 2
      }}>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
          Booking Summary
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#cccccc' }}>
            Movie: {movie?.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#cccccc' }}>
            Theater: {bookingData.showtime?.theater?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#cccccc' }}>
            Date: {new Date(bookingData.showtime?.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" sx={{ color: '#cccccc' }}>
            Time: {bookingData.showtime?.time}
          </Typography>
          <Typography variant="body2" sx={{ color: '#cccccc' }}>
            Screen: {bookingData.showtime?.screenType}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2, borderColor: '#333333' }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {bookingData.seats?.map((seat) => (
            <Chip 
              key={seat.id} 
              label={seat.id} 
              size="small" 
              sx={{ 
                bgcolor: '#333333', 
                color: '#ffffff',
                border: '1px solid #555555'
              }} 
            />
          ))}
        </Box>
        
        <Typography variant="h6" sx={{ color: '#ff0000', fontWeight: 'bold' }}>
          Total Amount: ${bookingData.totalPrice}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Card Information
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Card Number"
              value={formData.cardNumber}
              onChange={handleInputChange('cardNumber')}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              placeholder="1234 5678 9012 3456"
              InputProps={{
                startAdornment: <CreditCard sx={{ mr: 1, color: '#ff0000' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#333333',
                  },
                  '&:hover fieldset': {
                    borderColor: '#555555',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff0000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#cccccc',
                  '&.Mui-focused': {
                    color: '#ff0000',
                  },
                },
              }}
            />
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Cardholder Name"
              value={formData.cardName}
              onChange={handleInputChange('cardName')}
              error={!!errors.cardName}
              helperText={errors.cardName}
              placeholder="John Doe"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#333333',
                  },
                  '&:hover fieldset': {
                    borderColor: '#555555',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff0000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#cccccc',
                  '&.Mui-focused': {
                    color: '#ff0000',
                  },
                },
              }}
            />
          </Grid>
          
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              label="Expiry Date"
              value={formData.expiryDate}
              onChange={handleInputChange('expiryDate')}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
              placeholder="MM/YY"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#333333',
                  },
                  '&:hover fieldset': {
                    borderColor: '#555555',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff0000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#cccccc',
                  '&.Mui-focused': {
                    color: '#ff0000',
                  },
                },
              }}
            />
          </Grid>
          
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              label="CVV"
              value={formData.cvv}
              onChange={handleInputChange('cvv')}
              error={!!errors.cvv}
              helperText={errors.cvv}
              placeholder="123"
              type="password"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#333333',
                  },
                  '&:hover fieldset': {
                    borderColor: '#555555',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff0000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#cccccc',
                  '&.Mui-focused': {
                    color: '#ff0000',
                  },
                },
              }}
            />
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, color: '#ffffff', fontWeight: 'bold' }}>
              Contact Information
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              placeholder="john@example.com"
              type="email"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#333333',
                  },
                  '&:hover fieldset': {
                    borderColor: '#555555',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff0000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#cccccc',
                  '&.Mui-focused': {
                    color: '#ff0000',
                  },
                },
              }}
            />
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="1234567890"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#333333',
                  },
                  '&:hover fieldset': {
                    borderColor: '#555555',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff0000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#cccccc',
                  '&.Mui-focused': {
                    color: '#ff0000',
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security color="primary" fontSize="small" sx={{ color: '#ff0000' }} />
          <Typography variant="caption" sx={{ color: '#cccccc' }}>
            Your payment information is encrypted and secure. We never store your card details.
          </Typography>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={onBack}
            startIcon={<ArrowBack />}
            variant="outlined"
            disabled={processing}
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
            type="submit"
            endIcon={processing ? <CircularProgress size={20} /> : <ArrowForward />}
            variant="contained"
            disabled={processing}
            sx={{
              minWidth: '150px',
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
            {processing ? 'Processing...' : `Pay $${bookingData.totalPrice}`}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PaymentForm;
