import { ShieldCheck, Eye, Lock, FileText } from "lucide-react";

function Privacy() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl font-black mb-4 uppercase tracking-tight">Privacy <span className="text-primary-500">Policy</span></h1>
                    <p className="text-neutral-500 font-medium">Protecting your data and your digital assets is our top priority.</p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 md:p-12 shadow-2xl space-y-12 animate-slide-up">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 bg-primary-500/10 w-fit px-3 py-1 rounded-full">Last Updated: January 15, 2026</p>

                    <section className="flex gap-6">
                        <div className="bg-primary-500/10 p-3 rounded-xl h-fit">
                            <Eye className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-4">1. Information Collection</h2>
                            <p className="text-neutral-400 leading-relaxed font-medium">
                                When you register on StockDash, we collect your email address and password (securely hashed) to provide you with personalized trading features, portfolio tracking, and custom alerts.
                            </p>
                        </div>
                    </section>

                    <section className="flex gap-6">
                        <div className="bg-primary-500/10 p-3 rounded-xl h-fit">
                            <ShieldCheck className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-4">2. Usage of Data</h2>
                            <p className="text-neutral-400 leading-relaxed font-medium">
                                Your stock preferences, watchlist, and automated cart triggers are used solely to enhance your user experience. We do not sell your personal data or trading habits to third-party marketing companies.
                            </p>
                        </div>
                    </section>

                    <section className="flex gap-6">
                        <div className="bg-primary-500/10 p-3 rounded-xl h-fit">
                            <Lock className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-4">3. Security Measures</h2>
                            <p className="text-neutral-400 leading-relaxed font-medium">
                                We implement industry-standard encryption (PBKDF2) to protect your passwords and use Secure Sockets Layer (SSL) technology for data transmission between your browser and our servers.
                            </p>
                        </div>
                    </section>

                    <section className="flex gap-6">
                        <div className="bg-primary-500/10 p-3 rounded-xl h-fit">
                            <FileText className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-4">4. Cookies & Disclosure</h2>
                            <p className="text-neutral-400 leading-relaxed font-medium">
                                We use local storage and essential session cookies to keep you logged in. We may disclose your information strictly if required by Indian Law or to comply with a judicial proceeding or court order.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Privacy;
