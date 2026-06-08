import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <h2>About Binge Hub 🍿</h2>
        <p>Your ultimate center for discovering, tracking, and discussing movies and TV shows.</p>
      </div>
      
      <div className="about-content">
        <section className="about-section">
          <h3>What is Binge Hub?</h3>
          <p>
            Binge Hub is a modern web application built for cinema lovers and binge-watchers. 
            Powered by the live TMDB API, our database updates in real-time to bring you over 
            100,000+ movies and TV series, complete with authentic posters, trailers, and ratings.
          </p>
        </section>

        <section className="about-section">
          <h3>Key Features ✨</h3>
          <ul className="features-list">
            <li><strong>Live Database:</strong> Real-time access to trending and top-rated content globally.</li>
            <li><strong>Personal Watchlist:</strong> Securely save movies and TV shows to your profile to watch later.</li>
            <li><strong>Community Comments:</strong> Read and write reviews! Share your thoughts with the community instantly.</li>
            <li><strong>Dynamic Theming:</strong> Seamlessly toggle between Light and Dark mode for late-night browsing.</li>
            <li><strong>Infinite Scrolling:</strong> Discover endless content without ever needing to click "Next Page".</li>
          </ul>
        </section>

        <section className="about-section">
          <h3>Join the Community</h3>
          <p>
            Ready to dive in? Create an account today, start building your watchlist, 
            and let the community know your thoughts on the latest blockbusters!
          </p>
          <Link to="/signup" className="primary-btn" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Create an Account
          </Link>
        </section>
      </div>
    </div>
  );
}
