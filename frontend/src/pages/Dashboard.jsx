import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import StockCard from "../components/StockCard/StockCard";
import { addToCart } from "../redux/cartSlice";
import { setStocks } from "../redux/stockSlice";
import toast from "react-hot-toast";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  LayoutGrid,
  Loader2,
  Clock,
  Zap,
  Target
} from "lucide-react";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stocks = useSelector((state) => state.stocks.list);
  const token = useSelector((state) => state.auth.token);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [isLoading, setIsLoading] = useState(stocks.length === 0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Automation Context in Dashboard
  const [rules, setRules] = useState([]);
  const [isInRange, setIsInRange] = useState(false);
  const [matchingSymbol, setMatchingSymbol] = useState("");

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/rules", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRules(response.data);
    } catch (err) {
      console.error("Failed to fetch rules", err);
    }
  };

  const fetchLiveStocks = async (isManual = false) => {
    if (isManual) setIsLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get("http://localhost:8000/api/stocks", { headers });
      const liveData = response.data;
      dispatch(setStocks(liveData));
      checkMatches(liveData);
      if (isManual) {
        toast.success("Market Data Refreshed");
      }
    } catch (err) {
      console.error("Failed to fetch live stocks", err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkMatches = (liveStocks) => {
    if (rules.length === 0) return;
    let matched = false;
    let symbol = "";
    for (const rule of rules) {
      if (!rule.active) continue;
      const stock = liveStocks.find(s => s.symbol === rule.symbol);
      if (stock && stock.price >= rule.min_price && stock.price <= rule.max_price) {
        matched = true;
        symbol = stock.symbol;
        break;
      }
    }
    setIsInRange(matched);
    setMatchingSymbol(symbol);
  };

  useEffect(() => {
    fetchLiveStocks();
    const interval = setInterval(fetchLiveStocks, 10000);

    if (token) {
      fetchRules();
    }

    return () => clearInterval(interval);
  }, [token, dispatch]);

  useEffect(() => {
    if (stocks.length > 0) checkMatches(stocks);
  }, [rules]);

  const handleAddToCart = async (stock) => {
    if (!token) {
      toast.error("Please login to add stocks to your cart", {
        icon: '🔒',
        duration: 3000
      });
      navigate("/login");
      return;
    }

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
      toast.success(`${stock.symbol} added to cart!`);
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const filteredStocks = stocks
    .filter((stock) => {
      const matchesSearch =
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "gainers" && stock.change > 0) ||
        (filterBy === "losers" && stock.change < 0);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.symbol.localeCompare(b.symbol);
      if (sortBy === "price_high") return b.price - a.price;
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "change") return b.change - a.change;
      return 0;
    });

  const gainersCount = stocks.filter((s) => s.change > 0).length;
  const losersCount = stocks.filter((s) => s.change < 0).length;
  const avgChange = stocks.reduce((sum, s) => sum + s.change, 0) / (stocks.length || 1);

  return (
    <div className="min-h-screen bg-transparent text-white">
      {/* FULL-WIDTH HEADER SECTION - Responsive & Matching Screenshot */}
      <header className="bg-neutral-900/60 border-b border-neutral-800 backdrop-blur-xl sticky top-24 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 sm:gap-8 lg:gap-12">

            {/* Clock & Title Group */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6 lg:gap-8">
              {/* Responsive IST Clock */}
              <div className="bg-neutral-950 border border-neutral-800 px-4 sm:px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
                <div className="bg-primary-500/10 p-2 rounded-xl">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] font-black text-neutral-500 uppercase tracking-widest leading-none mb-1">Exchange Time (IST)</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-black text-white tracking-widest font-mono">
                    {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white whitespace-nowrap">Market Overview</h1>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-wider">Live Data Stream</span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">Monitoring 30 active equities in real-time simulation</p>
              </div>
            </div>

            {/* Automation & Indices Group */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
              {/* Bot Status Card - Professional Green Theme */}
              <div className="flex items-center gap-4 px-6 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl relative overflow-hidden group min-w-[200px] shadow-xl">
                <div className={`absolute inset-0 opacity-10 transition-all duration-1000 ${isInRange ? 'bg-primary-500 animate-pulse' : 'bg-primary-500'}`}></div>

                <div className="relative z-10">
                  <p className={`text-[11px] font-black uppercase tracking-widest mb-1.5 ${isInRange ? 'text-primary-400' : 'text-neutral-500'}`}>
                    BOT STATUS
                  </p>
                  <p className="text-base sm:text-lg font-black text-white uppercase tracking-tighter">
                    {isInRange ? matchingSymbol : 'SCANNING'}
                  </p>
                </div>

                <div className="relative w-12 h-12 ml-auto flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full border-2 border-dashed animate-[spin_4s_linear_infinite] ${isInRange ? 'border-primary-500' : 'border-primary-500/30'}`}></div>
                  <Zap className={`w-5 h-5 transition-all duration-500 shadow-2xl ${isInRange ? 'text-primary-500 fill-primary-500 scale-110' : 'text-neutral-700'}`} />
                </div>
              </div>

              {/* Responsive Indices Cards - Integrated with Primary Green Theme */}
              <div className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar py-1">
                <div className="bg-primary-500 border border-primary-400 rounded-2xl px-6 sm:px-8 py-3.5 min-w-[160px] sm:min-w-[180px] shadow-xl shadow-primary-500/20 group hover:scale-105 transition-all duration-300">
                  <p className="text-neutral-950/80 text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] mb-1">NIFTY 50</p>
                  <p className="text-xl sm:text-2xl font-black text-neutral-950">19,850.50</p>
                  <p className="text-neutral-950/70 text-xs font-bold mt-1">+0.85% Today</p>
                </div>
                <div className="bg-primary-500 border border-primary-400 rounded-2xl px-6 sm:px-8 py-3.5 min-w-[160px] sm:min-w-[180px] shadow-xl shadow-primary-500/20 group hover:scale-105 transition-all duration-300">
                  <p className="text-neutral-950/80 text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] mb-1">SENSEX</p>
                  <p className="text-xl sm:text-2xl font-black text-neutral-950">66,598.91</p>
                  <p className="text-neutral-950/70 text-xs font-bold mt-1">+0.72% Today</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* RESTORED TO PREVIOUS MAX-WIDTH CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

        {/* Main Stats Grid - Restored Sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8">
          <div className="bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-800 flex items-center justify-between group hover:border-primary-500/30 transition-all">
            <div>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Total Equities</p>
              <h3 className="text-3xl font-black mt-2">{stocks.length}</h3>
            </div>
            <div className="bg-primary-500/10 p-4 rounded-2xl">
              <BarChart3 className="w-8 h-8 text-primary-500" />
            </div>
          </div>

          <div className="bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-800 flex items-center justify-between group hover:border-green-500/30 transition-all">
            <div>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Market Gainers</p>
              <h3 className="text-3xl font-black mt-2 text-green-500">{stocks.filter(s => s.change >= 0).length}</h3>
            </div>
            <div className="bg-green-500/10 p-4 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-800 flex items-center justify-between group hover:border-red-500/30 transition-all">
            <div>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Market Losers</p>
              <h3 className="text-3xl font-black mt-2 text-red-500">{stocks.filter(s => s.change < 0).length}</h3>
            </div>
            <div className="bg-red-500/10 p-4 rounded-2xl">
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-800 flex items-center justify-between group hover:border-primary-500/30 transition-all">
            <div>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Bot Automation</p>
              <h3 className="text-3xl font-black mt-2 text-primary-500 italic flex items-center gap-2">
                ACTIVE
                <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse"></div>
              </h3>
            </div>
            <div className="bg-primary-500/10 p-4 rounded-2xl">
              <Zap className="w-8 h-8 text-primary-500" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar - Professional & Clean */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4 mb-10">
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by Symbol or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:border-primary-500 focus:bg-neutral-900 shadow-xl transition-all outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex p-1.5 bg-neutral-900/50 border border-neutral-800 rounded-2xl w-full sm:w-auto">
              {["all", "gainers", "losers"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterBy(f)}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${filterBy === f
                    ? "bg-primary-500 text-neutral-950 shadow-lg shadow-primary-500/20"
                    : "text-neutral-500 hover:text-white"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:min-w-[220px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-3.5 pl-11 pr-10 text-sm font-bold text-white outline-none focus:border-primary-500 appearance-none cursor-pointer transition-all shadow-xl"
              >
                <option value="name">Sort: Symbol A-Z</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
                <option value="change">Performance %</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                <ArrowDownRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        {isLoading && stocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">Syncing Market Data...</p>
          </div>
        ) : filteredStocks.length === 0 ? (
          <div className="text-center py-32 bg-neutral-900/30 rounded-[40px] border-2 border-neutral-800 border-dashed">
            <LayoutGrid className="w-20 h-20 text-neutral-800 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white">No Assets Found</h3>
            <p className="text-sm text-neutral-500 mt-2">Try different filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStocks.map((stock, index) => (
              <div key={stock.symbol} className="animate-slide-up" style={{ animationDelay: `${index * 20}ms` }}>
                <StockCard stock={stock} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
