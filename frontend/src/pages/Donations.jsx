import { useEffect, useMemo, useState } from "react";
import DonationCard from "../components/DonationCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { getApiError, getDonations } from "../services/api";
import { CATEGORIES } from "../utils/helpers";

const initialFilters = { search: "", category: "All", location: "All", status: "AVAILABLE" };

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDonations = () => {
    setLoading(true); setError("");
    getDonations().then(({ data }) => setDonations(data.data)).catch((err) => setError(getApiError(err, "Failed to load donations."))).finally(() => setLoading(false));
  };

  useEffect(loadDonations, []);

  const results = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return donations.filter((item) => {
      const matchesSearch = !term || [item.foodName, item.providerName, item.location].some((value) => value.toLowerCase().includes(term));
      return matchesSearch && (filters.category === "All" || item.category === filters.category) && (filters.location === "All" || item.location === filters.location) && (filters.status === "All" || item.status === filters.status);
    });
  }, [donations, filters]);

  const setFilter = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <div className="page">
      <section className="page-header green-header"><div className="container"><span className="eyebrow light">For customers & recipients</span><h1>Find Available Food</h1><p>Search and reserve surplus food shared by local food providers.</p></div></section>
      <div className="container listing-layout">
        <section className="filter-panel" aria-label="Donation filters">
          <div className="search-field"><span aria-hidden="true">⌕</span><input aria-label="Search donations" name="search" value={filters.search} onChange={setFilter} placeholder="Search food, provider or location..." /></div>
          <div className="filter-field"><label htmlFor="category">Category</label><select id="category" name="category" value={filters.category} onChange={setFilter}><option>All</option>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="filter-field">
  <label htmlFor="location">Location</label>
  <input id="location" name="location" type="text" value={filters.location === "All" ? "" : filters.location} onChange={setFilter} placeholder="Enter location..." />
</div>
          <div className="filter-field"><label htmlFor="status">Status</label><select id="status" name="status" value={filters.status} onChange={setFilter}><option value="AVAILABLE">Available</option><option value="RESERVED">Reserved</option><option value="COLLECTED">Collected</option><option>All</option></select></div>
          <button className="clear-button" type="button" onClick={() => setFilters(initialFilters)}>Clear Filters</button>
        </section>

        {loading ? <LoadingSpinner label="Loading donations..." /> : error ? <div className="error-state"><h2>We couldn’t load the listings</h2><p>{error}</p><button className="button button-primary" onClick={loadDonations}>Try Again</button></div> : (
          <section aria-live="polite">
            <div className="results-bar"><div><h2>{results.length} {results.length === 1 ? "donation" : "donations"} found</h2><p>Updated from current SavePlate LK listings</p></div><span className="live-indicator"><i /> Live listings</span></div>
            {results.length ? <div className="donation-grid">{results.map((donation) => <DonationCard key={donation._id} donation={donation} />)}</div> : <EmptyState icon="⌕" title="No matching food donations found." text="Try changing or clearing your search filters." />}
          </section>
        )}
      </div>
    </div>
  );
}
