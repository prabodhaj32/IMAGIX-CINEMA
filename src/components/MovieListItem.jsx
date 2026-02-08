import React, { useContext } from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../context/MovieContext";

const MovieListItem = ({ movie }) => {
  const { favorites, toggleFavorite } = useContext(MovieContext);
  const navigate = useNavigate();

  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  return (
    <ListItem
      sx={{
        borderRadius: 3,
        mb: 1.2,
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.80) 60%, rgba(15, 23, 42, 0.94) 100%)",
        border: "1px solid rgba(148, 163, 184, 0.35)",
        boxShadow: "0 14px 35px rgba(15, 23, 42, 0.80)",
        "&:hover": {
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.90) 60%, rgba(15, 23, 42, 0.98) 100%)",
          boxShadow: "0 20px 55px rgba(15, 23, 42, 0.95)",
          transform: "translateY(-2px)",
        },
        cursor: "pointer",
        transition: "background 180ms ease, box-shadow 180ms ease, transform 180ms ease",
      }}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <ListItemAvatar>
        <Avatar
          variant="rounded"
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          sx={{ width: 80, height: 120 }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "rgba(241,245,249,0.98)",
            }}
          >
            {movie.title}
          </Typography>
        }
        secondary={
          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1, color: "rgba(148,163,184,0.96)" }}
            >
              {movie.overview.length > 150
                ? `${movie.overview.substring(0, 150)}...`
                : movie.overview}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={`⭐ ${movie.vote_average}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Typography
                variant="body2"
                sx={{ color: "rgba(148,163,184,0.96)" }}
              >
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </Typography>
            </Box>
          </Box>
        }
      />
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(movie);
        }}
        color="primary"
        sx={{ ml: 1 }}
      >
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </ListItem>
  );
};

export default MovieListItem;