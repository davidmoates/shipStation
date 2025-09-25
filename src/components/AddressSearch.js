import React, { useState, useEffect } from 'react';
import { searchAddresses } from '../services/addressDatabase';

const AddressSearch = ({ onAddressSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = () => {
    const results = searchAddresses(searchTerm);
    setSearchResults(results);
    setShowDropdown(results.length > 0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 1) {
      const results = searchAddresses(value);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleAddressSelect = (address) => {
    setSearchTerm(`${address.searchKey} - ${address.contactName}`);
    setShowDropdown(false);
    onAddressSelect(address);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search by contract number (e.g. S14401.A01)..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <button 
        className="btn btn-primary" 
        onClick={handleSearch}
      >
        Search
      </button>
      
      {showDropdown && (
        <div className="dropdown">
          <div className="dropdown-content">
            {searchResults.map((address) => (
              <div
                key={address.id}
                className="dropdown-item"
                onClick={() => handleAddressSelect(address)}
              >
                <strong>{address.searchKey}</strong> - {address.contactName} - {address.company}
                <br />
                <small>{address.addressLine1}, {address.city}, {address.stateOrProvinceCode}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;