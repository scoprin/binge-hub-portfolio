import { useState } from 'react';
import data from './data.json';
import './index.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.genres.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRecommendations = (currentItem) => {
    return data
      .filter(item => item.id !== currentItem.id)
      .map(item => {
        const commonGenres = item.genres.filter(g => currentItem.genres.includes(g));
        return { ...item, score: commonGenres.length };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4); // top 4 recommendations
  };

  const recommendations = selectedItem ? getRecommendations(selectedItem) : [];

  return (
    <div className="container">
      <header className="header">
        <h1>Binge Hub</h1>
        <p>Discover your next favorite movie or TV show</p>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by title or genre (e.g., Sci-Fi, Drama)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {selectedItem ? (
        <div className="detail-view">
          <button className="back-btn" onClick={() => setSelectedItem(null)}>
            ← Back to Library
          </button>
          
          <div className="detail-card">
            <img src={selectedItem.poster} alt={selectedItem.title} className="detail-poster" />
            <div className="detail-info">
              <div className="tags-container">
                <span className="tag type-tag">{selectedItem.type}</span>
                <span className="rating-tag">⭐ {selectedItem.rating}</span>
                <span className="year-tag">{selectedItem.year}</span>
              </div>
              <h2>{selectedItem.title}</h2>
              <div className="genres">
                {selectedItem.genres.map(g => <span key={g} className="tag">{g}</span>)}
              </div>
              <p className="description">{selectedItem.description}</p>
            </div>
          </div>

          {recommendations.length > 0 && (
            <div className="recommendations-section">
              <h3>You might also like</h3>
              <div className="grid">
                {recommendations.map(item => (
                  <div key={item.id} className="card" onClick={() => setSelectedItem(item)}>
                    <div className="poster-wrapper">
                      <img src={item.poster} alt={item.title} />
                      <span className="type-badge">{item.type}</span>
                    </div>
                    <div className="card-content">
                      <h4>{item.title}</h4>
                      <p className="card-genres">{item.genres.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid">
          {filteredData.map(item => (
            <div key={item.id} className="card" onClick={() => setSelectedItem(item)}>
              <div className="poster-wrapper">
                <img src={item.poster} alt={item.title} />
                <span className="type-badge">{item.type}</span>
              </div>
              <div className="card-content">
                <h4>{item.title}</h4>
                <div className="card-footer">
                  <span className="card-genres">{item.genres.slice(0, 2).join(', ')}</span>
                  <span className="card-rating">⭐ {item.rating}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="no-results">No movies or shows found matching "{searchTerm}"</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
