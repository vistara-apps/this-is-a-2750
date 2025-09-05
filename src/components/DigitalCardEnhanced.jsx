import React, { useState, useEffect } from 'react';
import { MapPin, Globe, ChevronRight, Info, MessageSquare, Shield, Copy, Check, ChevronDown, ChevronUp, Languages, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import StateSelector from './StateSelector';
import { getStateLaws, detectStateFromLocation } from '../services/stateLaws';
import { openAIService } from '../services/api';

export default function DigitalCardEnhanced() {
  const { state, dispatch } = useAppContext();
  const [activeScript, setActiveScript] = useState('traffic_stop');
  const [showStateSelector, setShowStateSelector] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [expandedSection, setExpandedSection] = useState('rights');
  const [language, setLanguage] = useState('en');
  const [translatedContent, setTranslatedContent] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoadingStateData, setIsLoadingStateData] = useState(false);

  const selectedState = state.user.selectedState || 'CA';
  const stateData = getStateLaws(selectedState);

  // Auto-detect state from location
  useEffect(() => {
    if (state.location.current && !state.user.selectedState) {
      detectStateFromLocation(
        state.location.current.latitude,
        state.location.current.longitude
      ).then(detectedState => {
        if (detectedState) {
          dispatch({
            type: 'SET_USER_STATE',
            payload: detectedState.code
          });
        }
      });
    }
  }, [state.location.current, state.user.selectedState, dispatch]);

  // Handle translation
  const handleTranslate = async (targetLanguage) => {
    if (targetLanguage === 'en') {
      setTranslatedContent(null);
      setLanguage('en');
      return;
    }

    setIsTranslating(true);
    try {
      const translated = await openAIService.translateContent(stateData.rights_content, targetLanguage);
      setTranslatedContent(translated);
      setLanguage(targetLanguage);
    } catch (error) {
      console.error('Translation failed:', error);
      // Fallback to original content
      setTranslatedContent(null);
      setLanguage('en');
    } finally {
      setIsTranslating(false);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Get content based on language
  const getContent = () => {
    return translatedContent || stateData.rights_content;
  };

  const content = getContent();

  return (
    <div className="space-y-4">
      {/* Header with State Selection */}
      <div className="bg-white rounded-xl p-4 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Know Your Rights</h2>
          </div>
          
          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTranslate(language === 'en' ? 'es' : 'en')}
              disabled={isTranslating}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isTranslating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Languages className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {language === 'en' ? 'ES' : 'EN'}
              </span>
            </button>
          </div>
        </div>

        {/* State Selection Button */}
        <button
          onClick={() => setShowStateSelector(true)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="font-medium text-gray-900">{stateData.state_name}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Constitutional Rights */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'rights' ? '' : 'rights')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Constitutional Rights</h3>
              <p className="text-sm text-gray-600">Your fundamental protections</p>
            </div>
          </div>
          {expandedSection === 'rights' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'rights' && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="space-y-3 mt-4">
              {content.constitutional_rights.map((right, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{right}</p>
                    <button
                      onClick={() => copyToClipboard(right)}
                      className="text-xs text-accent hover:text-accent/80 mt-1 flex items-center gap-1"
                    >
                      {copiedText === right ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* What to Say */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'say' ? '' : 'say')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">What to Say</h3>
              <p className="text-sm text-gray-600">Recommended phrases</p>
            </div>
          </div>
          {expandedSection === 'say' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'say' && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="space-y-3 mt-4">
              {content.what_to_say.map((phrase, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-gray-900 font-medium">{phrase}</p>
                  <button
                    onClick={() => copyToClipboard(phrase)}
                    className="text-xs text-green-600 hover:text-green-700 mt-2 flex items-center gap-1"
                  >
                    {copiedText === phrase ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy phrase
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* What NOT to Say */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'avoid' ? '' : 'avoid')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">What NOT to Say</h3>
              <p className="text-sm text-gray-600">Things to avoid</p>
            </div>
          </div>
          {expandedSection === 'avoid' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'avoid' && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="space-y-3 mt-4">
              {content.what_not_to_say.map((item, index) => (
                <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-gray-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* State-Specific Information */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'state' ? '' : 'state')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">{stateData.state_name} Specific</h3>
              <p className="text-sm text-gray-600">Local law considerations</p>
            </div>
          </div>
          {expandedSection === 'state' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'state' && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="space-y-3 mt-4">
              {content.state_specific.map((item, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-gray-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scenario Scripts */}
      <div className="bg-white rounded-xl p-4 shadow-card">
        <h3 className="font-semibold text-gray-900 mb-4">Interaction Scripts</h3>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveScript('traffic_stop')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeScript === 'traffic_stop'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Traffic Stop
          </button>
          <button
            onClick={() => setActiveScript('street_encounter')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeScript === 'street_encounter'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Street Encounter
          </button>
        </div>

        <div className="space-y-3">
          {Object.entries(stateData.scripts[activeScript] || {}).map(([key, script]) => (
            <div key={key} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace('_', ' ')}:
              </p>
              <p className="text-gray-900 italic">"{script}"</p>
              <button
                onClick={() => copyToClipboard(script)}
                className="text-xs text-accent hover:text-accent/80 mt-2 flex items-center gap-1"
              >
                {copiedText === script ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy script
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* State Selector Modal */}
      {showStateSelector && (
        <StateSelector onClose={() => setShowStateSelector(false)} />
      )}
    </div>
  );
}
