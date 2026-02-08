import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import {
  ArrowBack,
  EventSeat,
  CalendarToday,
  AccessTime,
  CreditCard,
  CheckCircle,
  Movie,
  ArrowForward,
  StarRate,
  LocalMovies,
  Theaters,
} from '@mui/icons-material';
import { fetchMovieDetails } from '../utils/api';
import SeatSelection from '../components/booking/SeatSelection';
import ShowtimeSelection from '../components/booking/ShowtimeSelection';
import PaymentForm from '../components/booking/PaymentForm';
import BookingConfirmation from '../components/booking/BookingConfirmation';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    movieId: id,
    showtime: null,
    seats: [],
    totalPrice: 0,
    paymentInfo: null,
  });

  const steps = ['Select Showtime', 'Choose Seats', 'Payment', 'Confirmation'];

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetchMovieDetails(id);
        setMovie(res.data);
      } catch (err) {
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const updateBookingData = (newData) => {
    setBookingData((prev) => ({ ...prev, ...newData }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ShowtimeSelection
            movie={movie}
            onSelectShowtime={(showtime) => {
              updateBookingData({ showtime });
              handleNext();
            }}
          />
        );
      case 1:
        return (
          <SeatSelection
            showtime={bookingData.showtime}
            onSeatsSelected={(seats, totalPrice) => {
              updateBookingData({ seats, totalPrice });
              handleNext();
            }}
          onBack={handleBack}
          />
        );
      case 2:
        return (
          <PaymentForm
            bookingData={bookingData}
            movie={movie}
            onPaymentSuccess={(paymentInfo) => {
              updateBookingData({ paymentInfo });
              handleNext();
            }}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <BookingConfirmation
            bookingData={bookingData}
            movie={movie}
            onComplete={() => navigate('/home')}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      py: 4,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
          top: '10%',
          left: '-10%',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
          top: '60%',
          right: '-5%',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Enhanced Header */}
        <Fade in={true} timeout={600}>
          <Box sx={{ mt: 4, mb: 4, display: 'flex', alignItems: 'center' }}>
          </Box>
        </Fade>

        {/* Enhanced Stepper */}
        <Zoom in={true} timeout={1000} style={{ transitionDelay: '400ms' }}>
          <Paper
            elevation={12}
            sx={{
              p: 4,
              mb: 4,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '25px',
            }}
          >
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel 
                    sx={{ 
                      '& .MuiStepLabel-label': { 
                        color: '#cbd5e1',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        '&.Mui-active': { 
                          color: '#f472b6',
                          textShadow: '0 0 10px rgba(244, 114, 182, 0.5)'
                        }, 
                        '&.Mui-completed': { 
                          color: '#10b981',
                          textShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                        }
                      },
                      '& .MuiStepIcon-root': {
                        color: 'rgba(255, 255, 255, 0.3)',
                        '&.Mui-active': {
                          color: '#f472b6',
                          boxShadow: '0 0 15px rgba(244, 114, 182, 0.6)'
                        },
                        '&.Mui-completed': {
                          color: '#10b981',
                          boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)'
                        }
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {index === 0 && <CalendarToday />}
                      {index === 1 && <EventSeat />}
                      {index === 2 && <CreditCard />}
                      {index === 3 && <CheckCircle />}
                      {label}
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Zoom>

        {/* Enhanced Step Content */}
        <Slide direction="up" in={true} timeout={1200} style={{ transitionDelay: '600ms' }}>
          <Paper
            elevation={16}
            sx={{
              p: 4,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '25px',
              minHeight: '500px',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: activeStep === 0 ? 'linear-gradient(90deg, #3b82f6, #1d4ed8)' :
                           activeStep === 1 ? 'linear-gradient(90deg, #8b5cf6, #7c3aed)' :
                           activeStep === 2 ? 'linear-gradient(90deg, #10b981, #059669)' :
                           'linear-gradient(90deg, #f59e0b, #d97706)',
                borderRadius: '25px 25px 0 0',
              }
            }}
          >
            {renderStepContent(activeStep)}
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
};

export default BookingPage;
