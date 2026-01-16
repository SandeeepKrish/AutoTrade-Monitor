import random
import asyncio
import logging
from typing import Dict, List
from ..models.stock import Stock

logger = logging.getLogger(__name__)

# Full list of 30 Indian stocks
INITIAL_STOCKS = [
    {"symbol": "RELIANCE", "name": "Reliance Industries", "price": 2800.0},
    {"symbol": "TCS", "name": "Tata Consultancy Services", "price": 3900.0},
    {"symbol": "HDFCBANK", "name": "HDFC Bank", "price": 1550.0},
    {"symbol": "INFY", "name": "Infosys", "price": 1450.0},
    {"symbol": "ICICIBANK", "name": "ICICI Bank", "price": 950.0},
    {"symbol": "HINDUNILVR", "name": "Hindustan Unilever", "price": 2400.0},
    {"symbol": "ITC", "name": "ITC Limited", "price": 420.0},
    {"symbol": "SBIN", "name": "State Bank of India", "price": 580.0},
    {"symbol": "BHARTIARTL", "name": "Bharti Airtel", "price": 850.0},
    {"symbol": "KOTAKBANK", "name": "Kotak Mahindra Bank", "price": 1750.0},
    {"symbol": "LT", "name": "Larsen & Toubro", "price": 2950.0},
    {"symbol": "AXISBANK", "name": "Axis Bank", "price": 980.0},
    {"symbol": "ASIANPAINT", "name": "Asian Paints", "price": 3200.0},
    {"symbol": "MARUTI", "name": "Maruti Suzuki", "price": 9500.0},
    {"symbol": "TITAN", "name": "Titan Company", "price": 3100.0},
    {"symbol": "BAJFINANCE", "name": "Bajaj Finance", "price": 6800.0},
    {"symbol": "WIPRO", "name": "Wipro", "price": 420.0},
    {"symbol": "ULTRACEMCO", "name": "UltraTech Cement", "price": 8200.0},
    {"symbol": "NESTLEIND", "name": "Nestle India", "price": 22000.0},
    {"symbol": "HCLTECH", "name": "HCL Technologies", "price": 1250.0},
    {"symbol": "SUNPHARMA", "name": "Sun Pharma", "price": 1150.0},
    {"symbol": "POWERGRID", "name": "Power Grid Corp", "price": 245.0},
    {"symbol": "NTPC", "name": "NTPC", "price": 185.0},
    {"symbol": "TATASTEEL", "name": "Tata Steel", "price": 125.0},
    {"symbol": "BAJAJFINSV", "name": "Bajaj Finserv", "price": 1580.0},
    {"symbol": "TECHM", "name": "Tech Mahindra", "price": 1180.0},
    {"symbol": "ONGC", "name": "ONGC", "price": 165.0},
    {"symbol": "ADANIPORTS", "name": "Adani Ports", "price": 780.0},
    {"symbol": "ZOMATO", "name": "Zomato", "price": 130.0},
    {"symbol": "JSWSTEEL", "name": "JSW Steel", "price": 820.0},
]

class MarketSimulator:
    def __init__(self):
        self.stocks: Dict[str, Stock] = {}
        for s in INITIAL_STOCKS:
            self.stocks[s["symbol"]] = Stock(
                symbol=s["symbol"],
                name=s["name"],
                price=s["price"],
                change=0.0
            )

    def get_all_stocks(self) -> List[Stock]:
        return list(self.stocks.values())

    def get_stock(self, symbol: str) -> Stock:
        return self.stocks.get(symbol.upper())

    async def update_prices(self):
        """Randomly fluctuate a subset of prices every tick"""
        # Pick 5-10 random stocks to update each minute for a more natural feel
        num_to_update = random.randint(5, 15)
        symbols = list(self.stocks.keys())
        to_update = random.sample(symbols, num_to_update)

        for symbol in to_update:
            stock = self.stocks[symbol]
            # Random change between -1.5% and +1.5%
            change_percent = random.uniform(-0.015, 0.015)
            old_price = stock.price
            new_price = old_price * (1 + change_percent)
            
            new_price = max(1.0, round(new_price, 2))
            stock.change = round(((new_price - old_price) / old_price) * 100, 2)
            stock.price = new_price
            
        logger.info(f"Market tick: Updated {num_to_update} stocks.")

    async def run_forever(self):
        while True:
            await self.update_prices()
            # Update every 60 seconds as requested (every minute)
            await asyncio.sleep(60)

market_simulator = MarketSimulator()
