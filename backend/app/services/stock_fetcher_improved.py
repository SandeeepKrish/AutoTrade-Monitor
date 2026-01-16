"""
Improved Stock Fetcher with Real API Integration
Supports multiple data sources: Yahoo Finance, NSE Python
"""
import random
from typing import Optional
import asyncio
from functools import lru_cache

from ..models.stock import Stock

# Try importing real APIs
try:
    import yfinance as yf
    YFINANCE_AVAILABLE = True
except ImportError:
    YFINANCE_AVAILABLE = False

try:
    from nsepython import nse_quote_ltp, nse_quote
    NSE_AVAILABLE = True
except ImportError:
    NSE_AVAILABLE = False


# Demo stocks for fallback
DEMO_STOCKS: list[Stock] = [
    Stock(symbol="RELIANCE", name="Reliance Industries", price=2800, change=0.8),
    Stock(symbol="TCS", name="TCS", price=3900, change=-0.4),
    Stock(symbol="HDFCBANK", name="HDFC Bank", price=1550, change=1.1),
    Stock(symbol="INFY", name="Infosys", price=1450, change=1.2),
    Stock(symbol="ICICIBANK", name="ICICI Bank", price=950, change=-0.3),
    Stock(symbol="HINDUNILVR", name="Hindustan Unilever", price=2400, change=0.5),
    Stock(symbol="ITC", name="ITC Limited", price=420, change=0.9),
    Stock(symbol="SBIN", name="State Bank of India", price=580, change=-0.6),
    Stock(symbol="BHARTIARTL", name="Bharti Airtel", price=850, change=1.5),
    Stock(symbol="KOTAKBANK", name="Kotak Mahindra Bank", price=1750, change=0.7),
]


async def fetch_live_price_yfinance(symbol: str) -> Optional[Stock]:
    """Fetch stock price using Yahoo Finance API"""
    if not YFINANCE_AVAILABLE:
        return None
    
    try:
        # NSE symbols need .NS suffix for Yahoo Finance
        ticker_symbol = f"{symbol}.NS"
        ticker = yf.Ticker(ticker_symbol)
        
        # Get current data
        info = ticker.info
        hist = ticker.history(period="1d")
        
        if hist.empty:
            return None
        
        current_price = hist['Close'].iloc[-1]
        prev_close = info.get('previousClose', current_price)
        change = ((current_price - prev_close) / prev_close) * 100 if prev_close else 0
        
        return Stock(
            symbol=symbol,
            name=info.get('longName', symbol),
            price=round(current_price, 2),
            change=round(change, 2)
        )
    except Exception as e:
        print(f"Yahoo Finance error for {symbol}: {e}")
        return None


async def fetch_live_price_nse(symbol: str) -> Optional[Stock]:
    """Fetch stock price using NSE Python API"""
    if not NSE_AVAILABLE:
        return None
    
    try:
        # Get quote data
        quote = nse_quote(symbol)
        
        if not quote:
            return None
        
        current_price = float(quote.get('lastPrice', 0))
        prev_close = float(quote.get('previousClose', current_price))
        change = float(quote.get('pChange', 0))
        
        return Stock(
            symbol=symbol,
            name=quote.get('info', {}).get('companyName', symbol),
            price=round(current_price, 2),
            change=round(change, 2)
        )
    except Exception as e:
        print(f"NSE Python error for {symbol}: {e}")
        return None


async def fetch_live_price_demo(symbol: str) -> Optional[Stock]:
    """Fallback demo fetcher with simulated price changes"""
    base = next((s for s in DEMO_STOCKS if s.symbol == symbol), None)
    if base is None:
        return None
    
    # Simulate realistic price movement
    jitter = random.uniform(-10, 10)
    price = max(1.0, base.price + jitter)
    change = (price - base.price) / base.price * 100
    
    return Stock(
        symbol=base.symbol,
        name=base.name,
        price=round(price, 2),
        change=round(change, 2)
    )


async def fetch_live_price(symbol: str) -> Optional[Stock]:
    """
    Fetch live stock price from available data sources
    Priority: NSE Python > Yahoo Finance > Demo Data
    """
    # Try NSE first (most accurate for Indian stocks)
    if NSE_AVAILABLE:
        stock = await fetch_live_price_nse(symbol)
        if stock:
            return stock
    
    # Try Yahoo Finance
    if YFINANCE_AVAILABLE:
        stock = await fetch_live_price_yfinance(symbol)
        if stock:
            return stock
    
    # Fallback to demo data
    print(f"Using demo data for {symbol} - Install yfinance or nsepython for real data")
    return await fetch_live_price_demo(symbol)


@lru_cache(maxsize=1000)
def get_all_indian_stocks() -> list[str]:
    """
    Get list of all major Indian stocks
    In production, this should come from a database or API
    """
    return [
        # Nifty 50 stocks
        "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK",
        "HINDUNILVR", "ITC", "SBIN", "BHARTIARTL", "KOTAKBANK",
        "LT", "AXISBANK", "ASIANPAINT", "MARUTI", "TITAN",
        "BAJFINANCE", "WIPRO", "ULTRACEMCO", "NESTLEIND", "HCLTECH",
        "SUNPHARMA", "POWERGRID", "NTPC", "TATASTEEL", "BAJAJFINSV",
        "TECHM", "ONGC", "M&M", "TATAMOTORS", "ADANIPORTS",
        "COALINDIA", "DIVISLAB", "GRASIM", "DRREDDY", "INDUSINDBK",
        "JSWSTEEL", "CIPLA", "EICHERMOT", "HEROMOTOCO", "BRITANNIA",
        "SHREECEM", "APOLLOHOSP", "BPCL", "HINDALCO", "TATACONSUM",
        "UPL", "SBILIFE", "IOC", "BAJAJ-AUTO", "ADANIENT",
        
        # Additional popular stocks
        "VEDL", "ZOMATO", "PAYTM", "NYKAA", "POLICYBZR",
        "DMART", "PIDILITIND", "GODREJCP", "DABUR", "MARICO",
    ]


async def fetch_multiple_stocks(symbols: list[str]) -> list[Stock]:
    """Fetch multiple stocks concurrently"""
    tasks = [fetch_live_price(symbol) for symbol in symbols]
    results = await asyncio.gather(*tasks)
    return [stock for stock in results if stock is not None]


# Cache for stock data (1 second TTL to reduce API calls)
_stock_cache = {}
_cache_timestamp = {}

async def fetch_live_price_cached(symbol: str, ttl_seconds: int = 1) -> Optional[Stock]:
    """Fetch stock with caching to reduce API calls"""
    import time
    
    current_time = time.time()
    
    # Check cache
    if symbol in _stock_cache:
        cache_time = _cache_timestamp.get(symbol, 0)
        if current_time - cache_time < ttl_seconds:
            return _stock_cache[symbol]
    
    # Fetch fresh data
    stock = await fetch_live_price(symbol)
    
    # Update cache
    if stock:
        _stock_cache[symbol] = stock
        _cache_timestamp[symbol] = current_time
    
    return stock
