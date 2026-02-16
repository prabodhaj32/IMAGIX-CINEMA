import React, { createContext, useEffect, useState } from "react";
import { fetchTrending, searchMovies } from "../utils/api"; // API functions to fetch trending or searched movies

// Create the MovieContext
export const MovieContext = createContext();

// Context Provider component to wrap around app components
export const MovieProvider = ({ children }) => {
  // State to store movie list
  const [movies, setMovies] = useState([]);

  // State for search query, initialized from localStorage
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("lastQuery") || "");

  // Current page for pagination
  const [page, setPage] = useState(1);

  // State to determine if more movies are available
  const [hasMore, setHasMore] = useState(true);

  // Loading state while fetching movies
  const [loading, setLoading] = useState(false);

  // Error state for API call failures
  const [error, setError] = useState(null);

  // Favorites list, initialized from localStorage
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  // Load movies whenever the search query or page changes
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true); // Start loading
      try {
        // Fetch movies based on search query or trending
        const res = searchQuery
          ? await searchMovies(searchQuery, page)
          : await fetchTrending(page);

        const newMovies = res.data.results;

        // Update movies state with unique results (prevent duplicates)
        setMovies((prev) => {
          const combined = page === 1 ? newMovies : [...prev, ...newMovies];
          const unique = Array.from(new Map(combined.map((m) => [m.id, m])).values());
          return unique;
        });

        // If no results are returned, stop pagination
        setHasMore(newMovies.length > 0);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError("Failed to load movies. Please try again."); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    loadMovies();
  }, [searchQuery, page]); // Re-run effect when query or page changes

  // Persist search query to localStorage
  useEffect(() => {
    localStorage.setItem("lastQuery", searchQuery);
  }, [searchQuery]);

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Add or remove movie from favorites
  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      const newFavorites = exists
        ? prev.filter((m) => m.id !== movie.id) // Remove from favorites
        : [...prev, movie]; // Add to favorites
      
      // Dispatch events to notify other components
      window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
        detail: { 
          favorites: newFavorites,
          action: exists ? 'removed' : 'added',
          movie: movie
        } 
      }));
      
      return newFavorites;
    });
  };

  // Provide all state and actions to consuming components
  return (
    <MovieContext.Provider
      value={{
        movies,
        setMovies,
        searchQuery,
        setSearchQuery,
        page,
        setPage,
        hasMore,
        loading,
        error,
        favorites,
        toggleFavorite,
      }}
    >
      {children} {/* Render any child components inside the provider */}
    </MovieContext.Provider>
  );
};
