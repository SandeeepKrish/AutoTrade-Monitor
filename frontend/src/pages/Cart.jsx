import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Trash2, TrendingUp, Info, CreditCard, Hash } from "lucide-react";
import { removeFromCart } from "../redux/cartSlice";
import toast from "react-hot-toast";
import axios from "axios";

function Cart() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const items = useSelector((state) => state.cart.items);

  // Calculate total, now accounting for item quantities
  const totalValue = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const handleRemove = async (symbol) => {
    try {
      // Sync with backend
      await axios.delete(`http://localhost:8000/api/cart/remove/${symbol}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      dispatch(removeFromCart(symbol));
      toast.error(`${symbol} removed from cart`, {
        icon: '🗑️',
        style: {
          borderRadius: '12px',
          background: '#171717',
          color: '#fff',
          border: '1px solid #262626'
        },
      });
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Your Cart</h1>
            <p className="text-neutral-500 mt-1 text-sm font-medium">Review and manage your selected stocks</p>
          </div>
          <div className="bg-neutral-900 px-5 py-2.5 rounded-xl border border-neutral-800 flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-primary-500" />
            <span className="font-bold text-sm">{items.length} {items.length === 1 ? 'Stock' : 'Stocks'}</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-neutral-900 rounded-2xl p-12 text-center border border-neutral-800 border-dashed animate-slide-up">
            <div className="max-w-sm mx-auto">
              <div className="bg-neutral-800 rounded-xl p-5 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-neutral-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
              <p className="text-neutral-500 text-sm mb-6 font-medium">
                Explore the market and add stocks to your watchlist or portfolio.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-neutral-950 font-black text-sm rounded-xl shadow-lg shadow-primary-500/10 transition-all active:scale-95 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse Stocks
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.symbol}
                  className="bg-neutral-900 rounded-xl p-5 border border-neutral-800 hover:border-primary-500/30 transition-all animate-slide-up group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary-500/10 p-3 rounded-xl group-hover:bg-primary-500/20 transition-colors">
                        <TrendingUp className="w-7 h-7 text-primary-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black">{item.symbol}</h3>
                        <p className="text-neutral-500 font-medium text-xs truncate max-w-[180px]">{item.name}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-primary-500/10 text-primary-500 text-[9px] font-black uppercase tracking-widest rounded-md">
                            Verified
                          </span>
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-neutral-800 text-neutral-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-neutral-700">
                            <Hash className="w-2.5 h-2.5" />
                            Qty: {item.quantity || 1}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                      <div className="text-right">
                        <p className="text-xl font-black">₹{(item.price * (item.quantity || 1)).toLocaleString("en-IN")}</p>
                        <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">
                          {item.quantity > 1 ? `₹${item.price.toLocaleString("en-IN")} per share` : 'Market Price'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.symbol)}
                        className="p-2 bg-neutral-800 hover:bg-red-500/10 text-neutral-500 hover:text-red-500 rounded-lg transition-all border border-neutral-700 hover:border-red-500/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 sticky top-24 shadow-2xl">
                <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary-500" />
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500 font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="font-black text-base">₹{totalValue.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-neutral-500 text-xs text-sm">
                    <span className="font-bold uppercase tracking-widest">Brokerage (Free)</span>
                    <span className="font-bold text-primary-500">₹0</span>
                  </div>
                  <div className="pt-4 border-t border-neutral-800 flex justify-between items-end">
                    <span className="text-neutral-400 font-black text-base">Total</span>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">₹{totalValue.toLocaleString("en-IN")}</p>
                      <p className="text-[9px] text-primary-500 font-black uppercase tracking-widest mt-1">Tax Included</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-primary-500 hover:bg-primary-600 text-neutral-950 font-black py-3 rounded-xl shadow-lg shadow-primary-500/20 transition-all active:scale-95 mb-3 text-sm">
                  Confirm Transaction
                </button>

                <Link
                  to="/"
                  className="block w-full text-center py-3 border border-neutral-800 text-neutral-400 font-bold rounded-xl hover:bg-neutral-800 hover:text-white transition-all active:scale-95 text-sm"
                >
                  Add More Stocks
                </Link>

                <div className="mt-8 p-5 bg-neutral-950 rounded-2xl border border-neutral-800 group">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-500/10 p-2 rounded-lg">
                      <Info className="w-4 h-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1">Stock Protection</p>
                      <p className="text-[11px] text-neutral-600 font-medium leading-relaxed">
                        Your transactions are secured with military-grade encryption and real-time monitoring.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
