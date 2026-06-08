import { useState, useEffect } from 'react';
import './index.css';

const API_KEY = '993f908fce73bd5b49717e2a319721db';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

function App() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailedItem, setDetailedItem] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

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

  const fetchDetails = async (item) => {
    setLoadingDetail(true);
    const type = item.media_type === 'tv' || item.name ? 'tv' : 'movie';
    try {
      // Fetch full details, credits, videos, and recommendations in ONE call
      const res = await fetch(`${BASE_URL}/${type}/${item.id}?api_key=${API_KEY}&append_to_response=credits,videos,recommendations`);
      const data = await res.json();
      setDetailedItem(data);
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setDetailedItem(null); // Clear previous details
    fetchDetails(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedItem(null);
    setDetailedItem(null);
  };

  const getTitle = (item) => item?.title || item?.name;
  const getYear = (item) => {
    const date = item?.release_date || item?.first_air_date;
    return date ? date.split('-')[0] : 'N/A';
  };
  const getType = (item) => (item?.media_type === 'tv' || item?.name) ? 'TV Series' : 'Movie';
  const getPoster = (item) => item?.poster_path ? `${IMG_PATH}${item.poster_path}` : 'https://placehold.co/500x750/FAF8F5/4A3F35?text=No+Poster';

  // Detail Parsers
  const getTrailer = () => {
    if (!detailedItem?.videos?.results) return null;
    const trailer = detailedItem.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    return trailer ? trailer.key : null;
  };

  const getDirector = () => {
    if (!detailedItem?.credits?.crew) return null;
    const director = detailedItem.credits.crew.find(c => c.job === 'Director' || c.job === 'Executive Producer');
    return director ? director.name : null;
  };

  const getCast = () => {
    if (!detailedItem?.credits?.cast) return [];
    return detailedItem.credits.cast.slice(0, 5); // top 5 actors
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Binge Hub</h1>
        <p>Discover your next favorite movie or TV show</p>
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
                
                {/* Render Genres if detailedItem is loaded */}
                {detailedItem?.genres && detailedItem.genres.map(g => (
                  <span key={g.id} className="tag">{g.name}</span>
                ))}
              </div>
              
              <h2>{getTitle(selectedItem)}</h2>
              
              {loadingDetail ? (
                <div className="detail-loading">Fetching deep details...</div>
              ) : (
                <>
                  <p className="description">{detailedItem?.overview || selectedItem.overview || "No description available."}</p>
                  
                  <div className="credits-section">
                    {getDirector() && (
                      <p><strong>Director / Creator:</strong> {getDirector()}</p>
                    )}
                    {getCast().length > 0 && (
                      <p><strong>Cast:</strong> {getCast().map(c => c.name).join(', ')}</p>
                    )}
                  </div>

                  {getTrailer() && (
                    <div className="trailer-container">
                      <iframe 
                        src={`https://www.youtube.com/embed/${getTrailer()}`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                      </iframe>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {!loadingDetail && detailedItem?.recommendations?.results?.length > 0 && (
            <div className="recommendations-section">
              <h3>You might also like</h3>
              <div className="grid">
                {detailedItem.recommendations.results.slice(0, 4).map(item => (
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
