import React, { useState } from 'react';
import { User, Users, Globe, CreditCard, HelpCircle, Shield, Plus, Trash2, Crown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ContactPicker from './ContactPicker';
import { UpgradeButton } from './CallToAction';
import { getApiStatus } from '../services/api';

export default function SettingsPanel() {
  const { state, dispatch } = useAppContext();
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' });

  const handleAddContact = () => {
    if (newContact.name && (newContact.phone || newContact.email)) {
      const updatedContacts = [...state.user.trustedContacts, {
        id: Date.now().toString(),
        ...newContact
      }];
      dispatch({ type: 'SET_TRUSTED_CONTACTS', payload: updatedContacts });
      setNewContact({ name: '', phone: '', email: '' });
      setShowAddContact(false);
    }
  };

  const handleRemoveContact = (contactId) => {
    const updatedContacts = state.user.trustedContacts.filter(c => c.id !== contactId);
    dispatch({ type: 'SET_TRUSTED_CONTACTS', payload: updatedContacts });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Settings</h2>

      {/* Profile Section */}
      <div className="bg-surface rounded-lg shadow-card p-4">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Profile</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              placeholder="Enter your email"
              defaultValue={state.user.email}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subscription</label>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Free Plan</span>
              <button className="text-accent text-sm font-medium hover:underline">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted Contacts */}
      <div className="bg-surface rounded-lg shadow-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Trusted Contacts</h3>
          </div>
          <button
            onClick={() => setShowAddContact(true)}
            className="flex items-center gap-1 text-accent hover:text-accent/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add</span>
          </button>
        </div>

        {state.user.trustedContacts.length === 0 ? (
          <p className="text-sm text-gray-600">
            No trusted contacts added. These contacts will be automatically notified when you start recording.
          </p>
        ) : (
          <div className="space-y-3">
            {state.user.trustedContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{contact.name}</div>
                  <div className="text-sm text-gray-600">
                    {contact.phone && <span>{contact.phone}</span>}
                    {contact.phone && contact.email && <span> • </span>}
                    {contact.email && <span>{contact.email}</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Contact Modal */}
        {showAddContact && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-surface rounded-lg w-full max-w-sm p-4">
              <h4 className="font-semibold mb-4">Add Trusted Contact</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={newContact.email}
                  onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowAddContact(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContact}
                  className="flex-1 py-2 px-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* App Settings */}
      <div className="bg-surface rounded-lg shadow-card p-4">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">App Settings</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Language</span>
            <select className="p-2 border border-gray-300 rounded-lg text-sm">
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Auto-location</span>
            <input type="checkbox" className="w-4 h-4 text-accent" defaultChecked />
          </div>
        </div>
      </div>

      {/* Legal & Support */}
      <div className="bg-surface rounded-lg shadow-card p-4">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Legal & Support</h3>
        </div>
        <div className="space-y-3">
          <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-sm">Privacy Policy</span>
          </button>
          <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-sm">Terms of Service</span>
          </button>
          <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-sm">Contact Support</span>
          </button>
          <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-sm">About Pocket Protector</span>
          </button>
        </div>
      </div>

      {/* App Version */}
      <div className="text-center text-white/70 text-sm">
        Pocket Protector v1.0.0
      </div>
    </div>
  );
}
