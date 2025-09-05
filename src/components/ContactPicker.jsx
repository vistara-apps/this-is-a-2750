import React, { useState } from 'react';
import { Plus, X, Phone, Mail, User, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ContactPicker({ variant = 'multi', onContactsSelected, selectedContacts = [] }) {
  const { state, dispatch } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: ''
  });
  const [errors, setErrors] = useState({});

  const validateContact = (contact) => {
    const newErrors = {};
    
    if (!contact.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!contact.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(contact.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    return newErrors;
  };

  const handleAddContact = () => {
    const validationErrors = validateContact(newContact);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      const contactToAdd = {
        ...newContact,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      const updatedContacts = [...state.user.trustedContacts, contactToAdd];
      dispatch({
        type: 'SET_TRUSTED_CONTACTS',
        payload: updatedContacts
      });
      
      // Reset form
      setNewContact({ name: '', phone: '', email: '', relationship: '' });
      setShowAddForm(false);
      setErrors({});
    }
  };

  const handleRemoveContact = (contactId) => {
    const updatedContacts = state.user.trustedContacts.filter(c => c.id !== contactId);
    dispatch({
      type: 'SET_TRUSTED_CONTACTS',
      payload: updatedContacts
    });
  };

  const handleContactSelection = (contact) => {
    if (variant === 'single') {
      onContactsSelected([contact]);
    } else {
      const isSelected = selectedContacts.some(c => c.id === contact.id);
      if (isSelected) {
        onContactsSelected(selectedContacts.filter(c => c.id !== contact.id));
      } else {
        onContactsSelected([...selectedContacts, contact]);
      }
    }
  };

  const isContactSelected = (contact) => {
    return selectedContacts.some(c => c.id === contact.id);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {variant === 'single' ? 'Select Contact' : 'Select Contacts'}
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Add New Contact</h4>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewContact({ name: '', phone: '', email: '', relationship: '' });
                setErrors({});
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter contact name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship
              </label>
              <select
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              >
                <option value="">Select relationship</option>
                <option value="family">Family</option>
                <option value="friend">Friend</option>
                <option value="colleague">Colleague</option>
                <option value="lawyer">Lawyer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddContact}
                className="flex-1 bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Add Contact
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewContact({ name: '', phone: '', email: '', relationship: '' });
                  setErrors({});
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="space-y-2">
        {state.user.trustedContacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No contacts added yet</p>
            <p className="text-xs">Add your first trusted contact to get started</p>
          </div>
        ) : (
          state.user.trustedContacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                isContactSelected(contact)
                  ? 'border-accent bg-accent/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onContactsSelected && handleContactSelection(contact)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isContactSelected(contact) ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {isContactSelected(contact) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                  {contact.relationship && (
                    <p className="text-xs text-gray-500 capitalize">{contact.relationship}</p>
                  )}
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveContact(contact.id);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Selection Summary */}
      {onContactsSelected && selectedContacts.length > 0 && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
          <p className="text-sm font-medium text-accent">
            {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedContacts.map((contact) => (
              <span
                key={contact.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-white text-xs rounded-full"
              >
                {contact.name}
                <button
                  onClick={() => handleContactSelection(contact)}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
