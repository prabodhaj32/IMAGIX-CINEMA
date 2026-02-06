import React, { useContext, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Container,
  Paper,
  Fade,
  Chip,
  Divider,
  IconButton,
  List,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from "@mui/material";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import SearchIcon from '@mui/icons-material/Search';
import LayersIcon from '@mui/icons-material/Layers';
import InfiniteScroll from "react-infinite-scroll-component";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import MovieListItem from "../components/MovieListItem";
import { MovieContext } from "../context/MovieContext"; 

const Home = ({ darkMode = false }) => {
  // Extract state and actions from MovieContext
  const {
    movies,
    page,
    setPage,
    hasMore,
    loading,
    error,
    searchQuery,
  } = useContext(MovieContext);

  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'compact'
  const [searchVariant, setSearchVariant] = useState('rounded');
  const [sortOption, setSortOption] = useState('popularity');
  const [minRating, setMinRating] = useState(0);
  const [language, setLanguage] = useState('all');

  const getPosterUrl = (path) =>
    path ? `https://image.tmdb.org/t/p/w500${path}` : "https://via.placeholder.com/500x750?text=No+Image";

  // Function to load next page of movies when scrolling
  const fetchMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Derive filtered + sorted movies without mutating base list
  const processedMovies = useMemo(() => {
    const filtered = movies.filter((movie) => {
      const rating = movie.vote_average || 0;
      const langOk = language === 'all' || movie.original_language === language;
      return rating >= minRating && langOk;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === 'rating') return (b.vote_average || 0) - (a.vote_average || 0);
      if (sortOption === 'release')
        return new Date(b.release_date || 0) - new Date(a.release_date || 0);
      return (b.popularity || 0) - (a.popularity || 0);
    });

    return sorted;
  }, [movies, sortOption, minRating, language]);

  const languages = useMemo(() => {
    const unique = new Set(movies.map((m) => m.original_language).filter(Boolean));
    return ['all', ...Array.from(unique).slice(0, 8)];
  }, [movies]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = processedMovies.length;
    const avgRating = processedMovies.length > 0
      ? (processedMovies.reduce((sum, m) => sum + (m.vote_average || 0), 0) / processedMovies.length).toFixed(1)
      : 0;
    const topRated = processedMovies.filter(m => (m.vote_average || 0) >= 8).length;
    return { total, avgRating, topRated };
  }, [processedMovies]);

  const isDark = Boolean(darkMode);

  const colors = {
    rootBg: isDark
      ? 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
      : 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.06) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.05) 0%, transparent 60%), linear-gradient(135deg, #ffffff 0%, #f3f0ff 50%, #fff7ed 100%)',
    subtitle: isDark ? '#cbd5e1' : '#374151',
    paperBg: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.04)',
    paperBorder: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0,0,0,0.08)',
    backdrop: isDark ? 'blur(20px)' : 'blur(6px)',
    divider: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    controlText: isDark ? '#cbd5e1' : '#374151',
    sliderColor: isDark ? '#a855f7' : '#6d28d9',
  };

  return (
    <>
      <style>
        {`
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}
      </style>
    <Box sx={{
      minHeight: '100vh',
      background: colors.rootBg,
      py: 4,
      px: { xs: 1, sm: 2 }
    }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Fade in={true} timeout={1000}>
            <Box>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  background: 'linear-gradient(45deg, #60a5fa 0%, #a855f7 40%, #f472b6 80%, #fbbf24 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  animation: 'gradient-shift 3s ease infinite',
                  backgroundSize: '200% 200%',
                }}
              >
                🎬 Movie Explorer
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: colors.subtitle,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                Discover amazing movies, explore trending films, and build your personal watchlist
              </Typography>

              {/* Search Bar */}
              <Paper
                elevation={8}
                sx={{
                  p: 3,
                  maxWidth: 700,
                  mx: 'auto',
                  borderRadius: 4,
                  background: colors.paperBg,
                  backdropFilter: colors.backdrop,
                  border: colors.paperBorder,
                  boxShadow: isDark ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)' : '0 4px 12px rgba(15,23,42,0.04)',
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <SearchBar darkMode={darkMode} variant={searchVariant} />
                  </Box>
                  <ToggleButtonGroup
                    value={searchVariant}
                    exclusive
                    onChange={(_, val) => val && setSearchVariant(val)}
                    size="small"
                    sx={{ mt: { xs: 1, sm: 0 } }}
                  >
                    <ToggleButton value="rounded" aria-label="rounded">
                      <SearchIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="glass" aria-label="glass">
                      <LayersIcon fontSize="small" />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Paper>
            </Box>
          </Fade>
        </Box>

        {/* Stats Cards */}
        {movies.length > 0 && (
          <Fade in={true} timeout={1200}>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: colors.paperBorder,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h4" sx={{ color: '#a78bfa', fontWeight: 'bold' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.subtitle }}>
                    Movies Found
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(236, 72, 153, 0.06) 0%, rgba(219, 39, 119, 0.06) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: colors.paperBorder,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h4" sx={{ color: '#f472b6', fontWeight: 'bold' }}>
                    ⭐ {stats.avgRating}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.subtitle }}>
                    Average Rating
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(37, 99, 235, 0.06) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: colors.paperBorder,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h4" sx={{ color: '#60a5fa', fontWeight: 'bold' }}>
                    {stats.topRated}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.subtitle }}>
                    Top Rated (8+)
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Fade>
        )}

        <Divider sx={{ mb: 4, borderColor: colors.divider }} />

        {/* Content Section */}
        <Box>
          {/* Section Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ textAlign: 'center', flex: 1, minWidth: 240 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: colors.controlText
                }}
              >
                {searchQuery ? "🔍 Search Results" : "🔥 Trending Movies"}
              </Typography>
              {searchQuery && (
                <Chip
                  label={`Searching for: "${searchQuery}"`}
                  color="primary"
                  variant="outlined"
                  sx={{
                    mb: 2,
                    fontSize: '0.9rem',
                    px: 2,
                    py: 1
                  }}
                />
              )}
            </Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              <Paper
                elevation={2}
                sx={{
                  p: 1.5,
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  background: colors.paperBg,
                  backdropFilter: colors.backdrop,
                  border: colors.paperBorder,
                  borderRadius: 3,
                  flexWrap: 'wrap',
                }}
              >
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="sort-label" sx={{ color: colors.controlText }}>Sort by</InputLabel>
                  <Select
                    labelId="sort-label"
                    value={sortOption}
                    label="Sort by"
                    onChange={(e) => setSortOption(e.target.value)}
                    sx={{
                      color: isDark ? '#fff' : '#111827',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.08)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0,0,0,0.12)',
                      },
                      '& .MuiSvgIcon-root': {
                        color: colors.controlText,
                      },
                    }}
                  >
                    <MenuItem value="popularity">Popularity</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="release">Release Date</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel id="language-label" sx={{ color: colors.controlText }}>Language</InputLabel>
                  <Select
                    labelId="language-label"
                    value={language}
                    label="Language"
                    onChange={(e) => setLanguage(e.target.value)}
                    sx={{
                      color: isDark ? '#fff' : '#111827',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.08)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0,0,0,0.12)',
                      },
                      '& .MuiSvgIcon-root': {
                        color: colors.controlText,
                      },
                    }}
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang} value={lang}>
                        {lang === 'all' ? 'All Languages' : lang.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ width: 200 }}>
                  <Typography variant="body2" sx={{ color: colors.controlText, mb: 0.5, fontSize: '0.75rem' }}>
                    Min Rating: {minRating}+
                  </Typography>
                  <Slider
                    size="small"
                    value={minRating}
                    onChange={(_, val) => setMinRating(val)}
                    min={0}
                    max={10}
                    step={1}
                    marks={[0, 5, 10].map(v => ({ value: v }))}
                    sx={{
                      color: colors.sliderColor,
                      '& .MuiSlider-thumb': {
                        '&:hover': {
                          boxShadow: '0 0 0 8px rgba(168, 85, 247, 0.16)',
                        },
                      },
                    }}
                  />
                </Box>

                  <ToggleButtonGroup
                  exclusive
                  value={viewMode}
                  onChange={(_, val) => val && setViewMode(val)}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      color: colors.controlText,
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.12)',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(168, 85, 247, 0.3)',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: 'rgba(168, 85, 247, 0.4)',
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                  }}
                >
                  <ToggleButton value="grid" aria-label="grid view">
                    <ViewModuleIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="list" aria-label="list view">
                    <ViewListIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="compact" aria-label="compact view">
                    <ViewQuiltIcon fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Paper>
            </Stack>
          </Box>

          {/* Error Display */}
          {error && (
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 4,
                backgroundColor: 'error.light',
                color: 'error.contrastText',
                textAlign: 'center',
                borderRadius: 3,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ⚠️ Error Loading Movies
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {error}
              </Typography>
            </Paper>
          )}

          {/* Loading State */}
          {movies.length === 0 && !error && (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 8,
              minHeight: 300
            }}>
              <CircularProgress
                size={80}
                thickness={4}
                sx={{
                  mb: 3,
                  color: colors.sliderColor
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  color: colors.controlText,
                  fontWeight: 'medium'
                }}
              >
                {searchQuery ? 'Searching for movies...' : 'Loading trending movies...'}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: colors.subtitle,
                  mt: 1
                }}
              >
                Please wait while we fetch the latest content
              </Typography>
            </Box>
          )}

          {/* Movies Display */}
          {movies.length > 0 && (
            <InfiniteScroll
              dataLength={movies.length}
              next={fetchMore}
              hasMore={hasMore}
              scrollThreshold={0.95}
                loader={
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 6
                }}>
                  <CircularProgress size={50} sx={{ mb: 2, color: colors.sliderColor }} />
                  <Typography variant="body1" sx={{ color: colors.subtitle }}>
                    Loading more movies...
                  </Typography>
                </Box>
              }
                endMessage={
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    mt: 4,
                    textAlign: 'center',
                    background: colors.paperBg,
                    backdropFilter: colors.backdrop,
                    border: colors.paperBorder,
                    borderRadius: 3,
                    maxWidth: 500,
                    mx: 'auto'
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', color: isDark ? '#fff' : '#111827' }}>
                    🎉 You've reached the end!
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.subtitle }}>
                    No more movies to load at the moment. Check back later for new content!
                  </Typography>
                </Paper>
              }
            >
              <Fade in={true} timeout={800}>
                {viewMode === 'grid' ? (
                  <Grid
                    container
                    spacing={4}
                    sx={{
                      justifyContent: 'center',
                      alignItems: 'stretch',
                    }}
                  >
                    {processedMovies.map((movie, index) => (
                      <Grid
                        key={movie.id}
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={2.4}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mb: 2
                        }}
                      >
                        <Fade in={true} timeout={500 + index * 100}>
                          <Box sx={{
                            width: '100%',
                            maxWidth: 300,
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-8px)'
                            }
                          }}>
                            <MovieCard movie={movie} />
                          </Box>
                        </Fade>
                      </Grid>
                    ))}
                  </Grid>
                ) : viewMode === 'list' ? (
                  <List sx={{ 
                    width: '100%', 
                    bgcolor: 'rgba(255, 255, 255, 0.03)', 
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    {processedMovies.map((movie, index) => (
                      <Fade key={movie.id} in={true} timeout={500 + index * 100}>
                        <Box>
                          <MovieListItem movie={movie} />
                        </Box>
                      </Fade>
                    ))}
                  </List>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gap: 3,
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    }}
                  >
                    {processedMovies.map((movie, index) => (
                      <Fade key={movie.id} in={true} timeout={500 + index * 80}>
                        <Paper
                          elevation={3}
                          sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: 3,
                            minHeight: 260,
                            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%), url(${getPosterUrl(movie.poster_path)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-6px)',
                              boxShadow: 6,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 999,
                              bgcolor: 'rgba(255,255,255,0.85)',
                              color: 'text.primary',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                            }}
                          >
                            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                          </Box>
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              width: '100%',
                              p: 2,
                              color: 'white',
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.3 }}>
                              {movie.title}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown Year'}
                            </Typography>
                          </Box>
                        </Paper>
                      </Fade>
                    ))}
                  </Box>
                )}
              </Fade>
            </InfiniteScroll>
          )}
        </Box>
      </Container>
    </Box>
    </>
  );
};

export default Home;