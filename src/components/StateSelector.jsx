import React from 'react';
import { X, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const states = [
  { code: 'CA', name: 'California' },
  { code: 'NY', name: 'New York' },
  { code: 'TX', name: 'Texas' },
  { code: 'FL', name: 'Florida' },
  { code: 'IL', name: 'Illinois' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'OH', name: 'Ohio' },
  { code: 'GA', name: 'Georgia' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'MI', name: 'Michigan' },
];

export default function StateSelector({ onClose }) {
  const { state, dispatch } = useAppContext();

  const handleStateSelect = (stateCode) => {
    dispatch({ type: 'SET_USER_STATE', payload: stateCode });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg w-full max-w-sm max-h-96 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Select Your State</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-80">
          {states.map((state) => (
            <button
              key={state.code}
              onClick={() => handleStateSelect(state.code)}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <MapPin className="w-5 h-5 text-accent" />
              <span className="font-medium">{state.name}</span>
              <span className="text-sm text-gray-500 ml-auto">{state.code}</span>
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            More states coming soon. Laws vary by jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}