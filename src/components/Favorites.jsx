import React, { useContext } from "react";
import { Grid, Typography, Box, Container, Paper } from "@mui/material";
import MovieCard from "../components/MovieCard";
import { MovieContext } from "../context/MovieContext";

const Favorites = ({ darkMode }) => {
  // Accessing the 'favorites' array from context
  const { favorites } = useContext(MovieContext);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 12,
        px: 3,
        background: darkMode 
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            sx={{ 
              mb: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            ❤️ My Favorite Movies
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 500,
              mb: 4
            }}
          >
            Your personal collection of beloved movies
          </Typography>
        </Box>

        {favorites.length === 0 ? (
          <Paper
            elevation={8}
            sx={{
              p: 6,
              textAlign: 'center',
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              borderRadius: '24px',
              border: darkMode 
                ? '1px solid rgba(139, 92, 246, 0.3)'
                : '1px solid rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow: darkMode
                ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.2)'
                : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(139, 92, 246, 0.1)',
            }}
          >
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              sx={{ 
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              No Favorites Yet
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: darkMode ? '#a78bfa' : '#6b7280',
                fontSize: '1.1rem',
                maxWidth: 500,
                mx: 'auto'
              }}
            >
              Start adding your favorite movies to build your personal collection! 
              Browse movies and click the heart icon to add them here.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {favorites.map((movie) => (
              <Grid
                item
                key={movie.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                sx={{
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    '& .movie-card': {
                      boxShadow: darkMode
                        ? '0 25px 50px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.2)'
                        : '0 25px 50px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.1)',
                    }
                  }
                }}
              >
                <Box className="movie-card">
                  <MovieCard movie={movie} />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Favorites; 
