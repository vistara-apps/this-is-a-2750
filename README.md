# Pocket Protector

**Your Rights, Always in Hand.**

A mobile-first web application providing instant access to legal rights and safe interaction documentation tools for individuals interacting with law enforcement.

## 🚀 Features

### Core Features
- **Digital Rights Card**: Mobile-optimized, one-page digital card displaying fundamental rights during police stops
- **State-Specific Law Integration**: Automatically tailors rights and scripts based on user's location or selected state
- **One-Tap Safety Alert & Record**: Discreet button to instantly start recording and send alerts to trusted contacts
- **Automated Shareable Summary**: Generates concise, shareable summaries of interactions

### Advanced Features
- **Multi-language Support**: English and Spanish translations
- **AI-Powered Content**: Dynamic rights content generation using OpenAI
- **Decentralized Storage**: IPFS storage for recordings via Pinata
- **Subscription Management**: Stripe integration for premium features
- **Real-time Alerts**: Instant notifications to trusted contacts

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: React Context API
- **APIs**: OpenAI, Supabase, Pinata (IPFS), Stripe
- **Icons**: Lucide React
- **Deployment**: Docker ready

## 📋 Prerequisites

- Node.js 18+ and npm
- API keys for:
  - OpenAI (for AI-generated content)
  - Supabase (backend services)
  - Pinata (IPFS storage)
  - Stripe (payments)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/vistara-apps/this-is-a-2750.git
cd this-is-a-2750
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── AlertSystem.jsx     # Emergency alert system
│   ├── AlertBar.jsx        # Status notifications
│   ├── CallToAction.jsx    # Reusable button components
│   ├── ContactPicker.jsx   # Trusted contacts management
│   ├── DigitalCardEnhanced.jsx  # Enhanced rights card
│   └── ...
├── context/            # React Context providers
│   └── AppContext.jsx     # Global app state
├── services/           # API services
│   ├── api.js            # API clients (OpenAI, Supabase, etc.)
│   └── stateLaws.js      # State-specific legal data
└── utils/              # Utility functions
    └── helpers.js        # Common helper functions
```

## 🔧 API Configuration

### OpenAI Setup
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env` as `VITE_OPENAI_API_KEY`

### Supabase Setup
1. Create project at [Supabase](https://supabase.com/)
2. Set up database tables:
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     subscription_status TEXT DEFAULT 'free',
     preferred_language TEXT DEFAULT 'en',
     trusted_contacts JSONB DEFAULT '[]'::jsonb
   );

   -- Recordings table
   CREATE TABLE recordings (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id),
     start_time TIMESTAMP,
     end_time TIMESTAMP,
     duration INTEGER,
     file_url TEXT,
     location_data JSONB,
     interaction_type TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- State Laws table
   CREATE TABLE state_laws (
     state_code TEXT PRIMARY KEY,
     rights_content JSONB,
     scripts JSONB,
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

### Pinata Setup
1. Create account at [Pinata](https://pinata.cloud/)
2. Generate API keys
3. Add to `.env`

### Stripe Setup
1. Create account at [Stripe](https://stripe.com/)
2. Get publishable key from dashboard
3. Set up webhook endpoints for subscription management

## 🎨 Design System

The app uses a consistent design system with:
- **Colors**: Primary blue, accent teal, semantic colors
- **Typography**: Clean, readable fonts
- **Spacing**: 8px grid system
- **Components**: Modular, reusable components

## 📱 Mobile-First Design

- Responsive design optimized for mobile devices
- Touch-friendly interface
- Offline-capable PWA features
- Fast loading and smooth animations

## 🔒 Security & Privacy

- Client-side encryption for sensitive data
- IPFS storage for decentralized recording storage
- No tracking or analytics by default
- Secure API key management

## 🚀 Deployment

### Docker Deployment
```bash
docker build -t pocket-protector .
docker run -p 3000:3000 pocket-protector
```

### Manual Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

## 📊 Business Model

- **Freemium**: Basic rights access and limited recording
- **Premium ($4.99/month)**: Unlimited recording storage, advanced analytics, live alerts
- **Basic ($1.99/month)**: Basic rights access and limited recording

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@pocketprotector.app or create an issue in this repository.

## 🗺 Roadmap

- [ ] iOS/Android mobile apps
- [ ] Advanced AI legal advice
- [ ] Integration with legal aid organizations
- [ ] Multi-language expansion
- [ ] Blockchain integration for evidence verification

---

**Disclaimer**: This app provides general information about legal rights and is not a substitute for professional legal advice. Always consult with a qualified attorney for specific legal situations.
