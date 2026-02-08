import React, { useContext, useMemo } from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite"; 
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom"; 
import { MovieContext } from "../context/MovieContext"; 

const MovieCard = ({ movie }) => {
  const { favorites, toggleFavorite } = useContext(MovieContext); // Access favorites and toggleFavorite function from context
  const navigate = useNavigate(); // Initialize navigation hook

  // Check if the current movie is already in favorites
  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  const posterUrl = useMemo(() => {
    if (movie?.poster_path) return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    return "https://via.placeholder.com/500x750?text=No+Image";
  }, [movie?.poster_path]);

  const ratingText = useMemo(() => {
    const v = movie?.vote_average;
    return typeof v === "number" ? v.toFixed(1) : "N/A";
  }, [movie?.vote_average]);

  const yearText = useMemo(() => {
    const d = movie?.release_date;
    if (!d) return "—";
    const y = new Date(d).getFullYear();
    return Number.isFinite(y) ? String(y) : "—";
  }, [movie?.release_date]);

  return (
    <Card
      sx={{
        height: "100%", // Make card fill vertical space
        display: "flex", // Use flex layout
        flexDirection: "column", // Stack children vertically
        justifyContent: "space-between", // Evenly space elements
        cursor: "pointer", // Cursor changes to pointer on hover
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.12)",
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.55) 0%, rgba(15, 23, 42, 0.25) 100%)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 10px 30px rgba(2, 6, 23, 0.35)",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 50px rgba(2, 6, 23, 0.50)",
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/movie/${movie.id}`)}
        sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", height: "100%" }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="320"
            image={posterUrl}
            alt={movie?.title || "Movie poster"}
            sx={{
              objectFit: "cover",
              transform: "scale(1.01)",
              transition: "transform 220ms ease",
              ".MuiCard-root:hover &": {
                transform: "scale(1.06)",
              },
            }}
          />

          {/* Readability gradient */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(2, 6, 23, 0.05) 0%, rgba(2, 6, 23, 0.20) 55%, rgba(2, 6, 23, 0.90) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Rating pill */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              px: 1.25,
              py: 0.5,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.88)",
              color: "rgba(2,6,23,0.92)",
              fontWeight: 800,
              fontSize: "0.9rem",
              lineHeight: 1,
              boxShadow: "0 8px 24px rgba(2,6,23,0.25)",
            }}
          >
            ⭐ {ratingText}
          </Box>

          {/* Favorite button */}
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(movie);
            }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(2,6,23,0.55)",
              color: isFavorite ? "#fb7185" : "rgba(255,255,255,0.92)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                backgroundColor: "rgba(2,6,23,0.70)",
              },
            }}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 2.25 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "rgba(255,255,255,0.92)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              mb: 0.5,
            }}
            title={movie?.title || ""}
          >
            {movie?.title || "Untitled"}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "rgba(226, 232, 240, 0.86)",
            }}
          >
            {yearText}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard; 