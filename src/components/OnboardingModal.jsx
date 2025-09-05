import React, { useState } from 'react';
import { Shield, Users, Video, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const onboardingSteps = [
  {
    icon: Shield,
    title: 'Know Your Rights',
    description: 'Access state-specific legal rights and scripts for police interactions. Stay informed and prepared.',
    color: 'text-blue-500'
  },
  {
    icon: Video,
    title: 'One-Tap Recording',
    description: 'Quickly start audio or video recording to document interactions. Your safety is our priority.',
    color: 'text-red-500'
  },
  {
    icon: Users,
    title: 'Alert Trusted Contacts',
    description: 'Automatically notify your trusted contacts when recording starts. Never face situations alone.',
    color: 'text-green-500'
  },
  {
    icon: FileText,
    title: 'Generate Summaries',
    description: 'Create shareable summaries of your interactions for legal documentation and advocacy.',
    color: 'text-purple-500'
  }
];

export default function OnboardingModal() {
  const { dispatch } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      dispatch({ type: 'DISMISS_ONBOARDING' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    dispatch({ type: 'DISMISS_ONBOARDING' });
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center ${step.color}`}>
            <Icon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-accent' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="p-4 bg-gray-50 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Skip
          </button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              <span className="text-sm font-medium">
                {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              </span>
              {currentStep < onboardingSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}