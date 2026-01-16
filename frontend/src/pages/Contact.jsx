import { useState } from "react";
import { Mail, Clock, Send, Loader2, MessageSquare, User, AtSign, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Message sent successfully!", {
                    style: {
                        borderRadius: '12px',
                        background: '#171717',
                        color: '#fff',
                        border: '1px solid #262626'
                    },
                });
                setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
            } else {
                throw new Error("Failed to send message");
            }
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary-500/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-primary-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl font-black tracking-tight mb-3">Get in <span className="text-primary-500">Touch</span></h1>
                    <p className="text-neutral-500 text-base font-medium max-w-xl mx-auto">
                        Need technical assistance or have questions about the markets? Our expert team is ready to assist you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-2 space-y-5 animate-slide-up">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-8 shadow-2xl">
                            <div>
                                <h3 className="text-lg font-bold mb-6">Contact Information</h3>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4 group">
                                        <div className="bg-primary-500/10 p-3 rounded-xl group-hover:bg-primary-500/20 transition-all">
                                            <Mail className="w-5 h-5 text-primary-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Email Support</p>
                                            <p className="text-base font-bold text-white">2022d1r020@mietjammu.in</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="bg-primary-500/10 p-3 rounded-xl group-hover:bg-primary-500/20 transition-all">
                                            <Clock className="w-5 h-5 text-primary-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Response Time</p>
                                            <p className="text-base font-bold text-white">Within 12-24 Hours</p>
                                            <p className="text-xs text-neutral-500 mt-0.5 font-medium">Mon - Fri • 9 AM - 6 PM IST</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-neutral-800 flex items-center justify-between">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`w-10 h-10 rounded-full border-2 border-neutral-950 bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-500`}>
                                            AD{i}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Active Support Agents</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:border-primary-500 outline-none transition-all placeholder:text-neutral-700 font-medium"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                        <div className="relative">
                                            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:border-primary-500 outline-none transition-all placeholder:text-neutral-700 font-medium"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">Inquiry Subject</label>
                                    <div className="relative">
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
                                        <select
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-5 text-white focus:border-primary-500 outline-none transition-all appearance-none font-bold text-sm cursor-pointer"
                                        >
                                            <option>General Inquiry</option>
                                            <option>Technical Issue</option>
                                            <option>Stock Data Error</option>
                                            <option>Account & Billing</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">Your Message</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-neutral-600" />
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-11 pr-5 text-white text-sm focus:border-primary-500 outline-none transition-all placeholder:text-neutral-700 font-medium resize-none"
                                            placeholder="Write your message here..."
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary-500 hover:bg-primary-600 text-neutral-950 font-black py-3 rounded-xl shadow-lg shadow-primary-500/10 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 text-sm"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
