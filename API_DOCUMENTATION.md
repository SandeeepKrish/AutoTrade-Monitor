# 📡 API Documentation

## Base URL
```
Development: http://localhost:8000
Production: https://your-domain.com
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errors:**
- 400: Email already registered
- 422: Validation error

---

### Login
**POST** `/api/auth/login`

**Request Body (Form Data):**
```
username: user@example.com
password: securepassword123
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errors:**
- 401: Invalid credentials
- 422: Validation error

---

### Get Current User
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "user_id",
  "email": "user@example.com"
}
```

**Errors:**
- 401: Unauthorized

---

## 📊 Stock Endpoints

### List All Stocks
**GET** `/api/stocks/`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "symbol": "RELIANCE",
    "name": "Reliance Industries",
    "price": 2800.50,
    "change": 0.8
  },
  {
    "symbol": "TCS",
    "name": "TCS",
    "price": 3900.25,
    "change": -0.4
  }
]
```

**Errors:**
- 401: Unauthorized

---

### Get Stock Details
**GET** `/api/stocks/{symbol}`

**Headers:**
```
Authorization: Bearer <token>
```

**Example:**
```
GET /api/stocks/RELIANCE
```

**Response (200):**
```json
{
  "symbol": "RELIANCE",
  "name": "Reliance Industries",
  "price": 2800.50,
  "change": 0.8
}
```

**Errors:**
- 401: Unauthorized
- 404: Stock not found

---

## 🛒 Cart Endpoints

### Get User Cart
**GET** `/api/cart/`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "items": [
    {
      "symbol": "RELIANCE",
      "name": "Reliance Industries",
      "price": 2800.50
    }
  ]
}
```

**Errors:**
- 401: Unauthorized

---

### Add to Cart (Manual)
**POST** `/api/cart/`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "symbol": "RELIANCE"
}
```

**Response (201):**
```json
{
  "symbol": "RELIANCE",
  "name": "Reliance Industries",
  "price": 2800.50
}
```

**Errors:**
- 401: Unauthorized
- 404: Stock not found

---

### Remove from Cart
**DELETE** `/api/cart/{symbol}`

**Headers:**
```
Authorization: Bearer <token>
```

**Example:**
```
DELETE /api/cart/RELIANCE
```

**Response (200):**
```json
{
  "message": "Item removed from cart"
}
```

**Errors:**
- 401: Unauthorized
- 404: Item not in cart

---

### Clear Cart
**DELETE** `/api/cart/`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Cart cleared"
}
```

**Errors:**
- 401: Unauthorized

---

## 📋 Price Range Rules Endpoints

### Create Price Range Rule
**POST** `/api/rules/`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "symbol": "RELIANCE",
  "min_price": 2750.00,
  "max_price": 2850.00
}
```

**Response (201):**
```json
{
  "id": "rule_id",
  "user_id": "user_id",
  "symbol": "RELIANCE",
  "min_price": 2750.00,
  "max_price": 2850.00,
  "active": true
}
```

**Errors:**
- 401: Unauthorized
- 422: Validation error (min_price > max_price)

---

### List User Rules
**GET** `/api/rules/`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "rule_id",
    "user_id": "user_id",
    "symbol": "RELIANCE",
    "min_price": 2750.00,
    "max_price": 2850.00,
    "active": true
  }
]
```

**Errors:**
- 401: Unauthorized

---

### Update Rule
**PUT** `/api/rules/{rule_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "min_price": 2700.00,
  "max_price": 2900.00,
  "active": true
}
```

**Response (200):**
```json
{
  "id": "rule_id",
  "user_id": "user_id",
  "symbol": "RELIANCE",
  "min_price": 2700.00,
  "max_price": 2900.00,
  "active": true
}
```

**Errors:**
- 401: Unauthorized
- 404: Rule not found

---

### Delete Rule
**DELETE** `/api/rules/{rule_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Rule deleted"
}
```

**Errors:**
- 401: Unauthorized
- 404: Rule not found

---

### Toggle Rule Active Status
**PATCH** `/api/rules/{rule_id}/toggle`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "rule_id",
  "active": false
}
```

**Errors:**
- 401: Unauthorized
- 404: Rule not found

---

## 📦 Order Endpoints

### Create Order (Buy Stocks)
**POST** `/api/orders/`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "symbol": "RELIANCE",
  "quantity": 10,
  "order_type": "BUY"
}
```

**Response (201):**
```json
{
  "id": "order_id",
  "user_id": "user_id",
  "symbol": "RELIANCE",
  "quantity": 10,
  "price": 2800.50,
  "total": 28005.00,
  "order_type": "BUY",
  "status": "PENDING",
  "created_at": "2026-01-15T14:30:00Z"
}
```

**Errors:**
- 401: Unauthorized
- 404: Stock not found
- 422: Validation error

---

### List User Orders
**GET** `/api/orders/`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): PENDING, EXECUTED, FAILED
- `limit` (optional): Number of orders to return (default: 50)

**Example:**
```
GET /api/orders/?status=EXECUTED&limit=10
```

**Response (200):**
```json
[
  {
    "id": "order_id",
    "user_id": "user_id",
    "symbol": "RELIANCE",
    "quantity": 10,
    "price": 2800.50,
    "total": 28005.00,
    "order_type": "BUY",
    "status": "EXECUTED",
    "created_at": "2026-01-15T14:30:00Z",
    "executed_at": "2026-01-15T14:30:05Z"
  }
]
```

**Errors:**
- 401: Unauthorized

---

### Get Order Details
**GET** `/api/orders/{order_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "order_id",
  "user_id": "user_id",
  "symbol": "RELIANCE",
  "quantity": 10,
  "price": 2800.50,
  "total": 28005.00,
  "order_type": "BUY",
  "status": "EXECUTED",
  "created_at": "2026-01-15T14:30:00Z",
  "executed_at": "2026-01-15T14:30:05Z"
}
```

**Errors:**
- 401: Unauthorized
- 404: Order not found

---

### Cancel Order
**DELETE** `/api/orders/{order_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Order cancelled",
  "order_id": "order_id"
}
```

**Errors:**
- 401: Unauthorized
- 404: Order not found
- 400: Cannot cancel executed order

---

## 🔌 WebSocket Endpoints

### Connect to Price Updates
**WebSocket** `/ws/prices`

**Connection:**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/prices?token=<jwt-token>');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Price update:', data);
};
```

**Message Format:**
```json
{
  "type": "price_update",
  "symbol": "RELIANCE",
  "price": 2800.50,
  "change": 0.8,
  "timestamp": "2026-01-15T14:30:00Z"
}
```

---

### Connect to Cart Updates
**WebSocket** `/ws/cart`

**Connection:**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/cart?token=<jwt-token>');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Cart update:', data);
};
```

**Message Format:**
```json
{
  "type": "cart_added",
  "item": {
    "symbol": "RELIANCE",
    "name": "Reliance Industries",
    "price": 2800.50
  },
  "message": "Stock auto-added to cart",
  "timestamp": "2026-01-15T14:30:00Z"
}
```

---

## 🔍 Error Response Format

All errors follow this format:

```json
{
  "detail": "Error message here"
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation error
- **500 Internal Server Error**: Server error

---

## 📝 Example Usage (JavaScript/Axios)

### Setup Axios Instance
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Register User
```javascript
const register = async (email, password) => {
  try {
    const response = await api.post('/api/auth/register', {
      email,
      password,
    });
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response.data);
    throw error;
  }
};
```

### Get Stocks
```javascript
const getStocks = async () => {
  try {
    const response = await api.get('/api/stocks/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stocks:', error);
    throw error;
  }
};
```

### Create Price Rule
```javascript
const createRule = async (symbol, minPrice, maxPrice) => {
  try {
    const response = await api.post('/api/rules/', {
      symbol,
      min_price: minPrice,
      max_price: maxPrice,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create rule:', error);
    throw error;
  }
};
```

### WebSocket Connection
```javascript
const connectWebSocket = (token) => {
  const ws = new WebSocket(`ws://localhost:8000/ws/cart?token=${token}`);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'cart_added') {
      // Show notification
      toast.success(`${data.item.name} added to cart!`);
      // Update cart in Redux
      dispatch(addToCart(data.item));
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected');
    // Reconnect after 5 seconds
    setTimeout(() => connectWebSocket(token), 5000);
  };
  
  return ws;
};
```

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=password123"
```

### Get Stocks
```bash
curl -X GET http://localhost:8000/api/stocks/ \
  -H "Authorization: Bearer <your-token>"
```

### Create Rule
```bash
curl -X POST http://localhost:8000/api/rules/ \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"symbol":"RELIANCE","min_price":2750,"max_price":2850}'
```

---

## 📚 Interactive API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide:
- ✅ Try out endpoints directly
- ✅ See request/response schemas
- ✅ Authentication testing
- ✅ Example values

---

## 🔐 Rate Limiting (Recommended)

To prevent abuse, implement rate limiting:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/api/auth/register")
@limiter.limit("5/minute")  # 5 requests per minute
async def register(request: Request, ...):
    ...
```

**Recommended Limits:**
- Registration: 5/minute
- Login: 10/minute
- Stock API: 100/minute
- Rule creation: 20/minute

---

## 📊 API Performance Tips

1. **Use caching** for stock data (1-2 second TTL)
2. **Batch requests** when fetching multiple stocks
3. **Implement pagination** for large lists
4. **Use WebSocket** for real-time updates instead of polling
5. **Compress responses** with gzip
6. **Use CDN** for static assets

---

**Last Updated**: 2026-01-15
**API Version**: 1.0.0
