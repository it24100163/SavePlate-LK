import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DonationForm from "../components/DonationForm";
import { createDonation, getApiError } from "../services/api";
import { initialFormValues } from "../utils/helpers";

export default function DonateFood() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (values) => {
    setSubmitting(true); setError("");
    try {
      const { data } = await createDonation(values);
      navigate(`/donations/${data.data._id}`, { state: { message: "Donation published successfully." } });
    } catch (err) { setError(getApiError(err, "Failed to publish donation.")); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="page form-page">
      <section className="page-header warm-header"><div className="container"><span className="eyebrow">For food providers</span><h1>Share Surplus Food</h1><p>List available surplus food so it can be discovered and reserved.</p></div></section>
      <div className="container form-layout"><div className="form-intro"><span className="form-intro-icon">↗</span><h2>Create a donation listing</h2><p>Provide clear details so recipients can quickly understand what is available and where to collect it.</p><div className="form-benefits"><span>✓ Takes only a few minutes</span><span>✓ Visible to local recipients</span><span>✓ Manage it after publishing</span></div></div><DonationForm initialValues={initialFormValues} submitText="Publish Donation" submitting={submitting} serverError={error} onSubmit={submit} /></div>
    </div>
  );
}
