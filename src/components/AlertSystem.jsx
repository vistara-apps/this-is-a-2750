import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MessageSquare, CheckCircle, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function AlertSystem() {
  const { state, dispatch } = useAppContext();
  const [alertStatus, setAlertStatus] = useState('idle'); // idle, sending, sent, error
  const [alertMessage, setAlertMessage] = useState('');

  const sendEmergencyAlert = async () => {
    if (state.user.trustedContacts.length === 0) {
      setAlertStatus('error');
      setAlertMessage('No trusted contacts configured. Please add contacts in Settings.');
      return;
    }

    setAlertStatus('sending');
    setAlertMessage('Sending emergency alerts...');

    try {
      // Simulate API call to send alerts
      const alertData = {
        location: state.location.current,
        timestamp: new Date().toISOString(),
        message: `Emergency alert from ${state.user.email || 'Pocket Protector user'}. Location: ${
          state.location.current 
            ? `${state.location.current.latitude}, ${state.location.current.longitude}` 
            : 'Unknown'
        }`,
        contacts: state.user.trustedContacts
      };

      // In a real implementation, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 2000));

      dispatch({
        type: 'SEND_ALERT',
        payload: { contacts: state.user.trustedContacts }
      });

      setAlertStatus('sent');
      setAlertMessage(`Alert sent to ${state.user.trustedContacts.length} contact(s)`);

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setAlertStatus('idle');
        setAlertMessage('');
      }, 5000);

    } catch (error) {
      setAlertStatus('error');
      setAlertMessage('Failed to send alert. Please try again.');
      console.error('Alert sending failed:', error);
    }
  };

  const getAlertButtonClass = () => {
    const baseClass = "w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3";
    
    switch (alertStatus) {
      case 'sending':
        return `${baseClass} bg-yellow-500 text-white cursor-not-allowed`;
      case 'sent':
        return `${baseClass} bg-green-500 text-white`;
      case 'error':
        return `${baseClass} bg-red-500 text-white`;
      default:
        return `${baseClass} bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105`;
    }
  };

  const getAlertButtonContent = () => {
    switch (alertStatus) {
      case 'sending':
        return (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Sending Alert...
          </>
        );
      case 'sent':
        return (
          <>
            <CheckCircle className="w-5 h-5" />
            Alert Sent Successfully
          </>
        );
      case 'error':
        return (
          <>
            <X className="w-5 h-5" />
            Alert Failed
          </>
        );
      default:
        return (
          <>
            <AlertTriangle className="w-5 h-5" />
            Send Emergency Alert
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Status Bar */}
      {alertMessage && (
        <div className={`p-4 rounded-lg border ${
          alertStatus === 'sent' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : alertStatus === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-yellow-50 border-yellow-200 text-yellow-800'
        }`}>
          <div className="flex items-center gap-2">
            {alertStatus === 'sent' && <CheckCircle className="w-4 h-4" />}
            {alertStatus === 'error' && <X className="w-4 h-4" />}
            {alertStatus === 'sending' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>}
            <span className="text-sm font-medium">{alertMessage}</span>
          </div>
        </div>
      )}

      {/* Emergency Alert Button */}
      <div className="bg-white rounded-xl p-6 shadow-card">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Emergency Alert System</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 text-center mb-4">
            Instantly notify your trusted contacts with your location and situation
          </p>
          
          {state.user.trustedContacts.length > 0 ? (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700 font-medium mb-2">
                Alert will be sent to {state.user.trustedContacts.length} contact(s):
              </p>
              <div className="space-y-1">
                {state.user.trustedContacts.slice(0, 3).map((contact, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-3 h-3" />
                    <span>{contact.name} - {contact.phone}</span>
                  </div>
                ))}
                {state.user.trustedContacts.length > 3 && (
                  <p className="text-xs text-gray-500">
                    +{state.user.trustedContacts.length - 3} more contacts
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ No trusted contacts configured. Add contacts in Settings to enable alerts.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={sendEmergencyAlert}
          disabled={alertStatus === 'sending' || state.user.trustedContacts.length === 0}
          className={getAlertButtonClass()}
        >
          {getAlertButtonContent()}
        </button>

        {/* Alert History */}
        {state.alerts.sent.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Alerts</h3>
            <div className="space-y-2">
              {state.alerts.sent.slice(-3).reverse().map((alert) => (
                <div key={alert.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-900">
                        Alert sent to {alert.contacts.length} contact(s)
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {alert.location && (
                    <p className="text-xs text-gray-600 mt-1">
                      Location: {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white rounded-xl p-4 shadow-card hover:shadow-lg transition-shadow">
          <Phone className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-gray-900 block">Call 911</span>
        </button>
        <button className="bg-white rounded-xl p-4 shadow-card hover:shadow-lg transition-shadow">
          <MessageSquare className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-gray-900 block">Text Alert</span>
        </button>
      </div>
    </div>
  );
}
