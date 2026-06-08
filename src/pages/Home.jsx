import { useState, useEffect, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';

const API_KEY = '993f908fce73bd5b49717e2a319721db';
const BASE_URL = 'https://api.themoviedb.org/3';

export default function Home() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('trending'); // 'trending', 'movie', 'tv'

  const fetchContent = useCallback(async (pageNum, cat) => {
    setLoading(true);
    let url = '';
    
    if (searchTerm.trim() !== '') {
      url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${searchTerm}&page=${pageNum}`;
    } else {
      if (cat === 'trending') url = `${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${pageNum}`;
      else if (cat === 'movie') url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${pageNum}`;
      else if (cat === 'tv') url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&page=${pageNum}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      const filtered = data.results.filter(item => item.media_type !== 'person');
      
      if (pageNum === 1) {
        setItems(filtered);
      } else {
        setItems(prev => [...prev, ...filtered]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Load initial data or search
  useEffect(() => {
    setPage(1);
    const delayDebounceFn = setTimeout(() => {
      fetchContent(1, category);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, category, fetchContent]);

  // Infinite Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
        if (!loading) {
          setPage(prev => {
            const next = prev + 1;
            fetchContent(next, category);
            return next;
          });
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, category, fetchContent]);

  return (
    <>
      <header className="header">
        <p>Discover your next favorite movie or TV show</p>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search thousands of titles..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {searchTerm.trim() === '' && (
          <div className="category-filters">
            <button className={`filter-btn ${category === 'trending' ? 'active' : ''}`} onClick={() => setCategory('trending')}>Trending</button>
            <button className={`filter-btn ${category === 'movie' ? 'active' : ''}`} onClick={() => setCategory('movie')}>Movies</button>
            <button className={`filter-btn ${category === 'tv' ? 'active' : ''}`} onClick={() => setCategory('tv')}>TV Shows</button>
          </div>
        )}
      </header>

      <div className="grid">
        {items.map((item, index) => (
          <MovieCard key={`${item.id}-${index}`} item={item} />
        ))}
        {loading && Array.from({ length: 10 }).map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
      {items.length === 0 && !loading && (
        <div className="no-results">No movies or shows found.</div>
      )}
    </>
  );
}
