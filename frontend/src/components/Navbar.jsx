import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar-wrap">
      <nav className="navbar container" aria-label="Main navigation">
        <Link className="brand" to="/" onClick={closeMenu} aria-label="SavePlate LK home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>SavePlate <strong>LK</strong></span>
        </Link>
        <button
          className="menu-button"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="main-menu"
          aria-label="Toggle navigation"
        >
          <span /> <span /> <span />
        </button>
        <div className={`nav-links ${open ? "open" : ""}`} id="main-menu">
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
          <NavLink to="/donations" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>Find Food</NavLink>
          <NavLink to="/manage" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>Manage Donations</NavLink>
          <NavLink to="/donate" onClick={closeMenu} className={`nav-cta ${location.pathname === "/donate" ? "active" : ""}`}>Donate Food</NavLink>
        </div>
      </nav>
    </header>
  );
}
