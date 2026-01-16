  
### Automated Stock Monitoring & Rule-Based Buy System

PriceTrigger is a full-stack stock market dashboard that continuously monitors real-time Indian stock prices and automatically triggers actions (such as adding a stock to cart or watchlist) when user-defined price conditions are met.

The system is designed to reduce manual monitoring by automating price-based decisions using custom rules defined by the user.

---

##  Key Features

-  **Real-Time Stock Monitoring**
  - Fetches live Indian stock market prices using APIs
  - Displays all listed stocks in a dashboard similar to trading apps

-  **Automated Price Triggers**
  - Users define a price range (min & max)
  - When a stock enters the range, it is automatically added to cart/watchlist

- 🛒 **Auto Add to Cart**
  - No manual tracking required
  - Stock is added instantly when conditions match

-  **Continuous Background Monitoring**
  - Backend automation runs at regular intervals
  - Ensures real-time decision making

-  **User Authentication**
  - Secure login & registration
  - Each user manages their own rules and stocks

---

## 🏗️ System Architecture

---

## 🛠️ Tech Stack

### Frontend
- **React.js**
- HTML5 / CSS3
- JavaScript (ES6+)
- Axios (API calls)
- Charting library (for stock price visualization)

### Backend
- **Python**
- FastAPI / Flask
- Background schedulers (for automation)
- RESTful APIs

### Database
- **MongoDB Atlas (Cloud)**
- Collections:
  - users
  - stocks
  - cart
  - orders
  - alerts (price rules)

### APIs
- Stock Market API (for real-time Indian stock data)

---

## 🧠 Automation Logic (Core Feature)

1. User sets a price range for a stock
2. Backend scheduler monitors stock prices continuously
3. If price enters the defined range:
   - Stock is automatically added to cart
   - Rule is marked as triggered
4. User can directly proceed to buy

---

## 🔐 Authentication Flow

- User registers & logs in
- JWT-based authentication
- Rules and cart are user-specific

---

## 📦 Database Structure (High Level)


---

## 🚀 Future Enhancements

- 📈 Stock price prediction using ML
- 📲 Mobile app version
- 📩 Notifications (Email / SMS / Push)
- 🤖 Fully automated buy execution

---

## 🧑‍💻 Developed By

**Sandeep Yadav**  
Software Engineer  
India 🇮🇳

---

## ⭐ Why This Project Matters

PriceTrigger demonstrates:
- Full-stack development skills
- Real-time data handling
- Backend automation
- Scalable system design
- Practical finance domain knowledge

This project reflects real-world trading automation concepts used in modern fintech platforms.


