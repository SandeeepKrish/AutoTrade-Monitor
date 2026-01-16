import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authSlice";
import axios from "axios";
import { TrendingUp, AtSign, Lock, ArrowRight, Loader2 } from "lucide-react";

function Login() {
  const token = useSelector((state) => state.auth.token);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        formData
      );

      const { user, token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser({ user, token }));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-primary-500 p-3 rounded-2xl shadow-2xl shadow-primary-500/20 mb-6">
            <TrendingUp className="w-9 h-9 text-neutral-950" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-neutral-500 font-medium">
            Access your trading dashboard securely
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-shake">
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
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center group cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-800 bg-neutral-950 text-primary-500 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-neutral-500 group-hover:text-neutral-300 transition-colors font-medium">Remember me</span>
              </label>
              <a href="#" className="text-sm font-bold text-primary-500 hover:text-primary-400 transition-colors">Forgot Password?</a>
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
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-800 text-center">
            <p className="text-neutral-500 font-medium mb-4">New to StockDash?</p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center w-full py-4 border-2 border-neutral-800 text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all active:scale-95"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-neutral-600 font-medium">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-neutral-500 hover:underline">Terms</Link> and{" "}
            <Link to="/privacy" className="text-neutral-500 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
