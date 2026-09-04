import { useEffect, useState } from "react";
import { CATEGORIES, getMinimumDateTimeLocal, QUANTITY_UNITS, validateDonationForm } from "../utils/helpers";

export default function DonationForm({ initialValues, submitText, submitting, serverError, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [minimumAvailableUntil, setMinimumAvailableUntil] = useState(getMinimumDateTimeLocal);

  useEffect(() => {
    const refreshMinimum = () => setMinimumAvailableUntil(getMinimumDateTimeLocal());
    const timer = window.setInterval(refreshMinimum, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateDonationForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }
    onSubmit({ ...values, quantity: Number(values.quantity) });
  };

  const field = (name, label, control) => (
    <div className={`form-group ${errors[name] ? "has-error" : ""}`}>
      <label htmlFor={name}>{label} <span aria-hidden="true">*</span></label>
      {control}
      {errors[name] && <p className="field-error" id={`${name}-error`}>{errors[name]}</p>}
    </div>
  );

  return (
    <form className="donation-form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="message error-message" role="alert">{serverError}</div>}
      <div className="form-section-heading"><span>1</span><div><h2>Provider details</h2><p>Who is sharing this surplus food?</p></div></div>
      <div className="form-grid">
        {field("providerName", "Food Provider / Business Name", <input id="providerName" name="providerName" value={values.providerName} onChange={updateValue} placeholder="e.g. Green Leaf Restaurant" aria-describedby={errors.providerName ? "providerName-error" : undefined} />)}
        {field("contactNumber", "Contact Number", <input id="contactNumber" name="contactNumber" value={values.contactNumber} onChange={updateValue} placeholder="0712345678" inputMode="tel" aria-describedby={errors.contactNumber ? "contactNumber-error" : undefined} />)}
      </div>
      <div className="form-section-heading"><span>2</span><div><h2>Food details</h2><p>Tell recipients what is available.</p></div></div>
      <div className="form-grid">
        {field("foodName", "Food Name", <input id="foodName" name="foodName" value={values.foodName} onChange={updateValue} placeholder="e.g. Vegetable Rice Packs" />)}
        {field("category", "Food Category", <select id="category" name="category" value={values.category} onChange={updateValue}><option value="">Select a category</option>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select>)}
        {field("quantity", "Quantity", <input id="quantity" name="quantity" type="number" min="1" value={values.quantity} onChange={updateValue} placeholder="e.g. 15" />)}
        {field("quantityUnit", "Quantity Unit", <select id="quantityUnit" name="quantityUnit" value={values.quantityUnit} onChange={updateValue}><option value="">Select a unit</option>{QUANTITY_UNITS.map((item) => <option key={item}>{item}</option>)}</select>)}
      </div>
      <div className="form-section-heading"><span>3</span><div><h2>Pickup details</h2><p>Help recipients plan a timely collection.</p></div></div>
      <div className="form-grid">
        {field("location", "Pickup Location", <input id="location" name="location" value={values.location} onChange={updateValue} placeholder="e.g. Colombo" />)}
        {field("availableUntil", "Available Until", <input id="availableUntil" name="availableUntil" type="datetime-local" min={minimumAvailableUntil} value={values.availableUntil} onChange={updateValue} aria-describedby={errors.availableUntil ? "availableUntil-error" : undefined} />)}
        <div className="form-group full-width">
          <label htmlFor="description">Description <span aria-hidden="true">*</span></label>
          <textarea id="description" name="description" rows="5" maxLength="300" value={values.description} onChange={updateValue} placeholder="Describe the surplus food and any useful pickup information." />
          <div className="textarea-footer">{errors.description ? <p className="field-error">{errors.description}</p> : <span />}<span>{values.description.length}/300</span></div>
        </div>
      </div>
      <div className="form-note"><span aria-hidden="true">ⓘ</span><p>SavePlate LK is a listing and coordination prototype. Providers and recipients should make their own appropriate pickup arrangements.</p></div>
      <div className="form-actions">
        {onCancel && <button className="button button-secondary" type="button" onClick={onCancel} disabled={submitting}>Cancel</button>}
        <button className="button button-primary button-large" type="submit" disabled={submitting}>{submitting ? "Please wait..." : submitText}</button>
      </div>
    </form>
  );
}
