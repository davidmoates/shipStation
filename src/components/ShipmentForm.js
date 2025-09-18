import React, { useState } from 'react';

const ShipmentForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    contactName: '',
    company: '',
    phoneNumber: '',
    email: '',
    countryCode: 'US',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    postalCode: '',
    city: '',
    stateOrProvinceCode: '',
    ...initialData
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  React.useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  return (
    <div className="form-section">
      <h3>Shipping Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contactName">Contact Name *</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="countryCode">Country/Territory *</label>
          <select
            id="countryCode"
            name="countryCode"
            value={formData.countryCode}
            onChange={handleInputChange}
            required
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="MX">Mexico</option>
            <option value="GB">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="AU">Australia</option>
            <option value="JP">Japan</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="addressLine1">Address Line 1 *</label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="addressLine2">Address Line 2</label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="addressLine3">Address Line 3</label>
          <input
            type="text"
            id="addressLine3"
            name="addressLine3"
            value={formData.addressLine3}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="stateOrProvinceCode">State/Province</label>
            <input
              type="text"
              id="stateOrProvinceCode"
              name="stateOrProvinceCode"
              value={formData.stateOrProvinceCode}
              onChange={handleInputChange}
              placeholder="e.g. CA, NY, ON"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="postalCode">Postal Code *</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-success" 
          disabled={loading}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {loading ? 'Creating Shipment...' : 'Ship'}
        </button>
      </form>
    </div>
  );
};

export default ShipmentForm;