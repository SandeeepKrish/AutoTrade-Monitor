#  Stock Auto-Cart Dashboard - Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE (Browser)                     │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Dashboard  │  │     Cart     │  │ Stock Details│              │
│  │   (Stocks)   │  │  (Auto-add)  │  │   (Charts)   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │              React Frontend (Port 5173)                   │       │
│  │  - Redux State Management                                 │       │
│  │  - React Router (Navigation)                              │       │
│  │  - Axios (HTTP Client)                                    │       │
│  │  - Socket.io (WebSocket Client)                           │       │
│  └──────────────────────────────────────────────────────────┘       │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS + WebSocket
                            │
┌───────────────────────────▼─────────────────────────────────────────┐
│                    FastAPI Backend (Port 8000)                       │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      API Routes                              │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │   │
│  │  │ Auth │ │Stocks│ │ Cart │ │Orders│ │Rules │             │   │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   Business Logic                             │   │
│  │  ┌────────────────────────────────────────────────────┐     │   │
│  │  │  Automation Engine (Every 5 seconds)               │     │   │
│  │  │  1. Fetch active rules from DB                     │     │   │
│  │  │  2. Get live stock prices                          │     │   │
│  │  │  3. Check if price in range                        │     │   │
│  │  │  4. Auto-add to cart if match                      │     │   │
│  │  │  5. Send WebSocket notification                    │     │   │
│  │  └────────────────────────────────────────────────────┘     │   │
│  │                                                               │   │
│  │  ┌────────────────┐  ┌────────────────┐                     │   │
│  │  │ Stock Fetcher  │  │ Broker Service │                     │   │
│  │  │ (API Client)   │  │ (Trade Exec)   │                     │   │
│  │  └────────────────┘  └────────────────┘                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    WebSocket Manager                         │   │
│  │  - Real-time price updates                                   │   │
│  │  - Cart notifications                                        │   │
│  │  - User-specific broadcasts                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└───────────────┬───────────────────────────┬─────────────────────────┘
                │                           │
                │                           │
    ┌───────────▼──────────┐    ┌──────────▼──────────┐
    │   MongoDB Database   │    │  Stock Market APIs  │
    │                      │    │                     │
    │  Collections:        │    │  - Yahoo Finance    │
    │  - users             │    │  - NSE Python       │
    │  - stocks            │    │  - Alpha Vantage    │
    │  - cart              │    │  - Zerodha Kite     │
    │  - orders            │    │  - Upstox           │
    │  - rules             │    │                     │
    └──────────────────────┘    └─────────────────────┘
```

---

## Data Flow Diagrams

### 1. User Registration & Login Flow

```
┌──────┐                ┌─────────┐              ┌──────────┐
│ User │                │ Frontend│              │  Backend │
└───┬──┘                └────┬────┘              └────┬─────┘
    │                        │                        │
    │  1. Enter credentials  │                        │
    ├───────────────────────>│                        │
    │                        │  2. POST /api/auth/    │
    │                        │     register or login  │
    │                        ├───────────────────────>│
    │                        │                        │
    │                        │  3. Validate & hash    │
    │                        │     password           │
    │                        │                        │
    │                        │  4. Generate JWT token │
    │                        │<───────────────────────┤
    │                        │                        │
    │  5. Store token in     │                        │
    │     localStorage       │                        │
    │<───────────────────────┤                        │
    │                        │                        │
    │  6. Redirect to        │                        │
    │     Dashboard          │                        │
    │                        │                        │
```

### 2. Stock Listing Flow

```
┌──────────┐         ┌─────────┐         ┌─────────┐         ┌──────────┐
│Dashboard │         │ Frontend│         │ Backend │         │Stock API │
└────┬─────┘         └────┬────┘         └────┬────┘         └────┬─────┘
     │                    │                   │                   │
     │ 1. Load page       │                   │                   │
     ├───────────────────>│                   │                   │
     │                    │ 2. GET /api/      │                   │
     │                    │    stocks         │                   │
     │                    ├──────────────────>│                   │
     │                    │                   │ 3. Fetch prices   │
     │                    │                   ├──────────────────>│
     │                    │                   │                   │
     │                    │                   │ 4. Return data    │
     │                    │                   │<──────────────────┤
     │                    │ 5. Stock list     │                   │
     │                    │<──────────────────┤                   │
     │ 6. Display stocks  │                   │                   │
     │<───────────────────┤                   │                   │
     │                    │                   │                   │
```

### 3. Automation Engine Flow (Core Feature!)

```
┌──────────────┐    ┌──────────┐    ┌─────────┐    ┌──────┐    ┌──────┐
│ Scheduler    │    │Automation│    │Stock API│    │MongoDB│   │ User │
│(Every 5 sec) │    │  Engine  │    │         │    │       │   │      │
└──────┬───────┘    └────┬─────┘    └────┬────┘    └───┬───┘   └───┬──┘
       │                 │                │             │           │
       │ 1. Trigger tick │                │             │           │
       ├────────────────>│                │             │           │
       │                 │ 2. Get active  │             │           │
       │                 │    rules       │             │           │
       │                 ├───────────────────────────>  │           │
       │                 │                │             │           │
       │                 │ 3. Rules list  │             │           │
       │                 │<───────────────────────────  │           │
       │                 │                │             │           │
       │                 │ For each rule: │             │           │
       │                 │ 4. Fetch live  │             │           │
       │                 │    price       │             │           │
       │                 ├───────────────>│             │           │
       │                 │                │             │           │
       │                 │ 5. Current     │             │           │
       │                 │    price       │             │           │
       │                 │<───────────────┤             │           │
       │                 │                │             │           │
       │                 │ 6. Check if    │             │           │
       │                 │    min <= price│             │           │
       │                 │    <= max      │             │           │
       │                 │                │             │           │
       │                 │ 7. If YES:     │             │           │
       │                 │    Add to cart │             │           │
       │                 ├───────────────────────────>  │           │
       │                 │                │             │           │
       │                 │ 8. Send        │             │           │
       │                 │    WebSocket   │             │           │
       │                 │    notification│             │           │
       │                 ├───────────────────────────────────────>  │
       │                 │                │             │           │
       │                 │                │             │  9. Toast │
       │                 │                │             │     alert │
       │                 │                │             │           │
       │ 10. Wait 5 sec  │                │             │           │
       │ 11. Repeat...   │                │             │           │
       │                 │                │             │           │
```

### 4. Price Range Rule Creation Flow

```
┌──────┐         ┌─────────┐         ┌─────────┐         ┌──────────┐
│ User │         │ Frontend│         │ Backend │         │ MongoDB  │
└───┬──┘         └────┬────┘         └────┬────┘         └────┬─────┘
    │                 │                   │                   │
    │ 1. Click "Set   │                   │                   │
    │    Price Alert" │                   │                   │
    ├────────────────>│                   │                   │
    │                 │                   │                   │
    │ 2. Enter range: │                   │                   │
    │    Min: 2750    │                   │                   │
    │    Max: 2850    │                   │                   │
    ├────────────────>│                   │                   │
    │                 │ 3. POST /api/     │                   │
    │                 │    rules          │                   │
    │                 │    {symbol,       │                   │
    │                 │     min, max}     │                   │
    │                 ├──────────────────>│                   │
    │                 │                   │ 4. Save rule      │
    │                 │                   │    with user_id   │
    │                 │                   ├──────────────────>│
    │                 │                   │                   │
    │                 │                   │ 5. Confirm        │
    │                 │                   │<──────────────────┤
    │                 │ 6. Success        │                   │
    │                 │<──────────────────┤                   │
    │ 7. Show toast:  │                   │                   │
    │    "Alert set!" │                   │                   │
    │<────────────────┤                   │                   │
    │                 │                   │                   │
    │ 8. Automation   │                   │                   │
    │    engine will  │                   │                   │
    │    now monitor  │                   │                   │
    │    this rule    │                   │                   │
    │                 │                   │                   │
```

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  hashed_password: "$2b$12$...",
  created_at: ISODate("2026-01-15T14:30:00Z")
}
```

### Stocks Collection (Optional - can be hardcoded)
```javascript
{
  _id: ObjectId("..."),
  symbol: "RELIANCE",
  name: "Reliance Industries",
  sector: "Energy",
  market_cap: 1800000000000,
  listed_on: ["NSE", "BSE"]
}
```

### Rules Collection (Core!)
```javascript
{
  _id: ObjectId("..."),
  user_id: "user_object_id",
  symbol: "RELIANCE",
  min_price: 2750.00,
  max_price: 2850.00,
  active: true,
  created_at: ISODate("2026-01-15T14:30:00Z")
}
```

### Cart Collection
```javascript
{
  _id: ObjectId("..."),
  user_id: "user_object_id",
  symbol: "RELIANCE",
  name: "Reliance Industries",
  price: 2800.50,
  added_at: ISODate("2026-01-15T14:35:00Z"),
  auto_added: true  // Flag to indicate it was auto-added
}
```

### Orders Collection
```javascript
{
  _id: ObjectId("..."),
  user_id: "user_object_id",
  symbol: "RELIANCE",
  quantity: 10,
  price: 2800.50,
  total: 28005.00,
  order_type: "BUY",
  status: "PENDING",  // PENDING, EXECUTED, FAILED
  created_at: ISODate("2026-01-15T14:40:00Z"),
  executed_at: null
}
```

---

## Technology Stack Details

### Frontend Stack
```
React 19.2.0
├── State Management: Redux Toolkit 2.11.2
├── Routing: React Router DOM 7.12.0
├── HTTP Client: Axios 1.13.2
├── Charts: Recharts 3.6.0
├── Date/Time: Day.js 1.11.19
├── Icons: Lucide React (recommended)
├── Notifications: React Hot Toast (recommended)
├── Animations: Framer Motion (recommended)
└── Build Tool: Vite 7.2.4
```

### Backend Stack
```
Python 3.10+
├── Web Framework: FastAPI
├── ASGI Server: Uvicorn
├── Database: MongoDB (Motor - async driver)
├── Authentication: JWT (python-jose)
├── Password Hashing: Passlib + Bcrypt
├── Data Validation: Pydantic
├── WebSocket: FastAPI WebSocket
├── Stock APIs: yfinance, nsepython
├── Scheduling: APScheduler
└── Data Processing: Pandas, NumPy
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Authentication Layer                                │
│     - JWT tokens (7 days expiry)                        │
│     - Bcrypt password hashing                           │
│     - Protected routes                                  │
│                                                          │
│  2. Authorization Layer                                 │
│     - User-specific data access                         │
│     - Rules belong to users                             │
│     - Cart is user-specific                             │
│                                                          │
│  3. Network Layer                                       │
│     - CORS configured for frontend only                 │
│     - HTTPS in production                               │
│     - Rate limiting (recommended)                       │
│                                                          │
│  4. Data Layer                                          │
│     - MongoDB authentication                            │
│     - Input validation (Pydantic)                       │
│     - SQL injection prevention (NoSQL)                  │
│                                                          │
│  5. API Layer                                           │
│     - Request validation                                │
│     - Error handling                                    │
│     - Logging                                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Scalability Considerations

### Current Architecture (Single Server)
- Good for: 100-1000 concurrent users
- Limitations: Single point of failure

### Recommended Improvements for Scale

1. **Load Balancing**
   ```
   Users → Load Balancer → Multiple Backend Instances
   ```

2. **Database Replication**
   ```
   MongoDB Primary → MongoDB Secondaries (Read replicas)
   ```

3. **Caching Layer**
   ```
   Redis Cache → Reduce API calls to stock providers
   ```

4. **Message Queue**
   ```
   Celery + Redis → Handle automation tasks asynchronously
   ```

5. **CDN for Frontend**
   ```
   CloudFlare/AWS CloudFront → Serve static assets
   ```

---

## Monitoring & Logging

### Recommended Tools

1. **Application Monitoring**
   - Sentry (Error tracking)
   - New Relic (Performance)
   - Prometheus + Grafana (Metrics)

2. **Logging**
   - Python: `logging` module
   - Centralized: ELK Stack (Elasticsearch, Logstash, Kibana)

3. **Uptime Monitoring**
   - UptimeRobot
   - Pingdom

---

## Cost Estimation (Monthly)

### Free Tier (Development)
- MongoDB Atlas: Free (512MB)
- Render/Railway: Free tier
- Vercel: Free
- Yahoo Finance API: Free
- **Total: $0/month**

### Production (Small Scale)
- MongoDB Atlas: $9/month (Shared cluster)
- Render: $7/month (Backend)
- Vercel: Free (Frontend)
- Stock API: $0-50/month
- **Total: ~$16-66/month**

### Production (Medium Scale)
- MongoDB Atlas: $57/month (Dedicated)
- AWS EC2: $20-50/month
- CloudFront CDN: $10/month
- Stock API: $50-200/month
- **Total: ~$137-317/month**

---

This architecture is designed to be:
- ✅ Scalable
- ✅ Maintainable
- ✅ Secure
- ✅ Cost-effective
- ✅ Production-ready
