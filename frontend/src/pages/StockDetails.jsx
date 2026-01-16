import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import StockChart from "../components/Charts/StockChart";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3, Clock, ShieldCheck, ShoppingCart } from "lucide-react";
import { addToCart } from "../redux/cartSlice";
import toast from "react-hot-toast";
import axios from "axios";

function StockDetails() {
  const { symbol } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stocks = useSelector((state) => state.stocks.list);
  const token = useSelector((state) => state.auth.token);
  const stock = stocks.find((item) => item.symbol === symbol);

  const demoData = [
    { time: "09:15", price: stock ? stock.price * 0.98 : 0 },
    { time: "10:00", price: stock ? stock.price * 0.99 : 0 },
    { time: "11:00", price: stock ? stock.price * 1.01 : 0 },
    { time: "12:00", price: stock ? stock.price * 1.05 : 0 },
    { time: "13:00", price: stock ? stock.price * 1.02 : 0 },
    { time: "14:00", price: stock ? stock.price * 1.04 : 0 },
    { time: "15:30", price: stock ? stock.price : 0 },
  ];

  const isPositive = stock ? stock.change >= 0 : true;

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please login to add stocks to your cart", {
        icon: '🔒',
        duration: 3000
      });
      navigate("/login");
      return;
    }

    if (stock) {
      try {
        await axios.post("http://localhost:8000/api/cart/add", {
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          quantity: 1
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        dispatch(addToCart({ ...stock, quantity: 1 }));
        toast.success(`${stock.symbol} added to portfolio cart!`, {
          icon: '🛒',
          style: {
            borderRadius: '12px',
            background: '#171717',
            color: '#fff',
            border: '1px solid #262626'
          },
        });
      } catch (err) {
        toast.error("Failed to add to cart");
      }
    }
  };

  if (!stock) return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <TrendingDown className="w-16 h-16 text-neutral-800 mb-4" />
      <p className="text-neutral-500 font-bold">Stock not found</p>
      <Link to="/" className="mt-4 text-primary-500 font-black flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors font-bold text-sm mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          BACK TO MARKET
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary-500 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Active</span>
                  <h2 className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-xs">NSE India</h2>
                </div>
                <h1 className="text-6xl font-black tracking-tighter">{stock.symbol}</h1>
                <p className="text-2xl text-neutral-400 font-medium mt-1">{stock.name}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-5xl font-black">₹{stock.price.toLocaleString("en-IN")}</p>
                <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full font-black text-sm ${isPositive ? 'bg-primary-500/10 text-primary-500' : 'bg-red-500/10 text-red-500'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {isPositive ? '+' : ''}{stock.change.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl overflow-hidden relative">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black uppercase tracking-widest text-xs text-neutral-500 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary-500" />
                  Live Performance
                </h3>
                <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-600">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Real-time</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Encrypted</span>
                </div>
              </div>
              <StockChart data={demoData} />
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
              <h3 className="text-xl font-black mb-6">Trade Terminal</h3>

              <div className="space-y-4 mb-8">
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex justify-between items-center group hover:border-primary-500/30 transition-all">
                  <span className="text-neutral-500 font-bold text-xs uppercase tracking-widest">Market Price</span>
                  <span className="font-black text-lg">₹{stock.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex justify-between items-center group hover:border-primary-500/30 transition-all">
                  <span className="text-neutral-500 font-bold text-xs uppercase tracking-widest">24h High</span>
                  <span className="font-black text-lg text-primary-500">₹{(stock.price * 1.05).toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex justify-between items-center group hover:border-primary-500/30 transition-all">
                  <span className="text-neutral-500 font-bold text-xs uppercase tracking-widest">24h Low</span>
                  <span className="font-black text-lg text-red-500">₹{(stock.price * 0.94).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary-500 hover:bg-primary-600 text-neutral-950 font-black py-5 rounded-2xl shadow-lg shadow-primary-500/10 transition-all flex items-center justify-center gap-3 active:scale-95 group"
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>ADD TO PORTFOLIO</span>
              </button>
            </div>

            <div className="bg-neutral-800/30 border border-neutral-800 border-dashed rounded-[32px] p-8">
              <h4 className="font-black text-neutral-400 text-xs uppercase tracking-widest mb-4">Smart Prediction</h4>
              <p className="text-neutral-500 font-medium text-sm leading-relaxed mb-6">
                Based on current market trends and technical indicators, this stock is showing a
                <span className="text-primary-500 font-bold"> Strong Buy </span>
                pattern for the next session.
              </p>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className="h-1 flex-1 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 animate-pulse" style={{ width: i === 3 ? '40%' : '100%', animationDelay: `${i * 200}ms` }}></div>
                </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockDetails;
