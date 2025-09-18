import axios from 'axios';

const FEDEX_BASE_URL = 'https://apis-sandbox.fedex.com';

class FedExService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async authenticate() {
    const clientId = process.env.REACT_APP_FEDEX_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_FEDEX_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('FedEx credentials not configured. Please set REACT_APP_FEDEX_CLIENT_ID and REACT_APP_FEDEX_CLIENT_SECRET environment variables.');
    }

    try {
      const response = await axios.post(`${FEDEX_BASE_URL}/oauth/token`, 
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      return this.accessToken;
    } catch (error) {
      console.error('FedEx authentication failed:', error);
      throw new Error('Failed to authenticate with FedEx API');
    }
  }

  async getAuthToken() {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.authenticate();
    }
    return this.accessToken;
  }

  async createShipment(shipmentData) {
    const token = await this.getAuthToken();

    const shipmentRequest = {
      labelResponseOptions: 'LABEL',
      requestedShipment: {
        shipper: {
          contact: {
            personName: shipmentData.shipper.contactName,
            emailAddress: shipmentData.shipper.email,
            phoneNumber: shipmentData.shipper.phoneNumber,
            companyName: shipmentData.shipper.company
          },
          address: {
            streetLines: [
              shipmentData.shipper.addressLine1,
              shipmentData.shipper.addressLine2,
              shipmentData.shipper.addressLine3
            ].filter(Boolean),
            city: shipmentData.shipper.city,
            stateOrProvinceCode: shipmentData.shipper.stateOrProvinceCode,
            postalCode: shipmentData.shipper.postalCode,
            countryCode: shipmentData.shipper.countryCode
          }
        },
        recipients: [{
          contact: {
            personName: shipmentData.recipient.contactName,
            emailAddress: shipmentData.recipient.email,
            phoneNumber: shipmentData.recipient.phoneNumber,
            companyName: shipmentData.recipient.company
          },
          address: {
            streetLines: [
              shipmentData.recipient.addressLine1,
              shipmentData.recipient.addressLine2,
              shipmentData.recipient.addressLine3
            ].filter(Boolean),
            city: shipmentData.recipient.city,
            stateOrProvinceCode: shipmentData.recipient.stateOrProvinceCode,
            postalCode: shipmentData.recipient.postalCode,
            countryCode: shipmentData.recipient.countryCode
          }
        }],
        shipDatestamp: new Date().toISOString().split('T')[0],
        serviceType: shipmentData.serviceType || 'FEDEX_GROUND',
        packagingType: shipmentData.packagingType || 'YOUR_PACKAGING',
        pickupType: 'USE_SCHEDULED_PICKUP',
        requestedPackageLineItems: [{
          weight: {
            units: 'LB',
            value: shipmentData.weight || 1
          },
          dimensions: {
            length: shipmentData.dimensions?.length || 10,
            width: shipmentData.dimensions?.width || 10,
            height: shipmentData.dimensions?.height || 10,
            units: 'IN'
          }
        }],
        customsClearanceDetail: shipmentData.international ? {
          dutiesPayment: {
            paymentType: 'SENDER'
          },
          commodities: [{
            description: shipmentData.commodityDescription || 'General Merchandise',
            countryOfManufacture: 'US',
            quantity: 1,
            quantityUnits: 'PCS',
            unitPrice: {
              amount: shipmentData.declaredValue || 100,
              currency: 'USD'
            },
            customsValue: {
              amount: shipmentData.declaredValue || 100,
              currency: 'USD'
            },
            weight: {
              units: 'LB',
              value: shipmentData.weight || 1
            }
          }]
        } : undefined
      }
    };

    try {
      const response = await axios.post(`${FEDEX_BASE_URL}/ship/v1/shipments`, 
        shipmentRequest, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-locale': 'en_US'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Shipment creation failed:', error);
      throw new Error('Failed to create shipment');
    }
  }
}

export default new FedExService();