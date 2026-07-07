import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../components/Toast';

const FORM_FIELDS = {
  noc: [
    { name: 'applicant_name', label: 'Applicant Name', type: 'text', required: true },
    { name: 'applicant_email', label: 'Applicant Email', type: 'email', required: true },
    { name: 'purpose', label: 'Purpose', type: 'text', required: true },
    { name: 'property_address', label: 'Property Address', type: 'text', required: true },
    { name: 'valid_from', label: 'Valid From', type: 'date', required: true },
    { name: 'valid_to', label: 'Valid To', type: 'date', required: true },
  ],
  loa: [
    { name: 'applicant_name', label: 'Applicant Name', type: 'text', required: true },
    { name: 'applicant_email', label: 'Applicant Email', type: 'email', required: true },
    { name: 'authorized_person_name', label: 'Authorized Person Name', type: 'text', required: true },
    { name: 'authorized_person_id', label: 'Authorized Person ID', type: 'text', required: true },
    { name: 'scope_of_authorization', label: 'Scope of Authorization', type: 'text', required: true },
    { name: 'valid_from', label: 'Valid From', type: 'date', required: true },
    { name: 'valid_to', label: 'Valid To', type: 'date', required: true },
  ],
  finance: [
    { name: 'applicant_name', label: 'Applicant Name', type: 'text', required: true },
    { name: 'department', label: 'Department', type: 'text', required: true },
    { name: 'amount', label: 'Amount', type: 'number', required: true, min: 0.01, step: 0.01 },
    { name: 'purpose', label: 'Purpose', type: 'text', required: true },
    { name: 'supporting_document_ref', label: 'Supporting Document Ref', type: 'text' },
  ],
  rental: [
    { name: 'tenant_name', label: 'Tenant Name', type: 'text', required: true },
    { name: 'tenant_email', label: 'Tenant Email', type: 'email', required: true },
    { name: 'property_address', label: 'Property Address', type: 'text', required: true },
    { name: 'rental_amount', label: 'Rental Amount', type: 'number', required: true, min: 0.01, step: 0.01 },
    { name: 'lease_start', label: 'Lease Start', type: 'date', required: true },
    { name: 'lease_end', label: 'Lease End', type: 'date', required: true },
  ],
  cancellation: [
    { name: 'applicant_name', label: 'Applicant Name', type: 'text', required: true },
    { name: 'reference_application_id', label: 'Reference Application ID', type: 'text', required: true },
    { name: 'reference_application_type', label: 'Reference Application Type', type: 'text', required: true },
    { name: 'reason', label: 'Reason', type: 'text', required: true },
  ],
};

const ENTITY_TITLES = {
  noc: 'NOC', loa: 'LOA', finance: 'Finance', rental: 'Rental', cancellation: 'Cancellation',
};

export default function EntityCreate() {
  const { entity } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const fields = FORM_FIELDS[entity] || [];
  const [form, setForm] = useState(() => {
    const init = {};
    fields.forEach((f) => { init[f.name] = ''; });
    return init;
  });

  const validate = () => {
    const errs = {};
    fields.forEach((f) => {
      if (f.required && !form[f.name]) {
        errs[f.name] = `${f.label} is required`;
      }
      if (f.type === 'email' && form[f.name] && !/\S+@\S+\.\S+/.test(form[f.name])) {
        errs[f.name] = 'Invalid email address';
      }
      if (f.type === 'number' && form[f.name] && parseFloat(form[f.name]) <= 0) {
        errs[f.name] = 'Must be greater than 0';
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const result = await api.create(entity, form);
      toast('Application created successfully!');
      navigate(`/${entity}/${result.id}`);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{ENTITY_TITLES[entity] || entity}</h1>
        <div className="tabs">
          <Link to={`/${entity}`} className="tab">All Applications</Link>
          <Link to={`/${entity}/new`} className="tab active">Create New</Link>
        </div>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        {fields.map((f) => (
          <div key={f.name} className="form-group">
            <label htmlFor={f.name}>
              {f.label} {f.required && <span className="required">*</span>}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              value={form[f.name]}
              onChange={handleChange}
              min={f.min}
              step={f.step}
              className={errors[f.name] ? 'input-error' : ''}
            />
            {errors[f.name] && <span className="field-error">{errors[f.name]}</span>}
          </div>
        ))}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating...' : `Create ${ENTITY_TITLES[entity] || entity}`}
        </button>
      </form>
    </div>
  );
}
