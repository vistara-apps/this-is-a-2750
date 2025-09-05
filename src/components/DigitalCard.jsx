import React, { useState, useEffect } from 'react';
import { MapPin, Globe, ChevronRight, Info, MessageSquare, Shield, Copy, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import StateSelector from './StateSelector';
import { getStateLaws, detectStateFromLocation } from '../services/stateLaws';
import { openAIService } from '../services/api';

const rightsData = {
  'CA': {
    title: 'California Rights',
    rights: [
      'You have the right to remain silent',
      'You have the right to refuse searches without a warrant',
      'You have the right to ask if you are free to leave',
      'You have the right to request a lawyer',
      'You have the right to record in public spaces'
    ],
    scripts: {
      polite: [
        '"I exercise my right to remain silent."',
        '"I do not consent to any searches."',
        '"Am I free to leave?"',
        '"I would like to speak to a lawyer."'
      ],
      traffic: [
        '"Here is my license, registration, and insurance."',
        '"I exercise my right to remain silent."',
        '"I do not consent to any searches of my vehicle."'
      ]
    }
  },
  'NY': {
    title: 'New York Rights',
    rights: [
      'You have the right to remain silent',
      'You have the right to refuse searches without a warrant',
      'You have the right to ask if you are free to leave',
      'You have the right to request a lawyer',
      'Stop and frisk requires reasonable suspicion'
    ],
    scripts: {
      polite: [
        '"I exercise my right to remain silent."',
        '"I do not consent to any searches."',
        '"Am I free to leave?"',
        '"I would like to speak to a lawyer."'
      ],
      traffic: [
        '"Here is my license, registration, and insurance."',
        '"I exercise my right to remain silent."',
        '"I do not consent to any searches of my vehicle."'
      ]
    }
  },
  'TX': {
    title: 'Texas Rights',
    rights: [
      'You have the right to remain silent',
      'You have the right to refuse searches without a warrant',
      'You have the right to ask if you are free to leave',
      'You have the right to request a lawyer',
      'Open carry laws apply with proper licensing'
    ],
    scripts: {
      polite: [
        '"I exercise my right to remain silent."',
        '"I do not consent to any searches."',
        '"Am I free to leave?"',
        '"I would like to speak to a lawyer."'
      ],
      traffic: [
        '"Here is my license, registration, and insurance."',
        '"I exercise my right to remain silent."',
        '"I do not consent to any searches of my vehicle."'
      ]
    }
  }
};

export default function DigitalCard() {
  const { state, dispatch } = useAppContext();
  const [activeScript, setActiveScript] = useState('polite');
  const [showStateSelector, setShowStateSelector] = useState(false);

  const selectedState = state.user.selectedState || 'CA';
  const stateData = rightsData[selectedState] || rightsData['CA'];

  return (
    <div className="space-y-4">
      {/* State Selection */}
      <div className="glass-card rounded-lg p-4">
        <button
          onClick={() => setShowStateSelector(true)}
          className="w-full flex items-center justify-between text-white"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="font-medium">{stateData.title}</span>
          </div>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Rights Card */}
      <div className="bg-surface rounded-lg shadow-card overflow-hidden">
        <div className="bg-primary text-white p-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            <h2 className="text-lg font-bold">Your Rights</h2>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {stateData.rights.map((right, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">{right}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scripts Section */}
      <div className="bg-surface rounded-lg shadow-card overflow-hidden">
        <div className="bg-accent text-white p-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <h2 className="text-lg font-bold">What to Say</h2>
          </div>
        </div>

        {/* Script Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveScript('polite')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeScript === 'polite'
                ? 'bg-accent/10 text-accent border-b-2 border-accent'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            General Stop
          </button>
          <button
            onClick={() => setActiveScript('traffic')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeScript === 'traffic'
                ? 'bg-accent/10 text-accent border-b-2 border-accent'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Traffic Stop
          </button>
        </div>

        <div className="p-4 space-y-3">
          {stateData.scripts[activeScript].map((script, index) => (
            <div key={index} className="bg-gray-50 rounded-md p-3">
              <p className="text-sm text-gray-800 font-medium">{script}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-orange-800 font-medium mb-1">Important</p>
            <p className="text-xs text-orange-700">
              Stay calm, be respectful, and follow officer instructions for your safety. 
              This app provides general guidance and is not legal advice.
            </p>
          </div>
        </div>
      </div>

      {showStateSelector && (
        <StateSelector onClose={() => setShowStateSelector(false)} />
      )}
    </div>
  );
}
