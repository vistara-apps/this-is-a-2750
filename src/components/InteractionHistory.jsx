import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Share2, Download, Eye } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatDate, formatDuration } from '../utils/helpers';
import ShareableSummary from './ShareableSummary';

export default function InteractionHistory() {
  const { state } = useAppContext();
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const recordings = state.recording.recordings;

  const handleViewSummary = (recording) => {
    setSelectedRecording(recording);
    setShowSummary(true);
  };

  if (recordings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Interactions Yet</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          When you start recording interactions, they'll appear here with options to 
          view details and generate shareable summaries.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Interaction History</h2>
        <span className="text-sm text-white/70">{recordings.length} recordings</span>
      </div>

      {recordings.map((recording) => (
        <div key={recording.id} className="bg-surface rounded-lg shadow-card overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Interaction #{recording.id.slice(-4)}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(recording.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(Math.floor(recording.duration / 1000))}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewSummary(recording)}
                  className="p-2 text-accent hover:bg-accent/10 rounded-full transition-colors"
                  title="View Summary"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {recording.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>
                  {recording.location.latitude.toFixed(4)}, {recording.location.longitude.toFixed(4)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                Started: {new Date(recording.startTime).toLocaleTimeString()}
              </span>
              <span className="text-sm text-gray-500">
                Ended: {new Date(recording.endTime).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Premium Upgrade Banner */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 border border-accent/20">
        <h4 className="font-semibold text-gray-800 mb-2">Upgrade for More Features</h4>
        <p className="text-sm text-gray-600 mb-3">
          Get unlimited cloud storage, advanced analytics, and priority support.
        </p>
        <button className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
          Upgrade to Premium
        </button>
      </div>

      {showSummary && selectedRecording && (
        <ShareableSummary
          recording={selectedRecording}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}