import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, ShoppingCart, BarChart3 } from "lucide-react";

function StockCard({ stock, onAddToCart }) {
  const isPositive = stock.change >= 0;

  return (
    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-primary-500/50 transition-all duration-300 group shadow-lg flex flex-col h-full relative overflow-hidden">

      {/* Dynamic Background Pattern */}
      <div className="stock-card-pattern">
        {/* Vertical Lines */}
        <div className="data-line text-primary-500 left-[10%] top-[20%] delay-0"></div>
        <div className="data-line text-red-500 left-[40%] top-[60%] delay-500" style={{ animationDelay: '1.2s' }}></div>
        <div className="data-line text-primary-500 left-[70%] top-[10%] delay-1000" style={{ animationDelay: '0.5s' }}></div>
        <div className="data-line text-red-500 left-[90%] top-[40%] delay-1500" style={{ animationDelay: '2s' }}></div>

        {/* Horizontal Lines */}
        <div className="data-line-h text-primary-500 top-[30%] left-[-10%]" style={{ animationDelay: '0.2s' }}></div>
        <div className="data-line-h text-red-500 top-[70%] left-[-10%]" style={{ animationDelay: '2.5s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <Link to={`/stocks/${stock.symbol}`} className="flex-grow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white group-hover:text-primary-500 transition-colors truncate">
                {stock.symbol}
              </h3>
              <p className="text-xs text-neutral-500 font-medium mt-0.5 truncate uppercase tracking-wider">
                {stock.name}
              </p>
            </div>
            <div
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${isPositive ? "bg-primary-500/10 text-primary-500" : "bg-red-500/10 text-red-500"
                }`}
            >
              {isPositive ? "+" : ""}
              {stock.change.toFixed(2)}%
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">
                ₹{stock.price.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-primary-500" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
              )}
              <span
                className={`text-xs font-bold ${isPositive ? "text-primary-500" : "text-red-500"}`}
              >
                ₹{Math.abs((stock.price * stock.change) / 100).toFixed(2)} Today
              </span>
            </div>
          </div>
        </Link>

        <div className="pt-5 border-t border-neutral-800 flex gap-3 mt-auto">
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(stock);
            }}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-neutral-950 font-black text-sm py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group/btn active:scale-95 shadow-lg shadow-primary-500/10"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span>Add</span>
          </button>
          <Link
            to={`/stocks/${stock.symbol}`}
            className="bg-neutral-800 hover:bg-neutral-700 text-white p-2.5 rounded-xl transition-all border border-neutral-700 active:scale-95"
          >
            <BarChart3 className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StockCard;
