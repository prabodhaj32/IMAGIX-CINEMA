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
      bgcolor: '#000000',
      color: '#ffffff',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
              mr: 2, 
              color: '#ffffff',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
            Book Tickets - {movie?.title}
          </Typography>
        </Box>

        {/* Movie Info */}
        <Box sx={{ 
          bgcolor: '#1a1a1a',
          border: '1px solid #333333',
          borderRadius: 2,
          p: 3, 
          mb: 4 
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }}>
              <Box
                component="img"
                src={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`}
                alt={movie?.title}
                sx={{ 
                  width: '100%', 
                  borderRadius: 2,
                  border: '2px solid #333333'
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                {movie?.title}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {movie?.genres?.map((genre) => (
                  <Chip 
                    key={genre.id} 
                    label={genre.name} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#333333', 
                      color: '#ffffff',
                      border: '1px solid #555555'
                    }} 
                  />
                ))}
              </Box>
              <Typography variant="body2" sx={{ color: '#cccccc', mb: 2 }}>
                {movie?.overview}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Chip 
                  icon={<StarRate />} 
                  label={`⭐ ${movie?.vote_average}`} 
                  sx={{ 
                    bgcolor: '#333333', 
                    color: '#ffffff',
                    border: '1px solid #555555'
                  }} 
                />
                <Chip 
                  icon={<CalendarToday />} 
                  label={new Date(movie?.release_date).getFullYear()} 
                  sx={{ 
                    bgcolor: '#333333', 
                    color: '#ffffff',
                    border: '1px solid #555555'
                  }} 
                />
                <Chip 
                  icon={<Movie />} 
                  label={movie?.runtime ? `${movie.runtime} min` : 'N/A'} 
                  sx={{ 
                    bgcolor: '#333333', 
                    color: '#ffffff',
                    border: '1px solid #555555'
                  }} 
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Stepper */}
        <Box sx={{ 
          bgcolor: '#1a1a1a',
          border: '1px solid #333333',
          borderRadius: 2,
          p: 3, 
          mb: 4 
        }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ 
                  '& .MuiStepLabel-label': { 
                    color: '#ffffff',
                    '&.Mui-active': { color: '#ff0000' },
                    '&.Mui-completed': { color: '#ff0000' }
                  }
                }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step Content */}
        <Box sx={{ 
          bgcolor: '#1a1a1a',
          border: '1px solid #333333',
          borderRadius: 2,
          p: 3, 
          minHeight: '400px'
        }}>
          {renderStepContent(activeStep)}
        </Box>
      </Container>
    </Box>
  );
};

export default BookingPage;
