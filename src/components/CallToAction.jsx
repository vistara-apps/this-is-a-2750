import React from 'react';
import { ArrowRight, Shield, AlertTriangle, Crown, Zap } from 'lucide-react';

export default function CallToAction({ variant = 'primary', children, onClick, disabled = false, loading = false, icon, size = 'md', className = '' }) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300';
      case 'recordButton':
        return 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95';
      case 'accent':
        return 'bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl';
      case 'outline':
        return 'border-2 border-primary text-primary hover:bg-primary hover:text-white';
      case 'ghost':
        return 'text-primary hover:bg-primary/10';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl';
      default:
        return 'bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-3 text-base';
      case 'lg':
        return 'px-6 py-4 text-lg';
      case 'xl':
        return 'px-8 py-5 text-xl';
      default:
        return 'px-4 py-3 text-base';
    }
  };

  const getIconComponent = () => {
    if (loading) {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>;
    }
    
    if (icon) {
      const iconMap = {
        shield: Shield,
        alert: AlertTriangle,
        crown: Crown,
        zap: Zap,
        arrow: ArrowRight
      };
      const IconComponent = iconMap[icon] || ArrowRight;
      return <IconComponent className="w-4 h-4" />;
    }
    
    return null;
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-semibold rounded-lg transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()}
    >
      {getIconComponent()}
      {children}
    </button>
  );
}

// Preset CTA components for common use cases
export function PrimaryButton({ children, ...props }) {
  return (
    <CallToAction variant="primary" icon="arrow" {...props}>
      {children}
    </CallToAction>
  );
}

export function RecordButton({ children, isRecording, ...props }) {
  return (
    <CallToAction 
      variant="recordButton" 
      icon={isRecording ? null : "alert"}
      loading={isRecording}
      size="lg"
      className="w-full"
      {...props}
    >
      {isRecording ? 'Recording...' : (children || 'Start Recording')}
    </CallToAction>
  );
}

export function EmergencyButton({ children, ...props }) {
  return (
    <CallToAction 
      variant="danger" 
      icon="alert"
      size="lg"
      className="w-full animate-pulse"
      {...props}
    >
      {children || 'Emergency Alert'}
    </CallToAction>
  );
}

export function UpgradeButton({ children, ...props }) {
  return (
    <CallToAction 
      variant="accent" 
      icon="crown"
      {...props}
    >
      {children || 'Upgrade to Premium'}
    </CallToAction>
  );
}

export function QuickActionButton({ children, icon, ...props }) {
  return (
    <CallToAction 
      variant="outline" 
      icon={icon}
      size="sm"
      {...props}
    >
      {children}
    </CallToAction>
  );
}
