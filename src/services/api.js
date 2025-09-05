// API Configuration and Base Service
const API_CONFIG = {
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  PINATA_API_KEY: import.meta.env.VITE_PINATA_API_KEY,
  PINATA_SECRET_KEY: import.meta.env.VITE_PINATA_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
};

// Base API client with error handling
class ApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

// OpenAI Service
export class OpenAIService {
  constructor() {
    this.client = new ApiClient('https://api.openai.com/v1', {
      'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
    });
  }

  async generateRightsContent(state, scenario = 'traffic_stop') {
    try {
      const prompt = `Generate a concise, accurate "Know Your Rights" card for ${state} during a ${scenario}. Include:
      1. Key constitutional rights
      2. What to say (3-4 short phrases)
      3. What NOT to say (3-4 things to avoid)
      4. State-specific considerations for ${state}
      
      Format as JSON with keys: rights, whatToSay, whatNotToSay, stateSpecific`;

      const response = await this.client.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a legal expert specializing in constitutional rights and police interactions. Provide accurate, practical advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate rights content');
    }
  }

  async translateContent(content, targetLanguage = 'es') {
    try {
      const response = await this.client.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Translate the following legal rights content to ${targetLanguage}. Maintain accuracy and legal precision.`
          },
          {
            role: 'user',
            content: JSON.stringify(content)
          }
        ],
        max_tokens: 1000,
        temperature: 0.1,
      });

      const translatedContent = response.choices[0].message.content;
      return JSON.parse(translatedContent);
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate content');
    }
  }
}

// Supabase Service
export class SupabaseService {
  constructor() {
    this.client = new ApiClient(API_CONFIG.SUPABASE_URL, {
      'apikey': API_CONFIG.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
    });
  }

  // User Management
  async createUser(userData) {
    try {
      const response = await this.client.post('/rest/v1/users', userData);
      return response;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await this.client.put(`/rest/v1/users?id=eq.${userId}`, userData);
      return response;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  async getUser(userId) {
    try {
      const response = await this.client.get(`/rest/v1/users?id=eq.${userId}`);
      return response[0];
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  }

  // Recording Management
  async saveRecording(recordingData) {
    try {
      const response = await this.client.post('/rest/v1/recordings', recordingData);
      return response;
    } catch (error) {
      console.error('Failed to save recording:', error);
      throw error;
    }
  }

  async getRecordings(userId) {
    try {
      const response = await this.client.get(`/rest/v1/recordings?user_id=eq.${userId}&order=created_at.desc`);
      return response;
    } catch (error) {
      console.error('Failed to get recordings:', error);
      throw error;
    }
  }

  async deleteRecording(recordingId) {
    try {
      const response = await this.client.delete(`/rest/v1/recordings?id=eq.${recordingId}`);
      return response;
    } catch (error) {
      console.error('Failed to delete recording:', error);
      throw error;
    }
  }

  // State Laws
  async getStateLaws(stateCode) {
    try {
      const response = await this.client.get(`/rest/v1/state_laws?state_code=eq.${stateCode}`);
      return response[0];
    } catch (error) {
      console.error('Failed to get state laws:', error);
      throw error;
    }
  }
}

// Pinata Service (IPFS Storage)
export class PinataService {
  constructor() {
    this.client = new ApiClient('https://api.pinata.cloud', {
      'pinata_api_key': API_CONFIG.PINATA_API_KEY,
      'pinata_secret_api_key': API_CONFIG.PINATA_SECRET_KEY,
    });
  }

  async uploadFile(file, metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (metadata.name) {
        formData.append('pinataMetadata', JSON.stringify({
          name: metadata.name,
          keyvalues: metadata.keyvalues || {}
        }));
      }

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': API_CONFIG.PINATA_API_KEY,
          'pinata_secret_api_key': API_CONFIG.PINATA_SECRET_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to upload to IPFS:', error);
      throw error;
    }
  }

  async uploadJSON(jsonData, metadata = {}) {
    try {
      const response = await this.client.post('/pinning/pinJSONToIPFS', {
        pinataContent: jsonData,
        pinataMetadata: {
          name: metadata.name || 'JSON Data',
          keyvalues: metadata.keyvalues || {}
        }
      });

      return response;
    } catch (error) {
      console.error('Failed to upload JSON to IPFS:', error);
      throw error;
    }
  }

  async getFile(ipfsHash) {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      return response;
    } catch (error) {
      console.error('Failed to retrieve from IPFS:', error);
      throw error;
    }
  }

  async unpinFile(ipfsHash) {
    try {
      const response = await this.client.delete(`/pinning/unpin/${ipfsHash}`);
      return response;
    } catch (error) {
      console.error('Failed to unpin from IPFS:', error);
      throw error;
    }
  }
}

// Stripe Service
export class StripeService {
  constructor() {
    this.publishableKey = API_CONFIG.STRIPE_PUBLISHABLE_KEY;
  }

  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      // This would typically be called from your backend
      // For demo purposes, we'll simulate the response
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  async createSubscription(customerId, priceId) {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          price_id: priceId,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch(`/api/cancel-subscription/${subscriptionId}`, {
        method: 'DELETE',
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    }
  }
}

// Service instances
export const openAIService = new OpenAIService();
export const supabaseService = new SupabaseService();
export const pinataService = new PinataService();
export const stripeService = new StripeService();

// Utility functions
export const isApiConfigured = () => {
  return !!(
    API_CONFIG.OPENAI_API_KEY &&
    API_CONFIG.SUPABASE_URL &&
    API_CONFIG.SUPABASE_ANON_KEY
  );
};

export const getApiStatus = () => {
  return {
    openai: !!API_CONFIG.OPENAI_API_KEY,
    supabase: !!(API_CONFIG.SUPABASE_URL && API_CONFIG.SUPABASE_ANON_KEY),
    pinata: !!(API_CONFIG.PINATA_API_KEY && API_CONFIG.PINATA_SECRET_KEY),
    stripe: !!API_CONFIG.STRIPE_PUBLISHABLE_KEY,
  };
};
