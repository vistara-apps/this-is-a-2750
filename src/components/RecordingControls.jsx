import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, Square, Play, AlertTriangle, MapPin, Clock, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatDuration } from '../utils/helpers';
import AlertSystem from './AlertSystem';
import { RecordButton } from './CallToAction';
import { pinataService, supabaseService } from '../services/api';

export default function RecordingControls() {
  const { state, dispatch } = useAppContext();
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingType, setRecordingType] = useState('audio');
  const timerRef = useRef();

  const isRecording = state.recording.isRecording;

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      // Request media permissions
      if (recordingType === 'video') {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } else {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      dispatch({ type: 'START_RECORDING' });

      // Send alert to trusted contacts
      if (state.user.trustedContacts.length > 0) {
        dispatch({
          type: 'SEND_ALERT',
          payload: { contacts: state.user.trustedContacts }
        });
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    dispatch({ type: 'STOP_RECORDING' });
  };

  return (
    <div className="space-y-6">
      {/* Emergency Banner */}
      <div className="bg-red-500 text-white rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="font-bold">Emergency Recording</h2>
        </div>
        <p className="text-sm opacity-90">
          Start recording to document your interaction and alert your trusted contacts.
        </p>
      </div>

      {/* Recording Type Selection */}
      <div className="bg-surface rounded-lg shadow-card p-4">
        <h3 className="font-semibold mb-3">Recording Type</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setRecordingType('audio')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
              recordingType === 'audio'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-gray-200 text-gray-600'
            }`}
            disabled={isRecording}
          >
            <Mic className="w-5 h-5" />
            <span className="font-medium">Audio</span>
          </button>
          <button
            onClick={() => setRecordingType('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
              recordingType === 'video'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-gray-200 text-gray-600'
            }`}
            disabled={isRecording}
          >
            <Video className="w-5 h-5" />
            <span className="font-medium">Video</span>
          </button>
        </div>
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-red-800">Recording Active</span>
            </div>
            <div className="flex items-center gap-1 text-red-700">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">{formatDuration(recordingTime)}</span>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Location being recorded</span>
            </div>
            {state.user.trustedContacts.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Trusted contacts notified</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Record Button */}
      <div className="text-center">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="w-32 h-32 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center group"
          >
            <div className="text-center">
              {recordingType === 'video' ? (
                <Video className="w-8 h-8 mx-auto mb-1" />
              ) : (
                <Mic className="w-8 h-8 mx-auto mb-1" />
              )}
              <span className="text-sm font-bold">START</span>
            </div>
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="w-32 h-32 bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            <div className="text-center">
              <Square className="w-8 h-8 mx-auto mb-1" />
              <span className="text-sm font-bold">STOP</span>
            </div>
          </button>
        )}
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Recording Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Keep your phone visible and steady</li>
          <li>• Announce that you are recording if legal in your state</li>
          <li>• Record the entire interaction</li>
          <li>• Stay calm and follow officer instructions</li>
        </ul>
      </div>

      {/* Trusted Contacts Status */}
      <div className="bg-surface rounded-lg shadow-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Trusted Contacts</h4>
          <span className="text-sm text-gray-500">
            {state.user.trustedContacts.length} contacts
          </span>
        </div>
        
        {state.user.trustedContacts.length === 0 ? (
          <p className="text-sm text-gray-600">
            No trusted contacts set up. Go to Settings to add contacts who will be 
            automatically notified when you start recording.
          </p>
        ) : (
          <div className="space-y-2">
            {state.user.trustedContacts.slice(0, 3).map((contact, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{contact.name}</span>
              </div>
            ))}
            {state.user.trustedContacts.length > 3 && (
              <p className="text-xs text-gray-500">
                +{state.user.trustedContacts.length - 3} more contacts
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
