import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
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
  List,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Skeleton,
  IconButton,
} from "@mui/material";

import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";

import MovieCard from "../components/MovieCard";
import MovieListItem from "../components/MovieListItem";
import { MovieContext } from "../context/MovieContext";
import F1Bg from "../assets/F1.jpg";

const Home = ({ darkMode = true }) => {
  const {
    movies,
    setPage,
    hasMore,
    loading,
    error,
    searchQuery,
  } = useContext(MovieContext);

  /* ------------------ UI STATE ------------------ */
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("popularity");
  const [minRating, setMinRating] = useState(0);
  const [language, setLanguage] = useState("all");
  const [showTopBtn, setShowTopBtn] = useState(false);

  /* ------------------ RESTORE FILTERS ------------------ */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("movieFilters"));
    if (saved) {
      setViewMode(saved.viewMode);
      setSortOption(saved.sortOption);
      setMinRating(saved.minRating);
      setLanguage(saved.language);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "movieFilters",
      JSON.stringify({ viewMode, sortOption, minRating, language })
    );
  }, [viewMode, sortOption, minRating, language]);

  /* ------------------ SCROLL TO TOP ------------------ */
  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ------------------ DATA PROCESSING ------------------ */
  const processedMovies = useMemo(() => {
    const filtered = movies.filter((m) => {
      const ratingOk = (m.vote_average || 0) >= minRating;
      const langOk =
        language === "all" || m.original_language === language;
      return ratingOk && langOk;
    });

    return filtered.sort((a, b) => {
      if (sortOption === "rating")
        return (b.vote_average || 0) - (a.vote_average || 0);
      if (sortOption === "release")
        return new Date(b.release_date || 0) -
          new Date(a.release_date || 0);
      return (b.popularity || 0) - (a.popularity || 0);
    });
  }, [movies, sortOption, minRating, language]);

  const languages = useMemo(() => {
    return [
      "all",
      ...new Set(movies.map((m) => m.original_language)),
    ].slice(0, 8);
  }, [movies]);

  const featuredMovie = processedMovies[0];

  const fetchMore = () => setPage((p) => p + 1);

  const poster = (path) =>
    path
      ? `https://image.tmdb.org/t/p/w500${path}`
      : "https://via.placeholder.com/500x750";

  /* ===================================================== */

  return (
    <Box sx={{ minHeight: "100vh", pt: 12, pb: 4, position: 'relative' }}>
     {/* Background Image */}
<Box
  sx={{
    position: "fixed",
    inset: 0,
    backgroundImage: `url(${F1Bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    // filter: "brightness(0.7) contrast(1.1)",
    zIndex: 0,
  }}
/>

{/* Dark Overlay */}
<Box
  sx={{
    position: "fixed",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(2,6,23,0.3), rgba(2,6,23,0.85))",
    zIndex: 1,
  }}
/>

      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
      
        {/* ================= FEATURED ================= */}
        {featuredMovie && (
          <Paper
            sx={{
              mb: 6,
              height: { xs: 500, md: 470 },
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
              backgroundImage: `
                linear-gradient(to right, rgba(2,6,23,.9), rgba(2,6,23,.3)),
                url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})
              `,
              backgroundSize: "cover",
            }}
          >
            <Box p={{ xs: 3, md: 6 }} maxWidth={520}>
              <Chip label="FEATURED" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h3" fontWeight="bold">
                {featuredMovie.title}
              </Typography>
              <Typography mt={2} sx={{ opacity: 0.85 }}>
                {featuredMovie.overview?.slice(0, 160)}...
              </Typography>
            </Box>
          </Paper>
        )}

        {/* ================= FILTER BAR ================= */}
    <Paper
  elevation={0}
  sx={{
    p: { xs: 0, md: 0.5 },
    mb: 4,
    position: "sticky",
    top: 80,
    zIndex: 5,
    borderRadius: 5,
    backdropFilter: "blur(10px)",
    background:
      "linear-gradient(100deg, rgba(15,23,42,0.9), rgba(30,41,59,0.85))",
    border: "1px solid rgba(148,163,184,0.15)",
  }}
>
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={2}
    alignItems="center"
    justifyContent="center"
    flexWrap="wrap"
  >
    {/* Sort */}
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel>Sort By</InputLabel>
      <Select
        value={sortOption}
        label="Sort By"
        onChange={(e) => setSortOption(e.target.value)}
        sx={{ borderRadius: 2 }}
      >
        <MenuItem value="popularity">Popularity</MenuItem>
        <MenuItem value="rating">⭐ Rating</MenuItem>
        <MenuItem value="release">📅 Release</MenuItem>
      </Select>
    </FormControl>

    {/* Language */}
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Language</InputLabel>
      <Select
        value={language}
        label="Language"
        onChange={(e) => setLanguage(e.target.value)}
        sx={{ borderRadius: 2 }}
      >
        {languages.map((l) => (
          <MenuItem key={l} value={l}>
            {l === "all" ? "All" : l.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Rating Slider */}
    <Box width={200}>
      <Typography
        variant="caption"
        sx={{ opacity: 0.8, fontWeight: 500 }}
      >
        Min Rating: {minRating} 
      </Typography>
      <Slider
        value={minRating}
        min={0}
        max={10}
        step={1}
        onChange={(_, v) => setMinRating(v)}
        sx={{
          mt: 0.5,
          "& .MuiSlider-thumb": {
            width: 14,
            height: 14,
          },
        }}
      />
    </Box>

    {/* View Mode */}
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={(_, v) => v && setViewMode(v)}
      sx={{
        background: "rgba(150, 156, 173, 0.1)",
        borderRadius: 3,
        p: 0.5,
        "& .MuiToggleButton-root": {
          border: "none",
          borderRadius: 2,
          px: 1.5,
        },
        "& .Mui-selected": {
          background: "rgba(99,102,241,0.35) !important",
        },
      }}
    >
      <ToggleButton value="grid">
        <ViewModuleIcon />
      </ToggleButton>
      <ToggleButton value="list">
        <ViewListIcon />
      </ToggleButton>
      <ToggleButton value="compact">
        <ViewQuiltIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  </Stack>
</Paper>


        {/* ================= CONTENT ================= */}
        {error && (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        )}

        {loading && movies.length === 0 && (
          <Grid container spacing={3}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton
                  variant="rectangular"
                  height={420}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {movies.length > 0 && (
          <InfiniteScroll
            dataLength={movies.length}
            next={fetchMore}
            hasMore={hasMore}
          >
            <motion.div layout>
              {viewMode === "grid" && (
                <Grid container spacing={4}>
                  {processedMovies.map((m) => (
                    <Grid item xs={12} sm={6} md={4} key={m.id}>
                      <MovieCard movie={m} />
                    </Grid>
                  ))}
                </Grid>
              )}

              {viewMode === "list" && (
                <List>
                  {processedMovies.map((m) => (
                    <MovieListItem key={m.id} movie={m} />
                  ))}
                </List>
              )}

              {viewMode === "compact" && (
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(auto-fit,minmax(220px,1fr))"
                  gap={3}
                >
                  {processedMovies.map((m) => (
                    <Paper
                      key={m.id}
                      sx={{
                        height: 260,
                        backgroundImage: `
                          linear-gradient(180deg,transparent,rgba(0,0,0,.8)),
                          url(${poster(m.poster_path)})
                        `,
                        backgroundSize: "cover",
                        borderRadius: 3,
                      }}
                    />
                  ))}
                </Box>
              )}
            </motion.div>
          </InfiniteScroll>
        )}
      </Container>

      {/* ================= SCROLL TOP ================= */}
      {showTopBtn && (
        <IconButton
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            bgcolor: "primary.main",
            color: "#fff",
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default Home;
