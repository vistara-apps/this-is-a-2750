// State-specific legal information and rights data
// This would typically be stored in a database and updated by legal experts

export const STATE_LAWS_DATA = {
  'CA': {
    state_code: 'CA',
    state_name: 'California',
    rights_content: {
      constitutional_rights: [
        'You have the right to remain silent',
        'You have the right to refuse searches without a warrant',
        'You have the right to ask if you are free to leave',
        'You have the right to an attorney'
      ],
      what_to_say: [
        '"I am exercising my right to remain silent"',
        '"I do not consent to any searches"',
        '"Am I free to leave?"',
        '"I want to speak to an attorney"'
      ],
      what_not_to_say: [
        'Don\'t lie or provide false information',
        'Don\'t resist physically, even if you believe the stop is unlawful',
        'Don\'t argue about your rights at the scene',
        'Don\'t consent to searches'
      ],
      state_specific: [
        'California requires officers to inform you of the reason for the stop',
        'You can record police interactions in public spaces',
        'Officers must have reasonable suspicion to detain you',
        'You have the right to see a search warrant before allowing entry to your home'
      ]
    },
    scripts: {
      traffic_stop: {
        initial_response: 'Good [morning/afternoon/evening], officer. I understand you\'ve stopped me. Am I free to leave?',
        if_asked_questions: 'I am exercising my right to remain silent. I would like to speak to an attorney.',
        if_asked_to_search: 'I do not consent to any searches of my person or vehicle.',
        if_arrested: 'I am exercising my right to remain silent and I want an attorney present during any questioning.'
      },
      street_encounter: {
        initial_response: 'Hello, officer. Am I being detained or am I free to leave?',
        if_questioned: 'I prefer to exercise my right to remain silent.',
        if_asked_for_id: 'In California, I am only required to provide ID if I am lawfully detained or arrested.',
        if_searched: 'I do not consent to this search. I am not resisting, but I do not consent.'
      }
    }
  },
  'NY': {
    state_code: 'NY',
    state_name: 'New York',
    rights_content: {
      constitutional_rights: [
        'You have the right to remain silent',
        'You have the right to refuse searches without a warrant',
        'You have the right to ask if you are free to leave',
        'You have the right to an attorney'
      ],
      what_to_say: [
        '"I am exercising my right to remain silent"',
        '"I do not consent to any searches"',
        '"Am I free to leave?"',
        '"I want to speak to an attorney"'
      ],
      what_not_to_say: [
        'Don\'t lie or provide false information',
        'Don\'t resist physically',
        'Don\'t argue about your rights at the scene',
        'Don\'t consent to searches'
      ],
      state_specific: [
        'New York has "stop and frisk" laws - officers can pat you down for weapons with reasonable suspicion',
        'You must provide your name if lawfully detained',
        'Recording police is legal in public spaces',
        'Officers need probable cause for vehicle searches without consent'
      ]
    },
    scripts: {
      traffic_stop: {
        initial_response: 'Good [morning/afternoon/evening], officer. I understand you\'ve stopped me.',
        if_asked_questions: 'I am exercising my right to remain silent.',
        if_asked_to_search: 'I do not consent to any searches.',
        if_arrested: 'I want an attorney present during any questioning.'
      },
      street_encounter: {
        initial_response: 'Hello, officer. Am I being detained?',
        if_questioned: 'I prefer to exercise my right to remain silent.',
        if_asked_for_id: 'Here is my identification. Am I free to leave now?',
        if_searched: 'I do not consent to this search.'
      }
    }
  },
  'TX': {
    state_code: 'TX',
    state_name: 'Texas',
    rights_content: {
      constitutional_rights: [
        'You have the right to remain silent',
        'You have the right to refuse searches without a warrant',
        'You have the right to ask if you are free to leave',
        'You have the right to an attorney'
      ],
      what_to_say: [
        '"I am exercising my right to remain silent"',
        '"I do not consent to any searches"',
        '"Am I free to leave?"',
        '"I want to speak to an attorney"'
      ],
      what_not_to_say: [
        'Don\'t lie or provide false information',
        'Don\'t resist physically',
        'Don\'t argue about your rights at the scene',
        'Don\'t consent to searches'
      ],
      state_specific: [
        'Texas has "failure to identify" laws - you must provide your name if lawfully arrested',
        'Open carry is legal with proper licensing',
        'You must inform officers if you\'re carrying a weapon during traffic stops',
        'Recording police is legal in public spaces'
      ]
    },
    scripts: {
      traffic_stop: {
        initial_response: 'Good [morning/afternoon/evening], officer. I have a concealed carry license and I am/am not currently armed.',
        if_asked_questions: 'I am exercising my right to remain silent.',
        if_asked_to_search: 'I do not consent to any searches.',
        if_arrested: 'I want an attorney present during any questioning.'
      },
      street_encounter: {
        initial_response: 'Hello, officer. Am I being detained?',
        if_questioned: 'I prefer to exercise my right to remain silent.',
        if_asked_for_id: 'Am I being lawfully detained or arrested? If so, here is my identification.',
        if_searched: 'I do not consent to this search.'
      }
    }
  },
  'FL': {
    state_code: 'FL',
    state_name: 'Florida',
    rights_content: {
      constitutional_rights: [
        'You have the right to remain silent',
        'You have the right to refuse searches without a warrant',
        'You have the right to ask if you are free to leave',
        'You have the right to an attorney'
      ],
      what_to_say: [
        '"I am exercising my right to remain silent"',
        '"I do not consent to any searches"',
        '"Am I free to leave?"',
        '"I want to speak to an attorney"'
      ],
      what_not_to_say: [
        'Don\'t lie or provide false information',
        'Don\'t resist physically',
        'Don\'t argue about your rights at the scene',
        'Don\'t consent to searches'
      ],
      state_specific: [
        'Florida has "stop and identify" laws in certain circumstances',
        'Stand Your Ground laws apply to self-defense situations',
        'Recording police is legal in public spaces',
        'Officers need reasonable suspicion for investigative stops'
      ]
    },
    scripts: {
      traffic_stop: {
        initial_response: 'Good [morning/afternoon/evening], officer.',
        if_asked_questions: 'I am exercising my right to remain silent.',
        if_asked_to_search: 'I do not consent to any searches.',
        if_arrested: 'I want an attorney present during any questioning.'
      },
      street_encounter: {
        initial_response: 'Hello, officer. Am I being detained?',
        if_questioned: 'I prefer to exercise my right to remain silent.',
        if_asked_for_id: 'Am I required to provide identification?',
        if_searched: 'I do not consent to this search.'
      }
    }
  }
};

// Default/fallback rights information for states not specifically covered
export const DEFAULT_RIGHTS = {
  state_code: 'DEFAULT',
  state_name: 'United States',
  rights_content: {
    constitutional_rights: [
      'You have the right to remain silent (5th Amendment)',
      'You have the right to refuse searches without a warrant (4th Amendment)',
      'You have the right to ask if you are free to leave',
      'You have the right to an attorney (6th Amendment)'
    ],
    what_to_say: [
      '"I am exercising my right to remain silent"',
      '"I do not consent to any searches"',
      '"Am I free to leave?"',
      '"I want to speak to an attorney"'
    ],
    what_not_to_say: [
      'Don\'t lie or provide false information',
      'Don\'t resist physically, even if you believe the stop is unlawful',
      'Don\'t argue about your rights at the scene',
      'Don\'t consent to searches'
    ],
    state_specific: [
      'These are your federal constitutional rights',
      'State laws may vary - consult local legal resources',
      'Recording police is generally legal in public spaces',
      'Remain calm and comply with lawful orders'
    ]
  },
  scripts: {
    traffic_stop: {
      initial_response: 'Good [morning/afternoon/evening], officer.',
      if_asked_questions: 'I am exercising my right to remain silent.',
      if_asked_to_search: 'I do not consent to any searches.',
      if_arrested: 'I want an attorney present during any questioning.'
    },
    street_encounter: {
      initial_response: 'Hello, officer. Am I being detained?',
      if_questioned: 'I prefer to exercise my right to remain silent.',
      if_asked_for_id: 'Am I required to provide identification?',
      if_searched: 'I do not consent to this search.'
    }
  }
};

// US States list for state selector
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
];

// Service functions
export const getStateLaws = (stateCode) => {
  return STATE_LAWS_DATA[stateCode] || DEFAULT_RIGHTS;
};

export const getStateByCode = (stateCode) => {
  return US_STATES.find(state => state.code === stateCode);
};

export const detectStateFromLocation = async (latitude, longitude) => {
  try {
    // This would typically use a geocoding service
    // For demo purposes, we'll return a default state
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    
    if (response.ok) {
      const data = await response.json();
      const stateCode = data.principalSubdivision;
      return getStateByCode(stateCode);
    }
  } catch (error) {
    console.error('Failed to detect state from location:', error);
  }
  
  return null;
};

export const searchStates = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return US_STATES.filter(state => 
    state.name.toLowerCase().includes(lowercaseQuery) ||
    state.code.toLowerCase().includes(lowercaseQuery)
  );
};
