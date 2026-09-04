import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { getDonationStats } from "../services/api";

const fallbackStats = {
  totalDonations: "—",
  available: "—",
  reserved: "—",
  collected: "—",
  activeDonations: "—",
  totalItemsRescued: "—",
};

export default function Home() {
  const [stats, setStats] = useState(fallbackStats);
  const [statsError, setStatsError] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getDonationStats()
      .then(({ data }) => {
        if (!isMounted) return;
        if (!data?.data) throw new Error("Statistics response is unavailable.");
        setStats({ ...fallbackStats, ...data.data });
        setStatsError(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setStatsError(true);
      })
      .finally(() => {
        if (isMounted) setStatsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-kicker"><span>●</span> Community-powered food sharing</span>
            <h1>Good Food Shouldn’t <span>Go to Waste.</span></h1>
            <p>SavePlate LK helps food providers share surplus food with charities, organisations, volunteers and individuals who can put it to good use.</p>
            <div className="hero-actions">
              <Link className="button button-light button-large hero-primary" to="/donate">Donate Surplus Food <span aria-hidden="true">→</span></Link>
              <Link className="button button-outline-light button-large hero-secondary" to="/donations">Find Available Food</Link>
            </div>
            <div className="hero-trust"><span>✓ Simple listings</span><span>✓ Direct pickup</span><span>✓ Built for Sri Lanka</span></div>
          </div>
          <div className="hero-visual" aria-label="Illustration of surplus food being shared with the community">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="food-basket">
              <span className="basket-leaf">🌿</span>
              <div className="food-icons"><span>🥖</span><span>🥬</span><span>🍌</span><span>🍛</span></div>
              <div className="basket-body"><strong>Fresh surplus</strong><small>Ready to share</small></div>
            </div>
            <div className="floating-note note-top"><span>♻</span><div><strong>Less waste</strong><small>More community impact</small></div></div>
          </div>
        </div>
        <div className="hero-wave" />
      </section>

      <section className="section problem-section">
        <div className="container split-section">
          <div className="section-visual">
            <div className="visual-card"><span>🥡</span><strong>Surplus today</strong><small>Support tomorrow</small></div>
            <div className="visual-dot dot-one" /><div className="visual-dot dot-two" />
          </div>
          <div className="section-copy">
            <span className="eyebrow">A practical local solution</span>
            <h2>Turning Surplus Into Support</h2>
            <p>Restaurants, bakeries, cafes, hotels and food shops can sometimes have usable surplus food after daily operations. SavePlate LK gives food providers a simple way to publish these items so charities, organisations, volunteers and individuals can discover and reserve them before they go unused.</p>
            <div className="callout"><span aria-hidden="true">✦</span><p>One simple connection can help available food reach someone ready to collect it.</p></div>
          </div>
        </div>
      </section>

      <section className="section audience-section">
        <div className="container">
          <div className="section-heading centered"><span className="eyebrow">Built for two clear user groups</span><h2>Choose How You’ll Make an Impact</h2><p>Whether you have food to share or are looking to receive it, SavePlate LK keeps the next step simple.</p></div>
          <div className="audience-grid">
            <article className="audience-card provider-card">
              <span className="audience-icon">🏪</span><div><span className="mini-label">Supply side</span><h3>Food Providers</h3><p className="examples">Restaurants, bakeries, cafes, hotels and shops</p><p>Post surplus food and manage your donations through a clear, reliable workflow.</p><Link className="text-link" to="/donate">Donate Food <span>→</span></Link></div>
            </article>
            <article className="audience-card recipient-card">
              <span className="audience-icon">🤝</span><div><span className="mini-label">Receiving side</span><h3>Customers / Recipients</h3><p className="examples">Charities, organisations, volunteers and individuals</p><p>Search available food and reserve a donation for pickup.</p><Link className="text-link" to="/donations">Find Food <span>→</span></Link></div>
            </article>
          </div>
        </div>
      </section>

      <section className="section how-section">
        <div className="container">
          <div className="section-heading centered"><span className="eyebrow">Three easy steps</span><h2>How SavePlate LK Works</h2></div>
          <div className="steps-grid">
            <article className="step"><span className="step-number">01</span><span className="step-icon">↗</span><h3>Share</h3><p>Food providers post surplus food with pickup details.</p></article>
            <span className="step-arrow" aria-hidden="true">→</span>
            <article className="step"><span className="step-number">02</span><span className="step-icon">⌕</span><h3>Discover</h3><p>Customers search and find available donations nearby.</p></article>
            <span className="step-arrow" aria-hidden="true">→</span>
            <article className="step"><span className="step-number">03</span><span className="step-icon">✓</span><h3>Reserve & Collect</h3><p>Customers reserve food and providers mark it collected after pickup.</p></article>
          </div>
        </div>
      </section>

      <section className="section impact-section">
        <div className="container">
          <div className="impact-heading"><div><span className="eyebrow light">Live community impact</span><h2>Small Actions, Meaningful Results</h2></div><Link className="button button-outline-light" to="/donations">Browse donations</Link></div>
          {statsError && (
            <div className="stats-status">
              <p className="stats-error">Statistics are temporarily unavailable. Please refresh or try again shortly.</p>
            </div>
          )}
          <div className="stats-grid" aria-live="polite">
            {statsLoading ? (
              <>
                <div className="stat-card loading-card"><div className="stat-icon">…</div><div><strong>Loading</strong><span>Updating metrics</span></div></div>
                <div className="stat-card loading-card"><div className="stat-icon">…</div><div><strong>Loading</strong><span>Updating metrics</span></div></div>
                <div className="stat-card loading-card"><div className="stat-icon">…</div><div><strong>Loading</strong><span>Updating metrics</span></div></div>
                <div className="stat-card loading-card"><div className="stat-icon">…</div><div><strong>Loading</strong><span>Updating metrics</span></div></div>
              </>
            ) : (
              <>
                <StatCard icon="●" value={stats.available} label="Available Donations" accent="green" />
                <StatCard icon="◷" value={stats.reserved} label="Reserved Donations" accent="amber" />
                <StatCard icon="✓" value={stats.collected} label="Completed Rescues" accent="blue" />
                <StatCard icon="♥" value={stats.totalItemsRescued} label="Items Rescued" accent="pink" />
              </>
            )}
          </div>
          <p className="metric-note">Items Rescued is an MVP metric: the summed quantity of collected listings across their listed units.</p>
        </div>
      </section>

      <section className="section final-cta"><div className="container final-cta-inner"><div><h2>Have surplus food to share?</h2><p>Create a listing in a few simple steps and help it find a new destination.</p></div><Link className="button button-primary button-large" to="/donate">Publish a Donation <span>→</span></Link></div></section>
    </>
  );
}
