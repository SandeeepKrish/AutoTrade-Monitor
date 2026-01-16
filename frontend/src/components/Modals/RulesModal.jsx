import { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Zap, AlertCircle, Loader2, Target } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function RulesModal({ isOpen, onClose }) {
    const [rules, setRules] = useState([]);
    const [adding, setAdding] = useState(false);
    const [isInRange, setIsInRange] = useState(false);
    const [matchingSymbol, setMatchingSymbol] = useState("");
    const [newRule, setNewRule] = useState({
        symbol: "",
        min_price: "",
        max_price: "",
        quantity: 1
    });

    const fetchRules = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/rules", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setRules(response.data);
        } catch (err) {
            console.error("Failed to fetch rules", err);
        }
    };

    // Check if any rule is currently matching live prices for the visual spinner
    const checkPriceMatches = async () => {
        if (rules.length === 0) {
            setIsInRange(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8000/api/stocks", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const liveStocks = response.data;

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
        } catch (err) {
            console.error("Match check failed", err);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchRules();
            const interval = setInterval(checkPriceMatches, 3000);
            return () => clearInterval(interval);
        }
    }, [isOpen, rules]);

    const handleAddRule = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            await axios.post("http://localhost:8000/api/rules", {
                ...newRule,
                min_price: parseFloat(newRule.min_price),
                max_price: parseFloat(newRule.max_price),
                quantity: parseInt(newRule.quantity)
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            toast.success("Automation rule added!");
            setNewRule({ symbol: "", min_price: "", max_price: "", quantity: 1 });
            fetchRules();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to add rule");
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteRule = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/rules/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            toast.error("Rule deleted");
            fetchRules();
        } catch (err) {
            toast.error("Failed to delete rule");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-neutral-900 border border-neutral-800 w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row">

                {/* Left Side: Form & List */}
                <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-neutral-800">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary-500 p-3 rounded-2xl shadow-lg shadow-primary-500/20">
                                <Zap className="w-6 h-6 text-neutral-950" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Automation Engine</h2>
                                <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em]">Market Intelligence v2.0</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="md:hidden p-2 hover:bg-neutral-800 rounded-full text-neutral-500">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Create Form */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-primary-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                                Initialize Bot
                            </h3>
                            <form onSubmit={handleAddRule} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 ml-1">Asset Symbol</label>
                                    <input
                                        required
                                        placeholder="e.g. RELIANCE"
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-4 px-5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 outline-none text-sm font-bold uppercase transition-all"
                                        value={newRule.symbol}
                                        onChange={e => setNewRule({ ...newRule, symbol: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 ml-1">Min Price (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            placeholder="2400"
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-4 px-5 text-white focus:border-primary-500 outline-none text-sm font-bold"
                                            value={newRule.min_price}
                                            onChange={e => setNewRule({ ...newRule, min_price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 ml-1">Max Price (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            placeholder="2500"
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-4 px-5 text-white focus:border-primary-500 outline-none text-sm font-bold"
                                            value={newRule.max_price}
                                            onChange={e => setNewRule({ ...newRule, max_price: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 ml-1">Quantity</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-4 px-5 text-white focus:border-primary-500 outline-none text-sm font-bold"
                                        value={newRule.quantity}
                                        onChange={e => setNewRule({ ...newRule, quantity: e.target.value })}
                                    />
                                </div>
                                <button
                                    disabled={adding}
                                    className="group w-full bg-primary-500 hover:bg-primary-600 text-neutral-950 font-black py-4 rounded-2xl shadow-xl shadow-primary-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {adding ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                        <><Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Start Deployment</>
                                    }
                                </button>
                            </form>
                        </div>

                        {/* List */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Live Targets
                            </h3>
                            <div className="space-y-3 max-h-[320px] overflow-y-auto no-scrollbar pr-2">
                                {rules.length === 0 ? (
                                    <div className="py-12 border-2 border-dashed border-neutral-800 rounded-[32px] text-center">
                                        <AlertCircle className="w-10 h-10 text-neutral-700 mx-auto mb-4" />
                                        <p className="text-[10px] text-neutral-600 font-black uppercase tracking-widest">No Active Missions</p>
                                    </div>
                                ) : (
                                    rules.map(rule => (
                                        <div key={rule.id} className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl group flex items-center justify-between border-l-4 border-l-primary-500 hover:bg-neutral-900 transition-colors">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-black text-white tracking-tight">{rule.symbol}</span>
                                                    <span className={`w-2 h-2 rounded-full ${rule.active ? 'bg-primary-500 animate-pulse' : 'bg-neutral-800'}`}></span>
                                                </div>
                                                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">
                                                    ₹{rule.min_price} - ₹{rule.max_price} • {rule.quantity} Qty
                                                </p>
                                            </div>
                                            <button onClick={() => handleDeleteRule(rule.id)} className="p-3 bg-neutral-900 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-neutral-800">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Futuristic Spinner */}
                <div className={`hidden md:flex flex-[0.7] bg-neutral-950 items-center justify-center relative overflow-hidden group/spinner`}>
                    {/* Background Decorative Circles */}
                    <div className={`absolute inset-0 opacity-20 transition-colors duration-1000 ${isInRange ? 'bg-primary-500/10' : 'bg-blue-500/5'}`}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-neutral-800 rounded-full opacity-20"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-neutral-800 rounded-full opacity-40"></div>

                    {/* Main Futuristic Spinner */}
                    <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
                        {/* Outermost Ring */}
                        <div className={`absolute inset-0 rounded-full border-4 border-dashed animate-[spin_10s_linear_infinite] transition-colors duration-700 ${isInRange ? 'border-primary-500' : 'border-blue-500/30'}`}></div>

                        {/* Middle Ring */}
                        <div className={`absolute inset-4 rounded-full border-2 border-dotted animate-[spin_15s_linear_infinite_reverse] opacity-50 transition-colors duration-700 ${isInRange ? 'border-primary-400' : 'border-blue-400/20'}`}></div>

                        {/* Inner Glow Circle */}
                        <div className={`absolute inset-12 rounded-full blur-3xl transition-all duration-1000 ${isInRange ? 'bg-primary-500/20 scale-125' : 'bg-blue-500/10 scale-100'}`}></div>

                        {/* Center Component */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                            <div className={`mb-6 p-6 rounded-full border transition-all duration-700 ${isInRange ? 'bg-primary-500/20 border-primary-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 'bg-neutral-900 border-neutral-800 shadow-none'}`}>
                                <Zap className={`w-12 h-12 transition-colors duration-700 ${isInRange ? 'text-primary-500 animate-pulse' : 'text-neutral-700'}`} />
                            </div>

                            <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 transition-colors duration-700 ${isInRange ? 'text-primary-500' : 'text-neutral-500'}`}>
                                {isInRange ? 'Target Locked' : 'Scanning Market'}
                            </p>
                            <p className="text-2xl font-black text-white tracking-widest uppercase">
                                {isInRange ? matchingSymbol : 'Idle'}
                            </p>

                            {isInRange && (
                                <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full animate-bounce">
                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                    <span className="text-[8px] font-black text-primary-500 uppercase tracking-widest">Executing Protocol</span>
                                </div>
                            )}
                        </div>

                        {/* Scanning Lines (Optional) */}
                        <div className={`absolute top-0 bottom-0 left-1/2 w-px scale-y-150 animate-[spin_4s_linear_infinite] transition-colors ${isInRange ? 'bg-primary-500/50' : 'bg-blue-500/20'}`}></div>
                    </div>

                    <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-neutral-800 rounded-2xl transition-all text-neutral-500 hover:text-white border border-transparent hover:border-neutral-700">
                        <X className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-8 text-center px-12">
                        <p className="text-[10px] text-neutral-600 font-bold leading-relaxed max-w-xs mx-auto">
                            {isInRange
                                ? "Stock identified within operational parameters. Bot sequence initiated for automatic acquisition."
                                : "Continuous synchronization with neural market grid active. Waiting for asset range alignment."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RulesModal;
