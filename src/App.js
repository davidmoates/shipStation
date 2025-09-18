import React, { useState } from 'react';
import AddressSearch from './components/AddressSearch';
import ShipmentForm from './components/ShipmentForm';
import ShippingLabel from './components/ShippingLabel';
import FedExService from './services/fedexApi';
import { downloadLabel, printLabel } from './utils/labelUtils';

function App() {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shipmentResult, setShipmentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setError(null);
  };

  const handleShipmentSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const shipmentData = {
        recipient: {
          contactName: formData.contactName,
          company: formData.company,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          addressLine3: formData.addressLine3,
          city: formData.city,
          stateOrProvinceCode: formData.stateOrProvinceCode,
          postalCode: formData.postalCode,
          countryCode: formData.countryCode
        },
        shipper: {
          contactName: 'Your Name',
          company: 'Your Company',
          phoneNumber: '555-123-4567',
          email: 'your.email@company.com',
          addressLine1: '123 Business Street',
          addressLine2: '',
          addressLine3: '',
          city: 'Business City',
          stateOrProvinceCode: 'ST',
          postalCode: '12345',
          countryCode: 'US'
        },
        serviceType: 'FEDEX_GROUND',
        packagingType: 'YOUR_PACKAGING',
        weight: 1,
        dimensions: {
          length: 10,
          width: 10,
          height: 10
        }
      };

      const result = await FedExService.createShipment(shipmentData);
      
      setShipmentResult({
        ...result,
        requestData: formData
      });
      
    } catch (err) {
      console.error('Shipment creation failed:', err);
      
      const mockResult = {
        output: {
          transactionShipments: [{
            masterTrackingId: {
              trackingNumber: 'MOCK123456789'
            },
            pieceResponses: []
          }]
        },
        requestData: formData
      };
      
      setShipmentResult(mockResult);
      setError('Note: Using mock data. To use real FedEx API, configure your credentials in environment variables.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    downloadLabel(shipmentResult);
  };

  const handlePrint = () => {
    printLabel();
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        FedEx Shipping App
      </h1>

      {error && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          color: '#856404', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #ffeaa7'
        }}>
          {error}
        </div>
      )}

      <div className="form-section">
        <h3>Search Recipients</h3>
        <AddressSearch onAddressSelect={handleAddressSelect} />
      </div>

      <ShipmentForm
        initialData={selectedAddress}
        onSubmit={handleShipmentSubmit}
        loading={loading}
      />

      {loading && (
        <div className="loading">
          Creating shipment, please wait...
        </div>
      )}

      {shipmentResult && (
        <ShippingLabel
          shipmentData={shipmentResult}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>Setup Instructions:</h4>
        <p>To use the real FedEx API, create a <code>.env</code> file in the project root with:</p>
        <pre style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '4px' }}>
{`REACT_APP_FEDEX_CLIENT_ID=your_client_id
REACT_APP_FEDEX_CLIENT_SECRET=your_client_secret`}
        </pre>
        <p>Get your credentials from the <a href="https://developer.fedex.com/" target="_blank" rel="noopener noreferrer">FedEx Developer Portal</a>.</p>
      </div>
    </div>
  );
}

export default App;