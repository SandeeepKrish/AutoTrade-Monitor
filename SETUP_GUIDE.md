# 🚀 Stock Auto-Cart Dashboard - Setup Guide

## 📋 Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: 18 or higher
- **MongoDB**: Local installation or MongoDB Atlas account
- **Git**: For version control

---

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

**Option A: Use existing requirements.txt**
```bash
pip install -r requirements.txt
```

**Option B: Use updated requirements (recommended)**
```bash
pip install -r requirements_updated.txt
```

**Option C: Install individually**
```bash
pip install fastapi uvicorn[standard] pydantic python-jose passlib[bcrypt]
pip install motor dnspython websockets requests
pip install yfinance nsepython pandas numpy
pip install python-dotenv apscheduler
```

### 4. Configure Environment Variables

Create `.env` file in `backend/` directory:
```bash
cp .env.example .env
```

Edit `.env`:
```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/stockdb
# OR use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/stockdb

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-change-this-to-random-string
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Frontend Origin (for CORS)
FRONTEND_ORIGIN=http://localhost:5173

# Stock API Keys (if using paid APIs)
# ALPHA_VANTAGE_API_KEY=your-key-here
# ZERODHA_API_KEY=your-key-here
# ZERODHA_API_SECRET=your-secret-here
```

### 5. Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
net start MongoDB

# Linux
sudo systemctl start mongod

# Mac
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### 6. Run Backend Server
```bash
# From backend directory
python -m uvicorn app.main:app --reload --port 8000
```

**Verify Backend:**
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies

**Option A: Use existing package.json**
```bash
npm install
```

**Option B: Use updated package.json (recommended)**
```bash
# Backup current package.json
cp package.json package.json.backup

# Copy updated version
cp package_updated.json package.json

# Install
npm install
```

**Option C: Install additional packages manually**
```bash
npm install
npm install lucide-react react-hot-toast framer-motion socket.io-client
```

### 3. Configure API Endpoint

Create `.env` file in `frontend/` directory:
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

Update `src/api/` files to use this:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

### 4. Run Frontend Development Server
```bash
npm run dev
```

**Verify Frontend:**
- App: http://localhost:5173

---

## 🧪 Testing the Application

### 1. Register a New User
1. Go to http://localhost:5173
2. Click "Register"
3. Create account with email and password

### 2. Login
1. Login with your credentials
2. You'll be redirected to Dashboard

### 3. View Stocks
- Dashboard shows all available stocks
- Currently using demo data (3 stocks)

### 4. Set Price Range Rule
**Using API (Swagger Docs):**
1. Go to http://localhost:8000/docs
2. Click "Authorize" and enter your JWT token
3. Use `/api/rules/` POST endpoint
4. Create a rule:
```json
{
  "symbol": "RELIANCE",
  "min_price": 2750,
  "max_price": 2850
}
```

### 5. Watch Automation
- Backend checks prices every 5 seconds
- When RELIANCE price is between 2750-2850, it auto-adds to cart
- Check cart page to see auto-added stocks

---

## 🔄 Upgrading to Real Stock Data

### Option 1: Yahoo Finance (Free, Recommended)

**1. Install yfinance:**
```bash
pip install yfinance
```

**2. Replace stock_fetcher.py:**
```bash
# Backup current file
cp app/services/stock_fetcher.py app/services/stock_fetcher_backup.py

# Use improved version
cp app/services/stock_fetcher_improved.py app/services/stock_fetcher.py
```

**3. Restart backend:**
```bash
python -m uvicorn app.main:app --reload --port 8000
```

**4. Test:**
- Yahoo Finance will fetch real NSE stock prices
- Stocks will have `.NS` suffix (e.g., RELIANCE.NS)

### Option 2: NSE Python (Free, Indian Market)

**1. Install nsepython:**
```bash
pip install nsepython
```

**2. Same steps as Option 1**

**3. NSE Python provides:**
- Real-time NSE prices
- No API key needed
- Indian market specific

### Option 3: Alpha Vantage (Free Tier)

**1. Get API Key:**
- Sign up at https://www.alphavantage.co/support/#api-key
- Free tier: 5 API calls/minute

**2. Install:**
```bash
pip install alpha-vantage
```

**3. Add to .env:**
```env
ALPHA_VANTAGE_API_KEY=your-api-key
```

**4. Update stock_fetcher.py** to use Alpha Vantage

---

## 📊 Adding More Stocks

### Method 1: Update DEMO_STOCKS

Edit `backend/app/models/stock.py`:
```python
DEMO_STOCKS: list[Stock] = [
    Stock(symbol="RELIANCE", name="Reliance Industries", price=2800, change=0.8),
    Stock(symbol="TCS", name="TCS", price=3900, change=-0.4),
    Stock(symbol="HDFCBANK", name="HDFC Bank", price=1550, change=1.1),
    # Add more stocks here
    Stock(symbol="INFY", name="Infosys", price=1450, change=1.2),
    Stock(symbol="WIPRO", name="Wipro", price=420, change=0.5),
    # ... add all NSE stocks
]
```

### Method 2: Load from Database

Create a stocks collection in MongoDB:
```javascript
// In MongoDB
db.stocks.insertMany([
  { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy" },
  { symbol: "TCS", name: "TCS", sector: "IT" },
  // ... more stocks
])
```

Update `backend/app/api/stocks.py`:
```python
@router.get("/", response_model=list[Stock])
async def list_stocks(current_user=Depends(get_current_user), db=Depends(get_db)):
    stocks = []
    cursor = db["stocks"].find({})
    async for doc in cursor:
        # Fetch live price for each
        stock = await fetch_live_price(doc["symbol"])
        if stock:
            stocks.append(stock)
    return stocks
```

### Method 3: Use NSE Stock List

```python
from nsepython import nse_eq_symbols

# Get all NSE equity symbols
all_symbols = nse_eq_symbols()
print(f"Total NSE stocks: {len(all_symbols)}")
```

---

## 🎨 Improving the UI

### 1. Add Icons
```bash
cd frontend
npm install lucide-react
```

Update `Navbar.jsx`:
```jsx
import { ShoppingCart, User, LogOut } from 'lucide-react';

// Use icons
<ShoppingCart size={20} />
```

### 2. Add Notifications
```bash
npm install react-hot-toast
```

In `main.jsx`:
```jsx
import { Toaster } from 'react-hot-toast';

<Toaster position="top-right" />
```

In components:
```jsx
import toast from 'react-hot-toast';

toast.success('Stock added to cart!');
toast.error('Failed to add stock');
```

### 3. Add Animations
```bash
npm install framer-motion
```

In `StockCard.jsx`:
```jsx
import { motion } from 'framer-motion';

<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  {/* Stock card content */}
</motion.div>
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: MongoDB connection failed**
```
Solution:
1. Check if MongoDB is running
2. Verify MONGO_URI in .env
3. Check firewall settings
```

**Problem: Module not found**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

**Problem: Port 8000 already in use**
```bash
# Use different port
python -m uvicorn app.main:app --reload --port 8001
```

### Frontend Issues

**Problem: npm install fails**
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem: CORS errors**
```
Solution:
1. Check FRONTEND_ORIGIN in backend .env
2. Verify it matches frontend URL
3. Restart backend server
```

**Problem: API calls failing**
```
Solution:
1. Check if backend is running
2. Verify API_URL in frontend
3. Check browser console for errors
```

---

## 📦 Production Deployment

### Backend (Render.com)

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: stock-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET_KEY
        generateValue: true
      - key: FRONTEND_ORIGIN
        value: https://your-frontend.vercel.app
```

2. Push to GitHub
3. Connect to Render
4. Deploy

### Frontend (Vercel)

1. Push to GitHub
2. Go to vercel.com
3. Import repository
4. Add environment variables:
```
VITE_API_URL=https://your-backend.onrender.com
```
5. Deploy

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET_KEY to random string
- [ ] Use strong MongoDB password
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS in production
- [ ] Add rate limiting
- [ ] Validate all user inputs
- [ ] Don't commit .env files
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for your frontend domain
- [ ] Implement request logging

---

## 📚 Useful Commands

### Backend
```bash
# Run server
python -m uvicorn app.main:app --reload --port 8000

# Run with auto-reload
uvicorn app.main:app --reload

# Run in production
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Check installed packages
pip list

# Freeze dependencies
pip freeze > requirements.txt
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### MongoDB
```bash
# Start MongoDB
mongod

# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use database
use stockdb

# Show collections
show collections

# Query users
db.users.find()

# Query rules
db.rules.find()
```

---

## 🎯 Next Steps

1. ✅ Complete setup
2. ✅ Test with demo data
3. ✅ Integrate real stock API
4. ✅ Add more stocks
5. ✅ Improve UI/UX
6. ✅ Add notifications
7. ✅ Deploy to production

---

## 📞 Need Help?

If you encounter any issues:
1. Check the troubleshooting section
2. Review error messages in console
3. Check API documentation at `/docs`
4. Ask for help!

---

**Happy Trading! 📈**
