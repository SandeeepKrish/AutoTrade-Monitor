import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

function Footer() {
    return (
        <footer className="bg-neutral-950 border-t border-neutral-900 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="bg-primary-500 p-1.5 rounded-lg shadow-lg shadow-primary-500/10">
                                <TrendingUp className="w-5 h-5 text-neutral-950" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Stock<span className="text-primary-500">Dash</span>
                            </span>
                        </Link>
                        <p className="text-neutral-500 text-sm max-w-xs">
                            Empowering traders with real-time insights and professional tools for the Indian Stock Market.
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-2">
                        <p className="text-neutral-400 text-sm font-medium">© 2026 StockDash Inc.</p>
                        <p className="text-neutral-600 text-xs text-center">Built for performance and precision.</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-8 gap-y-4 text-sm font-bold uppercase tracking-widest">
                        <Link to="/privacy" className="text-neutral-500 hover:text-primary-500 transition-colors">Privacy</Link>
                        <Link to="/terms" className="text-neutral-500 hover:text-primary-500 transition-colors">Terms</Link>
                        <Link to="/contact" className="text-neutral-500 hover:text-primary-500 transition-colors">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
