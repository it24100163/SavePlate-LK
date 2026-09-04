import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import { getApiError, getDonationById, updateDonationStatus } from "../services/api";
import { formatDate, getCategoryIcon, isExpired } from "../utils/helpers";

export default function DonationDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(location.state?.message || "");

  useEffect(() => {
    getDonationById(id).then(({ data }) => setDonation(data.data)).catch((err) => setError(getApiError(err, "Donation not found."))).finally(() => setLoading(false));
  }, [id]);

  const reserveDonation = async () => {
    setUpdating(true); setError("");
    try {
      const { data } = await updateDonationStatus(id, "RESERVED");
      setDonation(data.data); setMessage(data.message); setDialogOpen(false);
    } catch (err) { setError(getApiError(err)); setDialogOpen(false); }
    finally { setUpdating(false); }
  };

  if (loading) return <div className="container page-loading"><LoadingSpinner label="Loading donation details..." /></div>;
  if (!donation) return <div className="container standalone-state"><div className="error-state"><h1>Donation not found.</h1><p>{error}</p><Link className="button button-primary" to="/donations">Browse Donations</Link></div></div>;

  const expired = isExpired(donation);
  return (
    <div className="page details-page">
      <div className="container breadcrumb"><Link to="/donations">Find Food</Link><span>›</span><span>{donation.foodName}</span></div>
      <div className="container details-grid">
        <article className="details-card">
          <div className="details-hero">
            <span className="details-icon" aria-hidden="true">{getCategoryIcon(donation.category)}</span>
            <div><span className="eyebrow">{donation.category}</span><h1>{donation.foodName}</h1><p>Shared by <strong>{donation.providerName}</strong></p></div>
            <StatusBadge status={donation.status} expired={expired} />
          </div>
          {message && <div className="message success-message" role="status">✓ {message}</div>}
          {error && <div className="message error-message" role="alert">{error}</div>}
          <section className="details-section"><h2>About this donation</h2><p className="details-description">{donation.description}</p></section>
          <section className="details-section"><h2>Donation details</h2><div className="detail-list">
            <div><span>◫</span><p><small>Quantity</small><strong>{donation.quantity} {donation.quantityUnit}</strong></p></div>
            <div><span>⌖</span><p><small>Pickup location</small><strong>{donation.location}</strong></p></div>
            <div><span>◷</span><p><small>Available until</small><strong>{formatDate(donation.availableUntil)}</strong></p></div>
            <div><span>☎</span><p><small>Contact number</small><strong>{donation.contactNumber}</strong></p></div>
            <div><span>▣</span><p><small>Date posted</small><strong>{formatDate(donation.createdAt)}</strong></p></div>
            <div><span>●</span><p><small>Current status</small><strong>{donation.status}</strong></p></div>
          </div></section>
        </article>
        <aside className="reservation-card">
          <div className="reservation-icon" aria-hidden="true">{donation.status === "AVAILABLE" && !expired ? "🤝" : donation.status === "RESERVED" ? "◷" : "✓"}</div>
          {donation.status === "AVAILABLE" && !expired && <><h2>Ready to collect this food?</h2><p>Reserve the listing so the provider knows someone is planning to collect it.</p><button className="button button-primary button-block button-large" onClick={() => setDialogOpen(true)}>Reserve This Donation</button><small>No payment is required through SavePlate LK.</small></>}
          {expired && <><h2>Pickup time has passed.</h2><p>This listing can no longer be reserved. Browse other available donations instead.</p><button className="button button-disabled button-block" disabled>Reservation unavailable</button></>}
          {donation.status === "RESERVED" && <><h2>This donation has already been reserved.</h2><p>Another recipient is arranging to collect this listing.</p><Link className="button button-secondary button-block" to="/donations">Find Other Food</Link></>}
          {donation.status === "COLLECTED" && <><h2>This donation has been collected.</h2><p>The provider has confirmed that pickup is complete.</p><Link className="button button-secondary button-block" to="/donations">Browse Donations</Link></>}
          <div className="safety-note"><strong>Pickup reminder</strong><p>Contact the provider and make appropriate arrangements before travelling.</p></div>
        </aside>
      </div>
      <ConfirmDialog open={dialogOpen} title="Reserve this donation?" message={`You are about to reserve ${donation.foodName} from ${donation.providerName}.`} confirmText="Yes, Reserve" busy={updating} onConfirm={reserveDonation} onCancel={() => setDialogOpen(false)} />
    </div>
  );
}
