import { useState, useEffect } from 'react';
import './index.css';

const API_KEY = '993f908fce73bd5b49717e2a319721db';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

function App() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch trending movies and TV shows on load
  useEffect(() => {
    fetchTrending();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchTrending();
    } else {
      const delayDebounceFn = setTimeout(() => {
        searchItems(searchTerm);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm]);

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`);
      const data = await res.json();
      // Filter out people, keep only movies and tv shows
      setItems(data.results.filter(item => item.media_type !== 'person'));
    } catch (error) {
      console.error('Error fetching trending:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchItems = async (query) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
      const data = await res.json();
      setItems(data.results.filter(item => item.media_type !== 'person'));
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (id, mediaType) => {
    // mediaType should be 'movie' or 'tv'
    const type = mediaType === 'tv' ? 'tv' : 'movie';
    try {
      const res = await fetch(`${BASE_URL}/${type}/${id}/recommendations?api_key=${API_KEY}`);
      const data = await res.json();
      if (data && data.results) {
        setRecommendations(data.results.slice(0, 4));
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    }
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    fetchRecommendations(item.id, item.media_type || (item.title ? 'movie' : 'tv'));
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedItem(null);
    setRecommendations([]);
  };

  const getTitle = (item) => item.title || item.name;
  const getYear = (item) => {
    const date = item.release_date || item.first_air_date;
    return date ? date.split('-')[0] : 'N/A';
  };
  const getType = (item) => (item.media_type === 'tv' || item.name) ? 'TV Series' : 'Movie';
  const getPoster = (item) => item.poster_path ? `${IMG_PATH}${item.poster_path}` : 'https://placehold.co/500x750/FAF8F5/4A3F35?text=No+Poster';

  return (
    <div className="container">
      <header className="header">
        <h1>Binge Hub</h1>
        <p>Discover your next favorite movie or TV show from our live database</p>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search thousands of titles..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {selectedItem ? (
        <div className="detail-view">
          <button className="back-btn" onClick={handleBack}>
            ← Back to Library
          </button>
          
          <div className="detail-card">
            <img src={getPoster(selectedItem)} alt={getTitle(selectedItem)} className="detail-poster" />
            <div className="detail-info">
              <div className="tags-container">
                <span className="tag type-tag">{getType(selectedItem)}</span>
                <span className="rating-tag">⭐ {selectedItem.vote_average ? selectedItem.vote_average.toFixed(1) : 'NR'}</span>
                <span className="year-tag">{getYear(selectedItem)}</span>
              </div>
              <h2>{getTitle(selectedItem)}</h2>
              <p className="description">{selectedItem.overview || "No description available for this title."}</p>
            </div>
          </div>

          {recommendations.length > 0 && (
            <div className="recommendations-section">
              <h3>You might also like</h3>
              <div className="grid">
                {recommendations.map(item => (
                  <div key={item.id} className="card" onClick={() => handleSelect(item)}>
                    <div className="poster-wrapper">
                      <img src={getPoster(item)} alt={getTitle(item)} />
                      <span className="type-badge">{getType(item)}</span>
                    </div>
                    <div className="card-content">
                      <h4>{getTitle(item)}</h4>
                      <div className="card-footer">
                        <span className="card-rating">⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'NR'}</span>
                        <span className="card-genres">{getYear(item)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {loading ? (
            <div className="loading-state">Loading amazing content...</div>
          ) : (
            <div className="grid">
              {items.map(item => (
                <div key={item.id} className="card" onClick={() => handleSelect(item)}>
                  <div className="poster-wrapper">
                    <img src={getPoster(item)} alt={getTitle(item)} />
                    <span className="type-badge">{getType(item)}</span>
                  </div>
                  <div className="card-content">
                    <h4>{getTitle(item)}</h4>
                    <div className="card-footer">
                      <span className="card-genres">{getYear(item)}</span>
                      <span className="card-rating">⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'NR'}</span>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="no-results">No movies or shows found matching "{searchTerm}"</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
