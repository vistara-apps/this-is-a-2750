import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, X, Info, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function AlertBar({ variant = 'active', message, type = 'info', onDismiss, autoHide = false, duration = 5000 }) {
  const { state } = useAppContext();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onDismiss]);

  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600'
        };
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600'
        };
      case 'info':
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600'
        };
    }
  };

  const getVariantClasses = () => {
    if (variant === 'active') {
      return 'animate-pulse shadow-lg';
    }
    return '';
  };

  if (!isVisible) return null;

  const config = getAlertConfig();
  const Icon = config.icon;

  return (
    <div className={`
      fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
      max-w-md w-full mx-4 rounded-lg border p-4
      ${config.bgColor} ${config.borderColor} ${getVariantClasses()}
      transition-all duration-300 ease-in-out
    `}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${config.textColor}`}>
            {message}
          </p>
          
          {/* Recording Status */}
          {state.recording.isRecording && variant === 'active' && (
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className={`text-xs ${config.textColor}`}>
                Recording in progress...
              </span>
            </div>
          )}
          
          {/* Alert Status */}
          {state.alerts.active && variant === 'active' && (
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-xs ${config.textColor}`}>
                Emergency contacts notified
              </span>
            </div>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Preset alert bar components
export function RecordingAlert({ onDismiss }) {
  const { state } = useAppContext();
  
  if (!state.recording.isRecording) return null;
  
  return (
    <AlertBar
      variant="active"
      type="warning"
      message="Recording active - Your interaction is being documented"
      onDismiss={onDismiss}
    />
  );
}

export function EmergencyAlert({ onDismiss }) {
  const { state } = useAppContext();
  
  if (!state.alerts.active) return null;
  
  return (
    <AlertBar
      variant="active"
      type="error"
      message="Emergency alert sent to trusted contacts"
      onDismiss={onDismiss}
    />
  );
}

export function LocationAlert({ onDismiss }) {
  const { state } = useAppContext();
  
  if (state.location.permission !== 'denied') return null;
  
  return (
    <AlertBar
      variant="inactive"
      type="warning"
      message="Location access denied. Some features may be limited."
      onDismiss={onDismiss}
      autoHide={true}
      duration={8000}
    />
  );
}

export function SuccessAlert({ message, onDismiss }) {
  return (
    <AlertBar
      variant="inactive"
      type="success"
      message={message}
      onDismiss={onDismiss}
      autoHide={true}
      duration={4000}
    />
  );
}

export function ErrorAlert({ message, onDismiss }) {
  return (
    <AlertBar
      variant="inactive"
      type="error"
      message={message}
      onDismiss={onDismiss}
      autoHide={true}
      duration={6000}
    />
  );
}
