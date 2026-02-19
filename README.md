# **Wearorithm**  
*AI-Powered Fashion Intelligence Platform*

---


## 💡 **Problem Statement**
Fashion decisions are overwhelming and time-consuming. Users struggle with outfit coordination, lack confidence in their style choices, and waste time searching through wardrobe items without intelligent guidance. Traditional fashion apps offer generic advice without personalization or AI-driven insights.

## 🎯 **Solution**
Wearorithm leverages cutting-edge AI to deliver personalized outfit recommendations, real-time style analysis, and intelligent wardrobe management. By combining computer vision with user preference learning, we transform how people approach fashion—making style decisions confident, efficient, and data-driven.

## 👥 **Target Users**
- **Fashion-conscious individuals** seeking personalized styling assistance
- **Busy professionals** optimizing their daily outfit choices
- **Style enthusiasts** wanting to track and improve their fashion journey
- **Wardrobe managers** looking to maximize clothing utilization

---

## 🛠 **Technology Stack**

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 18.3.1 + TypeScript | Modern, type-safe UI development |
| | Vite 5.4.20 | Lightning-fast build tool & HMR |
| | Tailwind CSS + shadcn/ui | Professional design system |
| | TanStack Query | Optimistic updates & caching |
| **Backend** | Node.js + Express 4.21.2 | Scalable API server |
| | TypeScript | End-to-end type safety |
| | JWT + bcrypt | Secure authentication |
| **Database** | Neon PostgreSQL | Serverless, scalable data storage |
| | Drizzle ORM | Type-safe database operations |
| **AI/ML** | Google Gemini AI | Computer vision & NLP |
| **DevOps** | Docker-ready | Containerized deployment |

---

## 🏗 **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │  Express API    │    │  Neon Database  │
│                 │    │                 │    │                 │
│ • User Interface│◄──►│ • RESTful APIs  │◄──►│ • User Data     │
│ • State Mgmt    │    │ • Auth Middleware│    │ • Outfits       │
│ • Client Cache  │    │ • File Upload   │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Google Gemini  │
                       │                 │
                       │ • Image Analysis│
                       │ • Recommendations│
                       │ • Color Intelligence│
                       └─────────────────┘
```

---

## ✨ **Key Features**

### 🎨 **AI-Powered Style Analysis**
- **Computer Vision**: Real-time outfit suitability scoring
- **Color Intelligence**: Dominant color extraction & complementary suggestions
- **Style Matching**: Occasion and mood-based recommendations

### 👤 **Personalized Style Profiles**
- **Preference Learning**: Adaptive style preference tracking
- **Body Type Analysis**: Customized recommendations based on fit
- **Occasion Intelligence**: Context-aware outfit suggestions

### 📚 **Smart Wardrobe Management**
- **Digital Inventory**: Comprehensive clothing catalog
- **Outfit Generation**: AI-powered combination suggestions
- **Usage Analytics**: Track wardrobe utilization patterns

### 🔒 **Enterprise-Grade Security**
- **JWT Authentication**: Secure token-based auth
- **Password Encryption**: bcrypt hashing with salt rounds
- **Input Validation**: Zod schema validation throughout

---

## 🚀 **Installation**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL 14+
- Google Gemini API key

### **Setup Steps**

```bash
# Clone the repository
git clone https://github.com/madhuri-perumalla/Wearorithm.git
cd wearorithm

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run db:push

# Start development server
npm run dev
```

---

## 🔧 **Environment Variables**

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
BCRYPT_ROUNDS="12"

# AI Services
GEMINI_API_KEY="your-gemini-api-key"

# Application
NODE_ENV="development"
PORT="5000"
```

---

## 🔌 **API Integration**

### **Google Gemini AI Integration**
```typescript
// Outfit Analysis Endpoint
POST /api/analyze-outfit
{
  "imageUrl": "base64-encoded-image",
  "preferences": {
    "style": "casual",
    "occasion": "work"
  }
}

// Response
{
  "suitability": 85,
  "feedback": "Great color coordination!",
  "suggestions": ["Add accessories", "Try different shoes"],
  "colorAnalysis": {
    "dominantColors": ["#2C3E50", "#E74C3C"],
    "complementaryColors": ["#F39C12", "#27AE60"]
  }
}
```

---

## 📁 **Folder Structure**

```
wearorithm/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── routes/            # API route handlers
│   ├── middleware/        # Custom middleware
│   └── services/          # Business logic
├── shared/                # Shared TypeScript types
└── docs/                  # Documentation
```

---

## 🚀 **Deployment**

### **Production Deployment**

```bash
# Build for production
npm run build

# Start production server
npm start
```

### **Docker Deployment**
```dockerfile
# Dockerfile included for containerized deployment
docker build -t wearorithm .
docker run -p 5000:5000 wearorithm
```

### **Environment Setup**
- **Frontend**: Deploy on Vercel/Netlify
- **Backend**: Deploy on Railway/Heroku
- **Database**: Neon PostgreSQL (serverless)

---

## 🗺 **Future Roadmap**

### **Phase 2: Enhanced AI**
- [ ] Real-time outfit try-on using AR
- [ ] Social style sharing and community features
- [ ] Integration with fashion e-commerce platforms

### **Phase 3: Mobile Applications**
- [ ] React Native iOS/Android apps
- [ ] Offline mode with local AI models
- [ ] Push notifications for style recommendations

### **Phase 4: Enterprise Features**
- [ ] B2B fashion consulting tools
- [ ] Analytics dashboard for fashion brands
- [ ] API marketplace for third-party integrations

---

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript strict mode
- Write comprehensive tests
- Maintain code coverage >80%
- Use conventional commit messages

---



<div align="center">

**🎯 Built with passion for fashion and technology**

*© 2026 Wearorithm. All rights reserved.*

</div>
