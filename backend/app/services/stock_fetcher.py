from ..models.stock import Stock
from ..services.market_simulator import market_simulator

async def fetch_live_price(symbol: str) -> Stock | None:
    """Fetches the current simulated price for a stock."""
    return market_simulator.get_stock(symbol)
