import React, { useState, useEffect } from 'react';
import { Crown, Check, X, CreditCard, AlertCircle, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { stripeService } from '../services/api';
import { UpgradeButton, CallToAction } from './CallToAction';

const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Basic rights information',
      'State-specific guidance',
      'Limited recording (5 minutes)',
      'Basic scripts'
    ],
    limitations: [
      'No cloud storage',
      'No emergency alerts',
      'No premium support'
    ]
  },
  basic: {
    name: 'Basic',
    price: 1.99,
    features: [
      'Everything in Free',
      'Extended recording (30 minutes)',
      'Emergency alerts to 3 contacts',
      'Cloud storage (100MB)',
      'Email support'
    ],
    limitations: [
      'Limited analytics',
      'No live alerts',
      'No priority support'
    ]
  },
  premium: {
    name: 'Premium',
    price: 4.99,
    features: [
      'Everything in Basic',
      'Unlimited recording',
      'Unlimited emergency contacts',
      'Live alerts with GPS tracking',
      'Advanced analytics',
      'Priority support',
      'Legal resource library',
      'Multi-language support'
    ],
    limitations: []
  }
};

export default function SubscriptionManager() {
  const { state, dispatch } = useAppContext();
  const [selectedPlan, setSelectedPlan] = useState(state.user.subscription || 'free');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentPlan = SUBSCRIPTION_PLANS[state.user.subscription || 'free'];

  const handleUpgrade = async (planType) => {
    if (planType === 'free') return;

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      // In a real implementation, this would:
      // 1. Create a Stripe checkout session
      // 2. Redirect to Stripe checkout
      // 3. Handle the webhook response
      
      // For demo purposes, we'll simulate the upgrade
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful upgrade
      dispatch({
        type: 'UPDATE_USER_SUBSCRIPTION',
        payload: planType
      });
      
      setSuccess(`Successfully upgraded to ${SUBSCRIPTION_PLANS[planType].name} plan!`);
    } catch (err) {
      setError('Failed to process upgrade. Please try again.');
      console.error('Subscription error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (state.user.subscription === 'free') return;

    setIsProcessing(true);
    setError('');

    try {
      // In a real implementation, this would call Stripe to cancel the subscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      dispatch({
        type: 'UPDATE_USER_SUBSCRIPTION',
        payload: 'free'
      });
      
      setSuccess('Subscription cancelled successfully. You can continue using the free plan.');
    } catch (err) {
      setError('Failed to cancel subscription. Please contact support.');
      console.error('Cancellation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const PlanCard = ({ planKey, plan, isCurrent, isSelected }) => (
    <div className={`relative p-6 rounded-xl border-2 transition-all ${
      isCurrent 
        ? 'border-accent bg-accent/5' 
        : isSelected 
        ? 'border-primary bg-primary/5' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium">
            Current Plan
          </span>
        </div>
      )}
      
      {planKey === 'premium' && (
        <div className="absolute -top-3 right-4">
          <Star className="w-6 h-6 text-yellow-500 fill-current" />
        </div>
      )}

      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
          {plan.price > 0 && <span className="text-gray-600">/month</span>}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
        
        {plan.limitations.map((limitation, index) => (
          <div key={index} className="flex items-start gap-2">
            <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-500">{limitation}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {!isCurrent && planKey !== 'free' && (
          <UpgradeButton
            onClick={() => handleUpgrade(planKey)}
            disabled={isProcessing}
            loading={isProcessing && selectedPlan === planKey}
            className="w-full"
          >
            {isProcessing && selectedPlan === planKey ? 'Processing...' : `Upgrade to ${plan.name}`}
          </UpgradeButton>
        )}
        
        {isCurrent && planKey !== 'free' && (
          <CallToAction
            variant="outline"
            onClick={handleCancelSubscription}
            disabled={isProcessing}
            className="w-full"
          >
            Cancel Subscription
          </CallToAction>
        )}
        
        {planKey === 'free' && !isCurrent && (
          <CallToAction
            variant="secondary"
            onClick={() => handleUpgrade('free')}
            className="w-full"
          >
            Downgrade to Free
          </CallToAction>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
        </div>
        <p className="text-gray-600">Choose the plan that works best for you</p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Success</span>
          </div>
          <p className="text-green-700 mt-1">{success}</p>
        </div>
      )}

      {/* Current Plan Status */}
      <div className="bg-white rounded-xl p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Current Plan</h3>
            <p className="text-gray-600">{currentPlan.name} - ${currentPlan.price}/month</p>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-accent" />
            <span className="font-medium text-accent">{currentPlan.name}</span>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(SUBSCRIPTION_PLANS).map(([planKey, plan]) => (
          <PlanCard
            key={planKey}
            planKey={planKey}
            plan={plan}
            isCurrent={planKey === (state.user.subscription || 'free')}
            isSelected={planKey === selectedPlan}
          />
        ))}
      </div>

      {/* Features Comparison */}
      <div className="bg-white rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Comparison</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-900">Feature</th>
                <th className="text-center py-2 font-medium text-gray-900">Free</th>
                <th className="text-center py-2 font-medium text-gray-900">Basic</th>
                <th className="text-center py-2 font-medium text-gray-900">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 text-gray-700">Recording Duration</td>
                <td className="py-3 text-center">5 minutes</td>
                <td className="py-3 text-center">30 minutes</td>
                <td className="py-3 text-center">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">Emergency Contacts</td>
                <td className="py-3 text-center">-</td>
                <td className="py-3 text-center">3</td>
                <td className="py-3 text-center">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">Cloud Storage</td>
                <td className="py-3 text-center">-</td>
                <td className="py-3 text-center">100MB</td>
                <td className="py-3 text-center">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">Live GPS Alerts</td>
                <td className="py-3 text-center">-</td>
                <td className="py-3 text-center">-</td>
                <td className="py-3 text-center">✓</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">Priority Support</td>
                <td className="py-3 text-center">-</td>
                <td className="py-3 text-center">-</td>
                <td className="py-3 text-center">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Security */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Secure Payment</span>
        </div>
        <p className="text-sm text-gray-600">
          All payments are processed securely through Stripe. Your payment information is never stored on our servers.
        </p>
      </div>
    </div>
  );
}
