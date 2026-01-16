import { ShieldAlert, Info, Lock, Activity } from "lucide-react";

function Terms() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black mb-4 uppercase tracking-tight">Terms of <span className="text-primary-500">Service</span></h1>
                    <p className="text-neutral-500 font-medium">Please read our trading policies and risk disclosures carefully.</p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 md:p-12 shadow-2xl space-y-12">
                    <section className="flex gap-6">
                        <div className="bg-primary-500/10 p-3 rounded-xl h-fit">
                            <ShieldAlert className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-4">1. Investment Risk Disclaimer</h2>
                            <p className="text-neutral-400 leading-relaxed font-medium">
                                Stock trading involves significant risk. Prices can fluctuate wildly and you may lose some or all of your invested capital.
                                The information provided by StockDash is for educational and informational purposes only and does not constitute financial, investment, or legal advice.
                            </p>
                        </div>
                    </section>

                    <section className="flex gap-6">
                        <div className="bg-primary-500/10 p-3 rounded-xl h-fit">
                            <Activity className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-4">2. Accuracy of Stock Data</h2>
                            <p className="text-neutral-400 leading-relaxed font-medium">
                                While we strive to provide real-time market data, technical delays, market volatility, or third-party provider issues may result in inaccuracies.
                                StockDash is not liable for any losses incurred due to data lagging or errors.
                            </p>
                        </div>
                    </section>

                    <section className="flex gap-6">
                        <div className="bg-primary-500/10 p-3 rounded-xl h-fit">
                            <Info className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-4">3. Automated Trading & Alerts</h2>
                            <p className="text-neutral-400 leading-relaxed font-medium">
                                Our "Auto-Cart" and alert features are tools to assist your trading. They do not guarantee execution at a specific price.
                                Final trade decisions and executions are the sole responsibility of the user.
                            </p>
                        </div>
                    </section>

                    <section className="flex gap-6">
                        <div className="bg-primary-500/10 p-3 rounded-xl h-fit">
                            <Lock className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-4">4. Account Security</h2>
                            <p className="text-neutral-400 leading-relaxed font-medium">
                                Users are responsible for maintaining the confidentiality of their login credentials. Any activity performed through your account will be deemed your own.
                            </p>
                        </div>
                    </section>

                    <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-2xl group border-l-4 border-l-primary-500">
                        <h3 className="font-bold text-white mb-2 uppercase tracking-widest text-xs flex items-center gap-2">
                            Critical Notice
                        </h3>
                        <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                            By using this platform, you acknowledge that you understand the risks associated with the Indian Stock Market (NSE/BSE) and agree to trade responsibly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Terms;
