import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import { deleteDonation, getApiError, getDonations, updateDonationStatus } from "../services/api";
import { formatDate, isExpired } from "../utils/helpers";

export default function ManageDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [processing, setProcessing] = useState(false);

  const load = () => {
    setLoading(true); setError("");
    getDonations().then(({ data }) => setDonations(data.data)).catch((err) => setError(getApiError(err, "Failed to load donations."))).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const confirmAction = async () => {
    const { type, donation } = pendingAction;
    setProcessing(true); setError(""); setMessage("");
    try {
      if (type === "delete") {
        const { data } = await deleteDonation(donation._id);
        setDonations((items) => items.filter((item) => item._id !== donation._id));
        setMessage(data.message);
      } else {
        const { data } = await updateDonationStatus(donation._id, "COLLECTED");
        setDonations((items) => items.map((item) => item._id === donation._id ? data.data : item));
        setMessage(data.message);
      }
      setPendingAction(null);
    } catch (err) { setError(getApiError(err)); setPendingAction(null); }
    finally { setProcessing(false); }
  };

  return (
    <div className="page manage-page">
      <section className="page-header green-header compact"><div className="container header-with-action"><div><span className="eyebrow light">For food providers</span><h1>Manage Donations</h1><p>View and manage surplus food listings.</p></div><Link className="button button-light" to="/donate">+ New Donation</Link></div></section>
      <div className="container manage-content">
        {message && <div className="message success-message" role="status">✓ {message}</div>}
        {error && <div className="message error-message" role="alert">{error}</div>}
        {loading ? <LoadingSpinner label="Loading your donations..." /> : !donations.length ? <EmptyState title="No donations have been posted yet." text="Share your first surplus food listing with the community." actionText="Donate Food" actionTo="/donate" /> : (
          <section>
            <div className="manage-summary"><div><strong>{donations.length}</strong><span>Total listings</span></div><div><strong>{donations.filter((item) => item.status === "AVAILABLE").length}</strong><span>Available</span></div><div><strong>{donations.filter((item) => item.status === "RESERVED").length}</strong><span>Awaiting pickup</span></div><div><strong>{donations.filter((item) => item.status === "COLLECTED").length}</strong><span>Collected</span></div></div>
            <div className="manage-table-wrap">
              <table className="manage-table">
                <thead><tr><th>Donation</th><th>Quantity</th><th>Location</th><th>Available Until</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{donations.map((donation) => <tr key={donation._id}>
                  <td data-label="Donation"><strong>{donation.foodName}</strong><span>{donation.providerName}</span></td>
                  <td data-label="Quantity">{donation.quantity} {donation.quantityUnit}</td>
                  <td data-label="Location">{donation.location}</td>
                  <td data-label="Available Until">{formatDate(donation.availableUntil)}{isExpired(donation) && <small className="expired-text">Pickup time passed</small>}</td>
                  <td data-label="Status"><StatusBadge status={donation.status} expired={isExpired(donation)} /></td>
                  <td data-label="Actions"><div className="table-actions"><Link to={`/donations/${donation._id}`} aria-label={`View ${donation.foodName}`}>View</Link><Link to={`/edit/${donation._id}`} aria-label={`Edit ${donation.foodName}`}>Edit</Link>{donation.status === "RESERVED" && <button className="collect-action" onClick={() => setPendingAction({ type: "collect", donation })}>Mark Collected</button>}<button className="delete-action" onClick={() => setPendingAction({ type: "delete", donation })}>Delete</button></div></td>
                </tr>)}</tbody>
              </table>
            </div>
          </section>
        )}
      </div>
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.type === "delete" ? "Delete this donation?" : "Mark as collected?"}
        message={pendingAction?.type === "delete" ? "Are you sure you want to delete this donation? This cannot be undone." : "Confirm that this reserved donation has been picked up."}
        confirmText={pendingAction?.type === "delete" ? "Delete Donation" : "Mark as Collected"}
        variant={pendingAction?.type === "delete" ? "danger" : "primary"}
        busy={processing}
        onConfirm={confirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
