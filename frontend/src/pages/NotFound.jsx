import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found container">
      <div className="not-found-code">404</div>
      <span aria-hidden="true">🍃</span>
      <h1>Page Not Found</h1>
      <p>The page you’re looking for may have moved or no longer exists.</p>
      <Link className="button button-primary" to="/">Return Home</Link>
    </div>
  );
}
