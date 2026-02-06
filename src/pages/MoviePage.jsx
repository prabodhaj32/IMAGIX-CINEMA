import React, { useEffect, useState, useContext } from 'react';
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
} from '@mui/icons-material';
import { fetchMovieDetails } from '../utils/api';
import { MovieContext } from '../context/MovieContext';

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, favorites } = useContext(MovieContext);
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFavorite = movie && favorites.some((fav) => fav.id === movie.id);

  // Fetch movie details when component mounts or 'id' changes
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
          background: 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
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
          background: 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
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
        background: 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        py: 4,
        position: 'relative',
      }}
    >
      {/* Backdrop Image */}
      {getBackdropUrl(movie.backdrop_path) && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60vh',
            backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%), url(${getBackdropUrl(movie.backdrop_path)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
      )}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/home')}
          sx={{
            mb: 3,
            color: '#e5e7eb',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Back to Movies
        </Button>

        <Fade in={true} timeout={800}>
          <Grid container spacing={4}>
            {/* Poster Section */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={8}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Box
                  component="img"
                  src={getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  sx={{
                    width: '100%',
                    display: 'block',
                  }}
                />
              </Paper>
            </Grid>

            {/* Movie Details Section */}
            <Grid item xs={12} md={8}>
              <Box sx={{ color: '#e5e7eb' }}>
                {/* Title and Favorite Button */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: 'bold',
                      color: '#fff',
                      mb: 1,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                    }}
                  >
                    {movie.title}
                  </Typography>
                  <Tooltip title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}>
                    <IconButton
                      onClick={() => toggleFavorite(movie)}
                      sx={{
                        color: isFavorite ? '#f472b6' : '#cbd5e1',
                        '&:hover': {
                          backgroundColor: 'rgba(244, 114, 182, 0.1)',
                        },
                      }}
                    >
                      {isFavorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Tagline */}
                {movie.tagline && (
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#a855f7',
                      fontStyle: 'italic',
                      mb: 2,
                      fontSize: { xs: '1rem', md: '1.2rem' },
                    }}
                  >
                    "{movie.tagline}"
                  </Typography>
                )}

                {/* Rating and Meta Info */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star sx={{ color: '#fbbf24', fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {movie.vote_average?.toFixed(1) || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cbd5e1', ml: 0.5 }}>
                      ({movie.vote_count} votes)
                    </Typography>
                  </Box>

                  <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 20, color: '#60a5fa' }} />
                    <Typography variant="body1" sx={{ color: '#cbd5e1' }}>
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                    </Typography>
                  </Box>

                  <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Movie sx={{ fontSize: 20, color: '#a855f7' }} />
                    <Typography variant="body1" sx={{ color: '#cbd5e1' }}>
                      {movie.runtime || 'N/A'} min
                    </Typography>
                  </Box>
                </Box>

                {/* Genres */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                    Genres
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {movie.genres?.map((genre) => (
                      <Chip
                        key={genre.id}
                        label={genre.name}
                        sx={{
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)',
                          color: '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(`/booking/${id}`)}
                    sx={{
                      background: 'linear-gradient(135deg, #f472b6 0%, #a855f7 100%)',
                      color: '#fff',
                      fontWeight: 'bold',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ec4899 0%, #9333ea 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 25px rgba(168, 85, 247, 0.3)',
                      },
                    }}
                  >
                    Book Tickets
                  </Button>
                </Box>

                {/* Overview */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#fff', mb: 1.5, fontWeight: 'bold' }}>
                    Overview
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#cbd5e1',
                      lineHeight: 1.8,
                      fontSize: { xs: '0.95rem', md: '1rem' },
                    }}
                  >
                    {movie.overview || 'No overview available.'}
                  </Typography>
                </Box>

                {/* Production Companies */}
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                      Production Companies
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {movie.production_companies.slice(0, 5).map((company) => (
                        <Chip
                          key={company.id}
                          label={company.name}
                          size="small"
                          sx={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#cbd5e1',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Cast Section */}
            {cast.length > 0 && (
              <Grid item xs={12}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 'bold' }}>
                    <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Top Cast
                  </Typography>
                  <Grid container spacing={2}>
                    {cast.map((actor) => (
                      <Grid item xs={6} sm={4} md={2.4} key={actor.id}>
                        <Box
                          sx={{
                            textAlign: 'center',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
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
                              width: 80,
                              height: 80,
                              mx: 'auto',
                              mb: 1,
                              bgcolor: 'rgba(168, 85, 247, 0.3)',
                              fontSize: '1.5rem',
                            }}
                          >
                            {actor.name.charAt(0)}
                          </Avatar>
                          <Typography
                            variant="body2"
                            sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}
                            noWrap
                          >
                            {actor.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }} noWrap>
                            {actor.character}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Trailer Section */}
            {trailerUrl && (
              <Grid item xs={12}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PlayArrow sx={{ color: '#f472b6', fontSize: 32 }} />
                    <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      Trailer
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      position: 'relative',
                      paddingTop: '56.25%',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
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
                      }}
                      src={trailerUrl}
                      title="Movie Trailer"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};

export default MoviePage;