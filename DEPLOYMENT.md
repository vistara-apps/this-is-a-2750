# Pocket Protector - Deployment Guide

This guide covers the complete deployment process for the Pocket Protector application.

## 🚀 Production Deployment Checklist

### 1. Environment Setup

#### Required API Keys
- [ ] **OpenAI API Key** - For AI-generated legal content
- [ ] **Supabase Project** - Backend database and authentication
- [ ] **Pinata API Keys** - IPFS storage for recordings
- [ ] **Stripe Keys** - Payment processing

#### Environment Variables
Create a `.env` file with the following variables:

```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-...

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Pinata IPFS Configuration
VITE_PINATA_API_KEY=your-api-key
VITE_PINATA_SECRET_KEY=your-secret-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App Configuration
VITE_APP_NAME=Pocket Protector
VITE_APP_VERSION=1.0.0
```

### 2. Database Setup (Supabase)

#### Create Tables
Run the following SQL in your Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_status TEXT DEFAULT 'free',
  preferred_language TEXT DEFAULT 'en',
  trusted_contacts JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recordings table
CREATE TABLE recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  file_url TEXT,
  location_data JSONB,
  interaction_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- State Laws table
CREATE TABLE state_laws (
  state_code TEXT PRIMARY KEY,
  state_name TEXT NOT NULL,
  rights_content JSONB NOT NULL,
  scripts JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_recordings_user_id ON recordings(user_id);
CREATE INDEX idx_recordings_created_at ON recordings(created_at DESC);
CREATE INDEX idx_users_email ON users(email);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own recordings" ON recordings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recordings" ON recordings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recordings" ON recordings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recordings" ON recordings
  FOR DELETE USING (auth.uid() = user_id);

-- Public access to state laws
CREATE POLICY "Anyone can view state laws" ON state_laws
  FOR SELECT TO public USING (true);
```

#### Populate State Laws Data
```sql
-- Insert initial state laws data
INSERT INTO state_laws (state_code, state_name, rights_content, scripts) VALUES
('CA', 'California', 
  '{"constitutional_rights": ["You have the right to remain silent", "You have the right to refuse searches without a warrant", "You have the right to ask if you are free to leave", "You have the right to an attorney"], "what_to_say": ["I am exercising my right to remain silent", "I do not consent to any searches", "Am I free to leave?", "I want to speak to an attorney"], "what_not_to_say": ["Don''t lie or provide false information", "Don''t resist physically", "Don''t argue about your rights at the scene", "Don''t consent to searches"], "state_specific": ["California requires officers to inform you of the reason for the stop", "You can record police interactions in public spaces", "Officers must have reasonable suspicion to detain you"]}',
  '{"traffic_stop": {"initial_response": "Good [morning/afternoon/evening], officer. I understand you''ve stopped me. Am I free to leave?", "if_asked_questions": "I am exercising my right to remain silent. I would like to speak to an attorney.", "if_asked_to_search": "I do not consent to any searches of my person or vehicle.", "if_arrested": "I am exercising my right to remain silent and I want an attorney present during any questioning."}, "street_encounter": {"initial_response": "Hello, officer. Am I being detained or am I free to leave?", "if_questioned": "I prefer to exercise my right to remain silent.", "if_asked_for_id": "In California, I am only required to provide ID if I am lawfully detained or arrested.", "if_searched": "I do not consent to this search. I am not resisting, but I do not consent."}}');

-- Add more states as needed...
```

### 3. Stripe Setup

#### Create Products and Prices
1. Log into Stripe Dashboard
2. Create products:
   - **Basic Plan**: $1.99/month
   - **Premium Plan**: $4.99/month

#### Webhook Configuration
Set up webhooks for:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 4. Build and Deploy

#### Option A: Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Option B: Netlify Deployment
```bash
# Build the project
npm run build

# Deploy dist/ folder to Netlify
```

#### Option C: Docker Deployment
```bash
# Build Docker image
docker build -t pocket-protector .

# Run container
docker run -p 3000:3000 --env-file .env pocket-protector
```

#### Option D: Traditional Hosting
```bash
# Build for production
npm run build

# Upload dist/ folder to your web server
```

### 5. Domain and SSL

#### Custom Domain Setup
1. Point your domain to your hosting provider
2. Configure SSL certificate (Let's Encrypt recommended)
3. Update CORS settings in Supabase for your domain

#### Security Headers
Add these headers to your web server:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://*.supabase.co https://api.pinata.cloud https://api.stripe.com;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### 6. Monitoring and Analytics

#### Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage analytics

#### Performance Monitoring
- Lighthouse CI for performance monitoring
- Web Vitals tracking
- API response time monitoring

### 7. Legal Compliance

#### Privacy Policy
- Update privacy policy for data collection
- GDPR compliance if serving EU users
- CCPA compliance for California users

#### Terms of Service
- Legal disclaimer about app not being legal advice
- User responsibilities and limitations
- Subscription terms and cancellation policy

### 8. Testing in Production

#### Pre-Launch Checklist
- [ ] All API integrations working
- [ ] Payment processing functional
- [ ] Recording and storage working
- [ ] Emergency alerts sending
- [ ] State-specific content loading
- [ ] Mobile responsiveness verified
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] SSL certificate active
- [ ] Error tracking configured

#### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test config
# Run load tests on critical endpoints
```

### 9. Backup and Recovery

#### Database Backups
- Configure automatic Supabase backups
- Test restore procedures
- Document recovery processes

#### File Storage Backups
- IPFS provides natural redundancy
- Consider additional backup strategies for critical recordings

### 10. Maintenance

#### Regular Updates
- Monitor dependency vulnerabilities
- Update API integrations as needed
- Review and update legal content
- Performance optimization

#### User Support
- Set up support email system
- Create FAQ documentation
- Monitor user feedback and issues

## 🔧 Troubleshooting

### Common Issues

#### API Key Issues
- Verify all environment variables are set
- Check API key permissions and quotas
- Ensure keys are for the correct environment (test vs production)

#### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Ensure database tables exist

#### Payment Issues
- Verify Stripe webhook endpoints
- Check webhook signing secrets
- Test payment flows in Stripe test mode first

#### Recording Issues
- Verify browser permissions for microphone/camera
- Check IPFS upload functionality
- Test file size limits

### Performance Optimization

#### Frontend Optimization
- Enable gzip compression
- Optimize images and assets
- Implement code splitting
- Use service workers for caching

#### API Optimization
- Implement request caching
- Optimize database queries
- Use CDN for static assets
- Monitor API response times

## 📞 Support

For deployment support:
- Email: support@pocketprotector.app
- Documentation: [Link to docs]
- Community: [Link to community forum]

---

**Note**: This deployment guide assumes production-ready infrastructure. Always test thoroughly in a staging environment before deploying to production.
