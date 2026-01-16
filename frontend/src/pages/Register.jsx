import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { TrendingUp, AtSign, Lock, ShieldCheck, ArrowRight, Loader2, Zap, Shield, BarChart3 } from "lucide-react";

function Register() {
  const token = useSelector((state) => state.auth.token);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8000/api/auth/register",
        { email, password }
      );
      navigate("/login", { state: { message: "Account created! Please sign in." } });
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-primary-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-primary-500 p-3 rounded-2xl shadow-2xl shadow-primary-500/20 mb-6">
            <TrendingUp className="w-9 h-9 text-neutral-950" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-neutral-500 font-medium">
            Start your stock trading journey today
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                <p className="text-red-500 text-sm font-bold text-center">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-primary-500 outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-primary-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-primary-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-neutral-950 font-black py-4 rounded-2xl shadow-lg shadow-primary-500/10 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-800 text-center">
            <p className="text-neutral-500 font-medium mb-4">Already have an account?</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-4 border-2 border-neutral-800 text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all active:scale-95"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Minimal */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Zap, label: 'Speed' },
            { icon: Shield, label: 'Secure' },
            { icon: BarChart3, label: 'Insights' }
          ].map((item, idx) => (
            <div key={idx} className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-3 text-center">
              <item.icon className="w-5 h-5 text-primary-500 mx-auto mb-1 opacity-80" />
              <span className="text-[10px] font-black uppercase tracking-tighter text-neutral-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Register;
