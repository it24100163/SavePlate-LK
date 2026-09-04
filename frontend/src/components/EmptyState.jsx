import { Link } from "react-router-dom";

export default function EmptyState({ icon = "🍽️", title, text, actionText, actionTo }) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">{icon}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {actionTo && <Link className="button button-primary" to={actionTo}>{actionText}</Link>}
    </div>
  );
}
