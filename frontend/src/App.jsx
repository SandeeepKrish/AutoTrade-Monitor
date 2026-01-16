import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StockDetails from "./pages/StockDetails";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

import { Toaster } from 'react-hot-toast';
import { setCart, addToCart, removeFromCart } from "./redux/cartSlice";
import toast from "react-hot-toast";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  // Sync Cart with Backend on Mount/Login
  useEffect(() => {
    if (token) {
      const fetchCart = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/cart", {
            headers: { Authorization: `Bearer ${token}` }
          });
          dispatch(setCart(response.data.items));
        } catch (err) {
          console.error("Failed to sync cart", err);
        }
      };
      fetchCart();
    }
  }, [token, dispatch]);

  // WebSocket Listener for Automation Triggers (Smart Buy/Remove Notifications)
  useEffect(() => {
    if (token && user) {
      const socket = new WebSocket(`ws://localhost:8000/ws/${user.id}`);

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const stock = data.item;

          if (data.type === "cart_add") {
            dispatch(addToCart(stock));
            toast.success(
              <div className="flex flex-col gap-1">
                <p className="font-black text-xs uppercase tracking-widest text-emerald-200">Bot: Target Reached</p>
                <p className="text-sm">Added <span className="font-black text-white">{stock.quantity}</span> shares of <span className="font-black text-white">{stock.symbol}</span></p>
                <p className="text-[10px] opacity-70">Price moved into your designated range.</p>
              </div>,
              {
                icon: '🤖',
                duration: 5000,
                style: { borderRadius: '16px', background: '#10b981', color: '#fff', border: '1px solid #059669' },
              }
            );
          } else if (data.type === "cart_remove") {
            dispatch(removeFromCart(stock.symbol));
            toast.error(
              <div className="flex flex-col gap-1">
                <p className="font-black text-xs uppercase tracking-widest text-red-200">Bot: Price Shift</p>
                <p className="text-sm">Removed <span className="font-black text-white">{stock.symbol}</span> from cart</p>
                <p className="text-[10px] opacity-80">Asset price moved outside your target range.</p>
              </div>,
              {
                icon: '🚀',
                duration: 5000,
                style: { borderRadius: '16px', background: '#dc2626', color: '#fff', border: '1px solid #991b1b' },
              }
            );
          }
        } catch (err) {
          console.error("WS Message Parse Error", err);
        }
      };

      return () => socket.close();
    }
  }, [token, user, dispatch]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Global Cyber Background Elements */}
      <div className="cyber-background">
        <div className="cyber-grid"></div>

        {/* Bold Green Global Lines */}
        <div className="global-data-line text-primary-500 left-[15%] top-[-20%]" style={{ animationDelay: '0s', width: '3px' }}></div>
        <div className="global-data-line text-primary-500 left-[65%] top-[-20%]" style={{ animationDelay: '4s', width: '3px' }}></div>

        {/* Bold Red Global Lines */}
        <div className="global-data-line text-red-500 left-[40%] top-[-20%]" style={{ animationDelay: '2s', width: '3px' }}></div>
        <div className="global-data-line text-red-500 left-[85%] top-[-20%]" style={{ animationDelay: '6s', width: '3px' }}></div>

        {/* Bold Horizontal Global Lines */}
        <div className="global-data-line-h text-primary-500 top-[25%] left-[-10%]" style={{ animationDelay: '1s', height: '3px' }}></div>
        <div className="global-data-line-h text-red-500 top-[75%] left-[-10%]" style={{ animationDelay: '5s', height: '3px' }}></div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <main className="flex-grow z-10">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/stocks/:symbol" element={<StockDetails />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
