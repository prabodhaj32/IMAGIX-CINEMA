import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Chip,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Button,
  Divider,
  Avatar,
  Fade,
  IconButton,
  Tooltip,
  Skeleton,
  Zoom,
  Slide,
  useScrollTrigger,
  Fab,
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  Star,
  Movie,
  Favorite,
  FavoriteBorder,
  PlayArrow,
  Person,
  Share,
  Bookmark,
  BookmarkBorder,
  ThumbUp,
  ThumbDown,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';
import { fetchMovieDetails } from '../utils/api';
import { MovieContext } from '../context/MovieContext';

const MoviePage = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, favorites } = useContext(MovieContext);
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const posterRef = useRef(null);
  const trailerRef = useRef(null);

  const isFavorite = movie && favorites.some((fav) => fav.id === movie.id);
  const trigger = useScrollTrigger({ threshold: 100 });

  // Add scroll parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: movie.overview,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Movie link copied to clipboard!');
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleRating = (rating) => {
    setUserRating(rating);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (trailerRef.current?.requestFullscreen) {
        trailerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchMovieDetails(id);
        setMovie(res.data);

        // Extract top 10 cast members
        const credits = res.data.credits?.cast || [];
        setCast(credits.slice(0, 10));

        // Extract YouTube trailer link
        const trailer = res.data.videos?.results?.find(
          (v) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const getPosterUrl = (path) =>
    path
      ? `https://image.tmdb.org/t/p/w500${path}`
      : 'https://via.placeholder.com/500x750?text=No+Image';

  const getBackdropUrl = (path) =>
    path
      ? `https://image.tmdb.org/t/p/w1280${path}`
      : null;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: darkMode ? "#0a192f" : "#1e3a5f",
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={80} sx={{ color: '#a855f7', mb: 3 }} />
          <Typography variant="h5" sx={{ color: '#e5e7eb' }}>
            Loading movie details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: darkMode ? "#030b17" : "#1e3a5f",
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
            ⚠️ {error || 'Movie not found'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/home')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              },
            }}
          >
            Back to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: darkMode ? "#0a192f" : "#1e3a5f",
        py: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
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
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
          top: '60%',
          right: '-5%',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      {/* Parallax Backdrop */}
      {getBackdropUrl(movie.backdrop_path) && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '70vh',
            backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%), url(${getBackdropUrl(movie.backdrop_path)})`,
            backgroundSize: 'cover',
            backgroundPosition: `center ${scrollY * 0.5}px`,
            backgroundAttachment: 'fixed',
            zIndex: 0,
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
      )}

      <Container maxWidth="lg" sx={{ 
        position: 'relative', 
        zIndex: 1,
        pt: 12, // Add padding top to account for fixed navbar
        minHeight: 'calc(100vh - 64px)' // Ensure full height minus navbar
      }}>
        {/* Enhanced Floating Action Button */}
        <Slide direction="up" in={trigger}>
          <Fab
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              background: 'linear-gradient(135deg, #f472b6 0%, #a855f7 100%)',
              color: '#fff',
              zIndex: 1000,
              width: 64,
              height: 64,
              fontSize: '1.5rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #ec4899 0%, #9333ea 100%)',
                transform: 'scale(1.1)',
                boxShadow: '0 12px 32px rgba(244, 114, 182, 0.6)',
              }
            }}
            onClick={() => navigate(`/booking/${id}`)}
            title="Book Tickets"
          >
            🎬
          </Fab>
        </Slide>

        {/* Enhanced Back Button */}
        <Zoom in={true} timeout={600}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/home')}
            sx={{
              mb: 3,
              color: '#e5e7eb',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50px',
              px: 3,
              py: 1.5,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateX(-4px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Back to Movies
          </Button>
        </Zoom>

        <Fade in={true} timeout={1000}>
          <Grid container spacing={4}>
            {/* Enhanced Poster Section */}
            <Grid item xs={12} md={4}>
              <Zoom in={true} timeout={1200} style={{ transitionDelay: '200ms' }}>
                <Paper
                  elevation={24}
                  sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-10px) scale(1.02)',
                      boxShadow: '0 25px 50px rgba(168, 85, 247, 0.3)',
                    },
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  >
                    <Box
                      ref={posterRef}
                      component="img"
                      src={getPosterUrl(movie.poster_path)}
                      alt={movie.title}
                      sx={{
                        width: '100%',
                        display: 'block',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                    {/* Overlay Effects */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
                        opacity: 0,
                        '&:hover': { opacity: 1 },
                        transition: 'opacity 0.3s ease'
                      }}
                    />
                  </Paper>
                </Zoom>
            </Grid>

            {/* Enhanced Movie Details Section */}
            <Grid item xs={12} md={8}>
              <Zoom in={true} timeout={1400} style={{ transitionDelay: '400ms' }}>
                <Box sx={{ color: '#e5e7eb' }}>
                  {/* Title and Action Buttons */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography
                      variant="h2"
                      component="h1"
                      sx={{
                        fontWeight: 'bold',
                        color: '#fff',
                        background: 'linear-gradient(135deg, #fff 0%, #e5e7eb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        mb: 1,
                        fontSize: { xs: '1.8rem', md: '2.5rem' },
                        textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      }}
                    >
                      {movie.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Tooltip title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}>
                        <IconButton
                          onClick={() => toggleFavorite(movie)}
                          sx={{
                            color: isFavorite ? '#f472b6' : '#cbd5e1',
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(244, 114, 182, 0.1)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {isFavorite ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}>
                        <IconButton
                          onClick={toggleBookmark}
                          sx={{
                            color: isBookmarked ? '#60a5fa' : '#cbd5e1',
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(96, 165, 250, 0.1)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Share Movie">
                        <IconButton
                          onClick={handleShare}
                          sx={{
                            color: '#cbd5e1',
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Share />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Enhanced Tagline */}
                  {movie.tagline && (
                    <Fade in={true} timeout={1600} style={{ transitionDelay: '600ms' }}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: '#a855f7',
                          fontStyle: 'italic',
                          mb: 2,
                          fontSize: '1.2rem',
                        }}
                      >
                        "{movie.tagline}"
                      </Typography>
                    </Fade>
                  )}

                  {/* Enhanced Genres */}
                  <Fade in={true} timeout={1800} style={{ transitionDelay: '800ms' }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ color: '#a855f7', mb: 2, fontWeight: 'bold' }}>
                        🎭 Genres
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                        {movie.genres?.map((genre, index) => (
                          <Zoom in={true} timeout={2000} style={{ transitionDelay: `${800 + index * 100}ms` }}>
                            <Chip
                              key={genre.id}
                              label={genre.name}
                              sx={{
                                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%)',
                                color: '#fff',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                fontWeight: 'bold',
                                px: 2,
                                py: 1,
                                fontSize: '0.9rem',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.6) 0%, rgba(236, 72, 153, 0.6) 100%)',
                                  transform: 'scale(1.05)',
                                  boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                                },
                                transition: 'all 0.3s ease'
                              }}
                            />
                          </Zoom>
                        ))}
                      </Box>
                    </Box>
                  </Fade>

                  {/* Enhanced Overview */}
                  <Fade in={true} timeout={2000} style={{ transitionDelay: '1000ms' }}>
                    <Paper
                      elevation={8}
                      sx={{
                        p: 3,
                        mb: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                      }}
                    >
                      <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 'bold' }}>
                        📖 Overview
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#cbd5e1',
                          lineHeight: 1.8,
                          fontSize: { xs: '0.95rem', md: '1.05rem' },
                          textAlign: 'justify',
                          mb: 3,
                        }}
                      >
                        {movie.overview || 'No overview available.'}
                      </Typography>
                      
                      {/* Enhanced Booking Button */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<PlayArrow />}
                          onClick={() => navigate(`/booking/${id}`)}
                          sx={{
                            background: 'linear-gradient(135deg, #f472b6 0%, #a855f7 100%)',
                            color: '#fff',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            px: 6,
                            py: 2,
                            borderRadius: '50px',
                            textTransform: 'none',
                            boxShadow: '0 8px 24px rgba(244, 114, 182, 0.4)',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #ec4899 0%, #9333ea 100%)',
                              transform: 'translateY(-3px) scale(1.05)',
                              boxShadow: '0 12px 32px rgba(244, 114, 182, 0.6)',
                            },
                            '&:active': {
                              transform: 'translateY(-1px) scale(1.02)',
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          🎬 Book Tickets Now
                        </Button>
                      </Box>
                    </Paper>
                  </Fade>

                  {/* Enhanced Production Companies */}
                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <Fade in={true} timeout={2200} style={{ transitionDelay: '1200ms' }}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ color: '#a855f7', mb: 2, fontWeight: 'bold' }}>
                          🏢 Production Companies
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                          {movie.production_companies.slice(0, 5).map((company, index) => (
                            <Zoom in={true} timeout={2400} style={{ transitionDelay: `${1200 + index * 100}ms` }}>
                              <Chip
                                key={company.id}
                                label={company.name}
                                size="medium"
                                sx={{
                                  background: 'rgba(255, 255, 255, 0.08)',
                                  color: '#cbd5e1',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  fontWeight: 'medium',
                                  '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.12)',
                                    transform: 'scale(1.05)',
                                  },
                                  transition: 'all 0.3s ease'
                                }}
                              />
                            </Zoom>
                          ))}
                        </Box>
                      </Box>
                    </Fade>
                  )}
                </Box>
              </Zoom>
            </Grid>

            {/* Enhanced Cast Section */}
            {cast.length > 0 && (
              <Grid item xs={12}>
                <Fade in={true} timeout={2600} style={{ transitionDelay: '1400ms' }}>
                  <Paper
                    elevation={12}
                    sx={{
                      p: 4,
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '25px',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #a855f7, #ec4899, #f472b6)',
                        borderRadius: '25px 25px 0 0',
                      }
                    }}
                  >
                    <Typography variant="h4" sx={{ color: '#fff', mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
                      👥 Top Cast
                    </Typography>
                    <Grid container spacing={3}>
                      {cast.map((actor, index) => (
                        <Grid item xs={6} sm={4} md={2.4} key={actor.id}>
                          <Zoom in={true} timeout={2800} style={{ transitionDelay: `${1400 + index * 150}ms` }}>
                            <Box
                              sx={{
                                textAlign: 'center',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  transform: 'translateY(-8px) scale(1.05)',
                                },
                              }}
                            >
                              <Avatar
                                src={
                                  actor.profile_path
                                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                    : undefined
                                }
                                sx={{
                                  width: 100,
                                  height: 100,
                                  mx: 'auto',
                                  mb: 2,
                                  bgcolor: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%)',
                                  fontSize: '2rem',
                                  fontWeight: 'bold',
                                  border: '3px solid rgba(255, 255, 255, 0.2)',
                                  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                                }}
                              >
                                {actor.name.charAt(0)}
                              </Avatar>
                              <Typography
                                variant="body1"
                                sx={{ 
                                  color: '#fff', 
                                  fontWeight: 'bold', 
                                  mb: 1,
                                  fontSize: '0.95rem'
                                }}
                                noWrap
                              >
                                {actor.name}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#a855f7', 
                                  fontStyle: 'italic',
                                  fontSize: '0.85rem'
                                }} 
                                noWrap
                              >
                                as {actor.character}
                              </Typography>
                            </Box>
                          </Zoom>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Fade>
              </Grid>
            )}

            {/* Enhanced Trailer Section */}
            {trailerUrl && (
              <Grid item xs={12}>
                <Fade in={true} timeout={3000} style={{ transitionDelay: '1600ms' }}>
                  <Paper
                    elevation={16}
                    sx={{
                      p: 4,
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '25px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PlayArrow sx={{ color: '#f472b6', fontSize: 40, filter: 'drop-shadow(0 0 12px rgba(244, 114, 182, 0.6))' }} />
                        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
                          🎬 Official Trailer
                        </Typography>
                      </Box>
                      
                      {/* Trailer Controls */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                          <IconButton
                            onClick={toggleMute}
                            sx={{
                              color: '#cbd5e1',
                              background: 'rgba(255, 255, 255, 0.05)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            {isMuted ? <VolumeOff /> : <VolumeUp />}
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                          <IconButton
                            onClick={toggleFullscreen}
                            sx={{
                              color: '#cbd5e1',
                              background: 'rgba(255, 255, 255, 0.05)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Box
                      ref={trailerRef}
                      sx={{
                        position: 'relative',
                        paddingTop: '56.25%',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.4)',
                        background: 'rgba(0, 0, 0, 0.8)',
                      }}
                    >
                      <iframe
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          borderRadius: '12px',
                        }}
                        src={trailerUrl}
                        title="Movie Trailer"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      
                      {/* Play Button Overlay */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: 'rgba(244, 114, 182, 0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(236, 72, 153, 0.9)',
                            transform: 'translate(-50%, -50%) scale(1.1)',
                          },
                        }}
                        onClick={() => {
                          const iframe = trailerRef.current?.querySelector('iframe');
                          if (iframe) {
                            iframe.src += '&autoplay=1';
                          }
                        }}
                      >
                        <PlayArrow sx={{ fontSize: 40, color: '#fff' }} />
                      </Box>
                    </Box>
                  </Paper>
                </Fade>
              </Grid>
            )}
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};

export default MoviePage;