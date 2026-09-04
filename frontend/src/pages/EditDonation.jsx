import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DonationForm from "../components/DonationForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { getApiError, getDonationById, updateDonation } from "../services/api";
import { toDateTimeLocal } from "../utils/helpers";

export default function EditDonation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getDonationById(id).then(({ data }) => {
      const item = data.data;
      setValues({ providerName: item.providerName, foodName: item.foodName, category: item.category, quantity: item.quantity, quantityUnit: item.quantityUnit, location: item.location, contactNumber: item.contactNumber, availableUntil: toDateTimeLocal(item.availableUntil), description: item.description });
    }).catch((err) => setError(getApiError(err, "Donation not found."))).finally(() => setLoading(false));
  }, [id]);

  const submit = async (formValues) => {
    setSubmitting(true); setError("");
    try { await updateDonation(id, formValues); navigate(`/donations/${id}`); }
    catch (err) { setError(getApiError(err, "Failed to update donation.")); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="container page-loading"><LoadingSpinner label="Loading donation..." /></div>;
  if (!values) return <div className="container standalone-state"><div className="error-state"><h1>Donation not found.</h1><p>{error}</p><Link className="button button-primary" to="/manage">Back to Manage Donations</Link></div></div>;

  return (
    <div className="page form-page">
      <section className="page-header warm-header"><div className="container"><span className="eyebrow">Manage listing</span><h1>Edit Donation</h1><p>Update the listing details. Status changes use the dedicated actions on the manage page.</p></div></section>
      <div className="container form-layout single-form"><DonationForm initialValues={values} submitText="Save Changes" submitting={submitting} serverError={error} onSubmit={submit} onCancel={() => navigate("/manage")} /></div>
    </div>
  );
}
