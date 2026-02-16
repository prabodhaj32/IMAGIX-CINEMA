import React, { useContext } from "react";
import { Grid, Typography, Box } from "@mui/material"; // Importing MUI components for layout and typography
import MovieCard from "../components/MovieCard"; // Custom component to display individual movie details
import { MovieContext } from "../context/MovieContext"; // Importing context to access favorite movies

const Favorites = ({ darkMode }) => {
  // Accessing the 'favorites' array from context
  const { favorites } = useContext(MovieContext);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 12,
        px: 3,
        background: darkMode ? "#0a192f" : "#1e3a5f",
      }}
    >
      {/* Title heading */}
      <Typography variant="h4" mb={3}>
        ❤️ Favorite Movies
      </Typography>

      {/* Conditional rendering: if no favorites, show a message */}
      {favorites.length === 0 ? (
        <Typography variant="body1">
          You have no favorite movies yet.
        </Typography>
      ) : (
        // If there are favorites, display them in a responsive grid
        <Grid container spacing={3}>
          {favorites.map((movie) => (
            <Grid
              item
              key={movie.id} // Unique key for each movie item
              xs={12}        // Full width on extra-small screens
              sm={6}         // Half width on small screens
              md={4}         // One-third width on medium screens
              lg={3}         // One-fourth width on large screens
            >
              <MovieCard movie={movie} /> {/* Display movie in a card */}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Favorites; 
