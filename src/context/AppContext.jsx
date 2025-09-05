import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  user: {
    id: null,
    email: '',
    subscription: 'free',
    preferredLanguage: 'en',
    trustedContacts: [],
    selectedState: null,
  },
  recording: {
    isRecording: false,
    currentRecording: null,
    recordings: [],
  },
  location: {
    current: null,
    permission: 'prompt',
  },
  alerts: {
    active: false,
    sent: [],
  },
  ui: {
    activeTab: 'rights',
    showOnboarding: true,
  },
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER_STATE':
      return {
        ...state,
        user: { ...state.user, selectedState: action.payload }
      };
    case 'SET_TRUSTED_CONTACTS':
      return {
        ...state,
        user: { ...state.user, trustedContacts: action.payload }
      };
    case 'START_RECORDING':
      return {
        ...state,
        recording: {
          ...state.recording,
          isRecording: true,
          currentRecording: {
            id: Date.now().toString(),
            startTime: new Date(),
            location: state.location.current,
          }
        }
      };
    case 'STOP_RECORDING':
      const newRecording = {
        ...state.recording.currentRecording,
        endTime: new Date(),
        duration: Date.now() - new Date(state.recording.currentRecording.startTime).getTime(),
      };
      return {
        ...state,
        recording: {
          isRecording: false,
          currentRecording: null,
          recordings: [...state.recording.recordings, newRecording],
        }
      };
    case 'SET_LOCATION':
      return {
        ...state,
        location: { ...state.location, current: action.payload }
      };
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        ui: { ...state.ui, activeTab: action.payload }
      };
    case 'SEND_ALERT':
      return {
        ...state,
        alerts: {
          active: true,
          sent: [...state.alerts.sent, {
            id: Date.now().toString(),
            timestamp: new Date(),
            location: state.location.current,
            contacts: action.payload.contacts,
          }]
        }
      };
    case 'DISMISS_ONBOARDING':
      return {
        ...state,
        ui: { ...state.ui, showOnboarding: false }
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Get user location on app load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch({
            type: 'SET_LOCATION',
            payload: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date(),
            }
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}