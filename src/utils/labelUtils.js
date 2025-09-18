export const downloadLabel = (shipmentData) => {
  if (!shipmentData || !shipmentData.output || !shipmentData.output.transactionShipments) {
    alert('No label data available to download');
    return;
  }

  const shipment = shipmentData.output.transactionShipments[0];
  
  if (shipment.pieceResponses && shipment.pieceResponses.length > 0) {
    shipment.pieceResponses.forEach((piece, pieceIndex) => {
      if (piece.packageDocuments) {
        piece.packageDocuments.forEach((doc, docIndex) => {
          if (doc.encodedLabel) {
            const byteCharacters = atob(doc.encodedLabel);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `shipping-label-${shipment.masterTrackingId?.trackingNumber || 'label'}-${pieceIndex + 1}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        });
      }
    });
  } else {
    const trackingNumber = shipment.masterTrackingId?.trackingNumber || 'label';
    const labelContent = generateLabelHTML(shipmentData);
    
    const blob = new Blob([labelContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `shipping-label-${trackingNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const printLabel = () => {
  window.print();
};

const generateLabelHTML = (shipmentData) => {
  const shipment = shipmentData.output.transactionShipments[0];
  const trackingNumber = shipment.masterTrackingId?.trackingNumber || '1234567890';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Shipping Label - ${trackingNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .label { border: 2px solid #000; padding: 20px; max-width: 600px; }
        .header { text-align: center; margin-bottom: 20px; }
        .addresses { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .address { flex: 1; margin: 0 10px; }
        .tracking { text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; border: 2px solid #000; padding: 10px; }
        .details { display: flex; justify-content: space-between; font-size: 12px; }
        h4 { border-bottom: 1px solid #000; padding-bottom: 5px; }
      </style>
    </head>
    <body>
      <div class="label">
        <div class="header">
          <h2>FedEx Shipping Label</h2>
          <p>Tracking Number: ${trackingNumber}</p>
        </div>
        
        <div class="addresses">
          <div class="address">
            <h4>SHIP FROM:</h4>
            <strong>Your Company</strong><br />
            123 Business Street<br />
            Business City, ST 12345<br />
            United States<br />
            Phone: (555) 123-4567
          </div>
          
          <div class="address">
            <h4>SHIP TO:</h4>
            <strong>${shipmentData.requestData?.contactName || 'N/A'}</strong><br />
            ${shipmentData.requestData?.company ? shipmentData.requestData.company + '<br />' : ''}
            ${shipmentData.requestData?.addressLine1 || 'N/A'}<br />
            ${shipmentData.requestData?.addressLine2 ? shipmentData.requestData.addressLine2 + '<br />' : ''}
            ${shipmentData.requestData?.city || 'N/A'}, ${shipmentData.requestData?.stateOrProvinceCode || 'N/A'} ${shipmentData.requestData?.postalCode || 'N/A'}<br />
            ${shipmentData.requestData?.countryCode || 'N/A'}<br />
            Phone: ${shipmentData.requestData?.phoneNumber || 'N/A'}
          </div>
        </div>
        
        <div class="tracking">${trackingNumber}</div>
        
        <div class="details">
          <div>
            <strong>Service Type:</strong> FEDEX_GROUND<br />
            <strong>Ship Date:</strong> ${new Date().toLocaleDateString()}<br />
            <strong>Weight:</strong> 1.0 LB
          </div>
          <div>
            <strong>Delivery:</strong> Standard Transit<br />
            <strong>Reference:</strong> Package<br />
            <strong>Pieces:</strong> 1 of 1
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};