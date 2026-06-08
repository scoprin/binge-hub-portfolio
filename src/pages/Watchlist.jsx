import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import MovieCard from '../components/MovieCard';
import { Navigate } from 'react-router-dom';

export default function Watchlist() {
  const { currentUser } = useAuth();
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchWatchlist();
    }
  }, [currentUser]);

  const fetchWatchlist = async () => {
    try {
      const q = query(collection(db, 'users', currentUser.uid, 'watchlist'), orderBy('savedAt', 'desc'));
      const snapshot = await getDocs(q);
      setSavedItems(snapshot.docs.map(doc => doc.data()));
    } catch (error) {
      console.error("Error fetching watchlist", error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div className="watchlist-page">
      <h2 style={{fontSize: '2.5rem', marginBottom: '2rem'}}>My Watchlist ❤️</h2>
      {loading ? (
        <div className="loading-state">Loading your favorites...</div>
      ) : (
        <>
          <div className="grid">
            {savedItems.map(item => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
          {savedItems.length === 0 && (
            <div className="no-results">Your watchlist is empty. Go save some movies!</div>
          )}
        </>
      )}
    </div>
  );
}
