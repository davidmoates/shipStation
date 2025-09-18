import React from 'react';

const ShippingLabel = ({ shipmentData, onDownload, onPrint }) => {
  if (!shipmentData) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="label-preview">
      <h3>Shipping Label & Commercial Invoice</h3>
      
      {shipmentData.output && shipmentData.output.transactionShipments && (
        <div>
          {shipmentData.output.transactionShipments.map((shipment, index) => (
            <div key={index} style={{ marginBottom: '30px', border: '2px solid #000', padding: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: '0', fontSize: '24px' }}>FedEx Shipping Label</h2>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  Tracking Number: <strong>{shipment.masterTrackingId?.trackingNumber || 'N/A'}</strong>
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ borderBottom: '1px solid #000', paddingBottom: '5px' }}>SHIP FROM:</h4>
                  <div style={{ fontSize: '12px' }}>
                    <strong>Your Company</strong><br />
                    123 Business Street<br />
                    Business City, ST 12345<br />
                    United States<br />
                    Phone: (555) 123-4567
                  </div>
                </div>
                
                <div>
                  <h4 style={{ borderBottom: '1px solid #000', paddingBottom: '5px' }}>SHIP TO:</h4>
                  <div style={{ fontSize: '12px' }}>
                    <strong>{shipmentData.requestData?.contactName}</strong><br />
                    {shipmentData.requestData?.company && `${shipmentData.requestData.company}<br />`}
                    {shipmentData.requestData?.addressLine1}<br />
                    {shipmentData.requestData?.addressLine2 && `${shipmentData.requestData.addressLine2}<br />`}
                    {shipmentData.requestData?.city}, {shipmentData.requestData?.stateOrProvinceCode} {shipmentData.requestData?.postalCode}<br />
                    {shipmentData.requestData?.countryCode}<br />
                    Phone: {shipmentData.requestData?.phoneNumber}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <div style={{ fontSize: '48px', fontFamily: 'monospace', border: '2px solid #000', padding: '10px', display: 'inline-block' }}>
                  {shipment.masterTrackingId?.trackingNumber || '1234567890'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '12px' }}>
                <div>
                  <strong>Service Type:</strong> FEDEX_GROUND<br />
                  <strong>Ship Date:</strong> {formatDate(new Date())}<br />
                  <strong>Weight:</strong> 1.0 LB
                </div>
                <div>
                  <strong>Delivery:</strong> Standard Transit<br />
                  <strong>Reference:</strong> Package<br />
                  <strong>Pieces:</strong> 1 of 1
                </div>
              </div>

              {shipment.pieceResponses && shipment.pieceResponses.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4>Label Images:</h4>
                  {shipment.pieceResponses.map((piece, pieceIndex) => (
                    <div key={pieceIndex}>
                      {piece.packageDocuments && piece.packageDocuments.map((doc, docIndex) => (
                        <div key={docIndex} style={{ marginBottom: '10px' }}>
                          {doc.encodedLabel && (
                            <div>
                              <p><strong>Label Format:</strong> {doc.docType}</p>
                              <img 
                                src={`data:image/png;base64,${doc.encodedLabel}`}
                                alt="Shipping Label"
                                style={{ maxWidth: '100%', border: '1px solid #ccc' }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="label-actions">
        <button className="btn btn-primary" onClick={onDownload}>
          Download Label
        </button>
        <button className="btn btn-secondary" onClick={onPrint}>
          Print Label
        </button>
      </div>
    </div>
  );
};

export default ShippingLabel;