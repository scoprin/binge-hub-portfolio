export default function SkeletonCard() {
  return (
    <div className="card skeleton-card">
      <div className="poster-wrapper skeleton"></div>
      <div className="card-content">
        <div className="skeleton skeleton-text skeleton-title"></div>
        <div className="card-footer">
          <div className="skeleton skeleton-text skeleton-small"></div>
          <div className="skeleton skeleton-text skeleton-small"></div>
        </div>
      </div>
    </div>
  );
}
