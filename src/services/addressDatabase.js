const addressDatabase = [
  {
    id: 1,
    searchKey: 'S14401.A01',
    contactName: 'John Doe',
    company: 'Acme Corp',
    phoneNumber: '555-0123',
    email: 'john.doe@acme.com',
    countryCode: 'US',
    addressLine1: '123 Main Street',
    addressLine2: 'Suite 100',
    addressLine3: '',
    postalCode: '12345',
    city: 'New York',
    stateOrProvinceCode: 'NY'
  },
  {
    id: 2,
    searchKey: 'S50550.Q01',
    contactName: 'Jane Smith',
    company: 'Tech Solutions Inc',
    phoneNumber: '555-0456',
    email: 'jane.smith@techsolutions.com',
    countryCode: 'US',
    addressLine1: '456 Oak Avenue',
    addressLine2: '',
    addressLine3: '',
    postalCode: '67890',
    city: 'Los Angeles',
    stateOrProvinceCode: 'CA'
  },
  {
    id: 3,
    searchKey: 'S32021.B00',
    contactName: 'Mike Johnson',
    company: 'Global Enterprises',
    phoneNumber: '555-0789',
    email: 'mike.johnson@global.com',
    countryCode: 'US',
    addressLine1: '789 Pine Street',
    addressLine2: 'Floor 5',
    addressLine3: '',
    postalCode: '54321',
    city: 'Chicago',
    stateOrProvinceCode: 'IL'
  },
  {
    id: 4,
    searchKey: 'S14432.G25',
    contactName: 'Sarah Wilson',
    company: 'Creative Studio',
    phoneNumber: '555-0321',
    email: 'sarah.wilson@creative.com',
    countryCode: 'US',
    addressLine1: '321 Elm Street',
    addressLine2: '',
    addressLine3: '',
    postalCode: '98765',
    city: 'Seattle',
    stateOrProvinceCode: 'WA'
  },
  {
    id: 5,
    searchKey: 'S55023.H03',
    contactName: 'David Brown',
    company: 'Manufacturing Co',
    phoneNumber: '555-0654',
    email: 'david.brown@manufacturing.com',
    countryCode: 'CA',
    addressLine1: '654 Maple Avenue',
    addressLine2: 'Unit B',
    addressLine3: '',
    postalCode: 'M5V 3A1',
    city: 'Toronto',
    stateOrProvinceCode: 'ON'
  }
];

export const searchAddresses = (searchTerm) => {
  if (!searchTerm || searchTerm.length < 1) {
    return [];
  }
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  return addressDatabase.filter(address => 
    address.searchKey.toLowerCase().includes(normalizedSearch) ||
    address.contactName.toLowerCase().includes(normalizedSearch) ||
    address.company.toLowerCase().includes(normalizedSearch)
  );
};

export const getAddressById = (id) => {
  return addressDatabase.find(address => address.id === id);
};
