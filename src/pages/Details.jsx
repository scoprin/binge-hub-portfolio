import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, deleteDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import MovieCard from '../components/MovieCard';

const API_KEY = '993f908fce73bd5b49717e2a319721db';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

export default function Details() {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [detailedItem, setDetailedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDetails();
    if (currentUser) {
      checkSavedStatus();
      subscribeToComments();
    }
  }, [id, mediaType, currentUser]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=credits,videos,recommendations`);
      const data = await res.json();
      setDetailedItem(data);
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSavedStatus = async () => {
    const docRef = doc(db, 'users', currentUser.uid, 'watchlist', id.toString());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setIsSaved(true);
    else setIsSaved(false);
  };

  const toggleSave = async () => {
    if (!currentUser) {
      alert("Please login to save to your watchlist!");
      navigate('/login');
      return;
    }
    const docRef = doc(db, 'users', currentUser.uid, 'watchlist', id.toString());
    if (isSaved) {
      await deleteDoc(docRef);
      setIsSaved(false);
    } else {
      await setDoc(docRef, {
        id: detailedItem.id,
        title: detailedItem.title || detailedItem.name,
        poster_path: detailedItem.poster_path,
        media_type: mediaType,
        vote_average: detailedItem.vote_average,
        release_date: detailedItem.release_date || detailedItem.first_air_date,
        savedAt: new Date()
      });
      setIsSaved(true);
    }
  };

  const subscribeToComments = () => {
    const q = query(collection(db, 'movies', id.toString(), 'comments'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addDoc(collection(db, 'movies', id.toString(), 'comments'), {
        text: newComment,
        userEmail: currentUser.email,
        createdAt: new Date()
      });
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  if (loading || !detailedItem) return <div className="loading-state">Fetching deep details...</div>;

  const getTitle = () => detailedItem.title || detailedItem.name;
  const getYear = () => {
    const date = detailedItem.release_date || detailedItem.first_air_date;
    return date ? date.split('-')[0] : 'N/A';
  };
  const getPoster = () => detailedItem.poster_path ? `${IMG_PATH}${detailedItem.poster_path}` : 'https://placehold.co/500x750/FAF8F5/4A3F35?text=No+Poster';
  
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
    return detailedItem.credits.cast.slice(0, 5);
  };

  return (
    <div className="detail-view">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      
      <div className="detail-card">
        <img src={getPoster()} alt={getTitle()} className="detail-poster" />
        
        <div className="detail-info">
          <div className="tags-container">
            <span className="tag type-tag">{mediaType === 'tv' ? 'TV Series' : 'Movie'}</span>
            <span className="rating-tag">⭐ {detailedItem.vote_average ? detailedItem.vote_average.toFixed(1) : 'NR'}</span>
            <span className="year-tag">{getYear()}</span>
            {detailedItem.genres && detailedItem.genres.map(g => (
              <span key={g.id} className="tag">{g.name}</span>
            ))}
          </div>
          
          <div className="title-row">
            <h2>{getTitle()}</h2>
            <button onClick={toggleSave} className={`watchlist-btn ${isSaved ? 'saved' : ''}`} title="Add to Watchlist">
              {isSaved ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
          
          <p className="description">{detailedItem.overview || "No description available."}</p>
          
          <div className="credits-section">
            {getDirector() && <p><strong>Director / Creator:</strong> {getDirector()}</p>}
            {getCast().length > 0 && <p><strong>Cast:</strong> {getCast().map(c => c.name).join(', ')}</p>}
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
        </div>
      </div>

      <div className="comments-section">
        <h3>Community Comments</h3>
        {currentUser ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What did you think of this?"
              required
            ></textarea>
            <button type="submit" className="primary-btn">Post Comment</button>
          </form>
        ) : (
          <p className="login-prompt">Please <a href="/login">login</a> to leave a comment.</p>
        )}
        
        <div className="comments-list">
          {comments.map(c => (
            <div key={c.id} className="comment">
              <strong>{c.userEmail.split('@')[0]}</strong>
              <p>{c.text}</p>
            </div>
          ))}
          {comments.length === 0 && <p>No comments yet. Be the first!</p>}
        </div>
      </div>

      {detailedItem?.recommendations?.results?.length > 0 && (
        <div className="recommendations-section">
          <h3>You might also like</h3>
          <div className="grid">
            {detailedItem.recommendations.results.slice(0, 4).map(item => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
