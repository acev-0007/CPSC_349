import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = '60ea12e3482b49ae06c76b4485df019d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      {movie.poster_path ? (
        <img
          className="movie-poster"
          src={`${IMG_BASE}${movie.poster_path}`}
          alt={movie.title}
        />
      ) : (
        <div className="movie-poster no-poster">{movie.title}</div>
      )}
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p>Release Date: {movie.release_date}</p>
        <p>Rating: {movie.vote_average}</p>
      </div>
    </div>
  );
}

function App() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      let url;
      if (searchQuery) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${currentPage}`;
      } else {
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${currentPage}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      let results = data.results || [];

      if (sortBy === 'release_asc') {
        results.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
      } else if (sortBy === 'release_desc') {
        results.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      } else if (sortBy === 'rating_asc') {
        results.sort((a, b) => a.vote_average - b.vote_average);
      } else if (sortBy === 'rating_desc') {
        results.sort((a, b) => b.vote_average - a.vote_average);
      }

      setMovies(results);
      setTotalPages(data.total_pages || 0);
    };

    fetchMovies();
  }, [currentPage, searchQuery, sortBy]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Movie Explorer</h1>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <select value={sortBy} onChange={handleSort}>
          <option value="">Sort By</option>
          <option value="release_asc">Release Date (Asc)</option>
          <option value="release_desc">Release Date (Desc)</option>
          <option value="rating_asc">Rating (Asc)</option>
          <option value="rating_desc">Rating (Desc)</option>
        </select>
      </div>

      <div className="movie-grid">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;