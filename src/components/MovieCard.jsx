import { Link } from 'react-router-dom';

export default function MovieCard({ item }) {
  const getTitle = (i) => i?.title || i?.name;
  const getYear = (i) => {
    const date = i?.release_date || i?.first_air_date;
    return date ? date.split('-')[0] : 'N/A';
  };
  const getType = (i) => (i?.media_type === 'tv' || i?.name) ? 'TV Series' : 'Movie';
  const getPoster = (i) => i?.poster_path ? `https://image.tmdb.org/t/p/w500${i.poster_path}` : 'https://placehold.co/500x750/FAF8F5/4A3F35?text=No+Poster';

  return (
    <Link to={`/details/${getType(item) === 'TV Series' ? 'tv' : 'movie'}/${item.id}`} className="card" style={{textDecoration: 'none'}}>
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
    </Link>
  );
}
