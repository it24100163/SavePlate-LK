import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          <Link className="footer-brand" to="/">SavePlate LK</Link>
          <p>Share Surplus. Reduce Waste.</p>
        </div>
        <p>© {new Date().getFullYear()} SavePlate LK · University Mini Hackathon MVP</p>
      </div>
    </footer>
  );
}
