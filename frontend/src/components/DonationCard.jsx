import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatDate, getCategoryIcon, isExpired } from "../utils/helpers";

export default function DonationCard({ donation }) {
  const expired = isExpired(donation);
  return (
    <article className={`donation-card ${donation.status.toLowerCase()}`}>
      <div className="card-topline">
        <span className="category-icon" aria-hidden="true">{getCategoryIcon(donation.category)}</span>
        <StatusBadge status={donation.status} expired={expired} />
      </div>
      <div className="card-copy">
        <span className="eyebrow">{donation.category}</span>
        <h2>{donation.foodName}</h2>
        <p className="provider-name">{donation.providerName}</p>
        <p className="description-clamp">{donation.description}</p>
      </div>
      <div className="donation-meta">
        <span><b aria-hidden="true">◫</b> {donation.quantity} {donation.quantityUnit}</span>
        <span><b aria-hidden="true">⌖</b> {donation.location}</span>
        <span className="meta-wide"><b aria-hidden="true">◷</b> Available until {formatDate(donation.availableUntil)}</span>
      </div>
      <Link className="button button-card" to={`/donations/${donation._id}`}>View Details <span aria-hidden="true">→</span></Link>
    </article>
  );
}
