import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { ShoppingCart, User, LogOut, TrendingUp, Menu, X, Zap, ChevronDown } from "lucide-react";
import { useState } from "react";
import RulesModal from "../Modals/RulesModal";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsRulesOpen(false);
  };

  return (
    <nav className="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-50 transition-all duration-300">
      <div className="w-full px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between h-20 sm:h-22">
          {/* Logo - Standardized */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="bg-primary-500 p-2.5 rounded-2xl shadow-xl shadow-primary-500/20 group-hover:scale-105 transition-all duration-300">
              <TrendingUp className="w-6 h-6 text-neutral-950" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tighter">
              Stock<span className="text-primary-500">Dash</span>
            </span>
          </Link>

          {/* Desktop Navigation - Wide and Large Font */}
          <div className="hidden lg:flex items-center space-x-12">
            {user && (
              <>
                <Link
                  to="/"
                  className="text-lg font-bold text-neutral-400 hover:text-white transition-all hover:scale-105"
                >
                  Market
                </Link>
                <button
                  onClick={() => setIsRulesOpen(true)}
                  className="text-lg font-bold text-neutral-400 hover:text-primary-500 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Bots
                </button>
                <Link
                  to="/cart"
                  className="relative flex items-center space-x-3 text-lg text-neutral-400 hover:text-primary-500 transition-all font-bold group"
                >
                  <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />
                  <span>Cart</span>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-3 -right-4 bg-primary-500 text-neutral-950 text-xs font-black rounded-full h-6 w-6 flex items-center justify-center border-2 border-neutral-950 shadow-lg animate-pulse">
                      {cartItems.length}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-5 pl-8 border-l border-neutral-800 focus:outline-none group"
                  >
                    <div className="text-right">
                      <p className="text-base font-black text-white truncate max-w-[180px] group-hover:text-primary-500 transition-colors">
                        {user.email.split('@')[0]}
                      </p>
                      <p className="text-xs font-black text-primary-500 uppercase tracking-widest">Verified Trader</p>
                    </div>
                    <div className={`bg-neutral-800 rounded-2xl p-2.5 border transition-all ${isProfileOpen ? 'ring-4 ring-primary-500/20 border-primary-500' : 'border-neutral-700 group-hover:border-neutral-500'}`}>
                      <User className="w-6 h-6 text-primary-500" />
                    </div>
                    <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown - Professional & Spacious */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-6 w-80 bg-neutral-900 border border-neutral-800 rounded-[32px] shadow-2xl p-7 animate-slide-up z-[60]">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>

                      <div className="relative">
                        <div className="pb-6 border-b border-neutral-800">
                          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Account Control</p>
                          <p className="text-white font-black truncate text-lg">{user.email}</p>
                        </div>

                        <div className="py-6 space-y-6">
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Active Orders</span>
                            <span className="bg-primary-500 text-neutral-950 px-4 py-1.5 rounded-full font-black text-sm">{cartItems.length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Market Status</span>
                            <span className="flex items-center gap-2 text-primary-500 font-black text-sm">
                              <span className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-pulse"></span>
                              Live Sync
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 space-y-4">
                          <button
                            onClick={() => { setIsRulesOpen(true); setIsProfileOpen(false); }}
                            className="w-full flex items-center space-x-4 p-4 rounded-2xl bg-neutral-800/50 hover:bg-primary-500 hover:text-neutral-950 transition-all text-base font-black group/item"
                          >
                            <Zap className="w-5 h-5 text-primary-500 group-hover/item:text-neutral-950" />
                            <span>Market Bots</span>
                          </button>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-red-500/10 transition-all text-base font-black text-red-500 group/logout"
                          >
                            <LogOut className="w-5 h-5 group-hover/logout:translate-x-1 transition-transform" />
                            <span>Close Session</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {!user && (
              <div className="flex items-center space-x-8">
                <Link
                  to="/login"
                  className="text-lg font-black text-neutral-400 hover:text-white transition-colors tracking-tight"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-neutral-950 font-black text-base rounded-2xl shadow-2xl shadow-primary-500/30 transition-all active:scale-95"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-6">
            {user && (
              <Link to="/cart" className="relative p-3 bg-neutral-900 rounded-xl text-neutral-400">
                <ShoppingCart className="w-7 h-7" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-neutral-950 text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-neutral-950">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 bg-neutral-900 rounded-xl text-neutral-400 hover:text-white"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Expansion */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-24 bottom-0 bg-neutral-950/95 backdrop-blur-xl z-50 animate-fade-in flex flex-col p-8 space-y-8">
          {user ? (
            <>
              <div className="p-8 bg-neutral-900 rounded-[32px] border border-neutral-800">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-primary-500 p-4 rounded-3xl">
                    <User className="w-8 h-8 text-neutral-950" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-white">{user.email.split('@')[0]}</p>
                    <p className="text-xs font-bold text-primary-500 tracking-[0.3em] uppercase">Verified Member</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-950 p-6 rounded-2xl text-center border border-neutral-800">
                    <p className="text-2xl font-black text-primary-500">{cartItems.length}</p>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">In Cart</p>
                  </div>
                  <div className="bg-neutral-950 p-6 rounded-2xl text-center border border-neutral-800">
                    <p className="text-2xl font-black text-white">0</p>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">Bought</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center space-x-4 p-6 bg-neutral-900 rounded-[28px] text-xl font-black text-white">
                  <TrendingUp className="w-6 h-6 text-primary-500" />
                  <span>Market Dashboard</span>
                </Link>
                <button onClick={() => { setIsRulesOpen(true); setIsMenuOpen(false); }} className="w-full flex items-center space-x-4 p-6 bg-neutral-900 rounded-[28px] text-xl font-black text-white">
                  <Zap className="w-6 h-6 text-primary-500" />
                  <span>Market Bots</span>
                </button>
                <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center space-x-4 p-6 bg-neutral-900 rounded-[28px] text-xl font-black text-white">
                  <ShoppingCart className="w-6 h-6 text-primary-500" />
                  <span>Shopping Cart</span>
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="mt-auto w-full flex items-center justify-center space-x-4 p-6 bg-red-500/10 text-red-500 font-black text-lg rounded-[28px] border border-red-500/20 shadow-lg shadow-red-500/5 active:scale-95 transition-all"
              >
                <LogOut className="w-6 h-6" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col h-full items-center justify-center space-y-8">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black text-white">Login</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-6 bg-primary-500 text-neutral-950 text-center text-3xl font-black rounded-[32px]">Get Started</Link>
            </div>
          )}
        </div>
      )}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </nav>
  );
}

export default Navbar;
