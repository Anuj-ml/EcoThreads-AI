
import React from 'react';
import { ArrowRight, Leaf, ScanLine, Globe, Sparkles, Footprints, ShieldCheck, Zap, Moon, Sun, ChevronRight, Github, Twitter, Linkedin } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, darkMode, toggleTheme }) => {
  return (
    <div className="min-h-screen bg-cream dark:bg-stone-950 text-ink dark:text-white transition-colors duration-500 overflow-x-hidden font-sans selection:bg-terracotta selection:text-white">
      
      {/* --- Navbar --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-800/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-ink dark:bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Leaf size={20} className="text-cream dark:text-ink" />
             </div>
             <span className="text-xl font-bold tracking-tight">EcoThreads</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500 dark:text-gray-400">
            <a href="#features" className="hover:text-ink dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-ink dark:hover:text-white transition-colors">How it Works</a>
            <a href="#impact" className="hover:text-ink dark:hover:text-white transition-colors">Impact</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={onStart}
              className="bg-ink dark:bg-white text-white dark:text-ink px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg hidden sm:flex items-center gap-2"
            >
              Launch App <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-terracotta/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sage/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-terracotta text-xs font-bold uppercase tracking-wider border border-orange-200 dark:border-orange-800/50 animate-fade-in-up">
                    <Sparkles size={14} /> New: Repair Cafe Locator
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight animate-fade-in-up delay-100">
                    Fashion, <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-orange-500">Conscious</span> of its Footprint.
                </h1>
                
                <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-lg mx-auto md:mx-0 leading-relaxed animate-fade-in-up delay-200">
                    Scan your wardrobe with AI to uncover materials, calculate carbon impact, and find sustainable alternatives in seconds.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 animate-fade-in-up delay-300">
                    <button 
                        onClick={onStart}
                        className="w-full sm:w-auto px-8 py-4 bg-ink dark:bg-white text-white dark:text-ink rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                    >
                        Start Analysis <ArrowRight size={20} />
                    </button>
                    <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full font-bold text-lg hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-all flex items-center justify-center gap-2">
                        Learn More
                    </a>
                </div>

                <div className="pt-8 flex items-center justify-center md:justify-start gap-6 opacity-70">
                    <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-cream dark:border-stone-950 bg-gray-200 overflow-hidden">
                                <img src={`https://picsum.photos/seed/${i+50}/100`} alt="User" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <div className="text-sm font-bold">
                        <span className="block text-xl">12k+</span>
                        <span className="text-gray-500">Items Scanned</span>
                    </div>
                </div>
            </div>

            {/* Hero Visual */}
            <div className="relative aspect-square md:aspect-[4/5] lg:aspect-square flex items-center justify-center animate-fade-in delay-200">
                 {/* Abstract Composition */}
                 <div className="relative w-full max-w-md">
                     {/* Floating Cards */}
                     <div className="absolute top-0 right-0 w-48 bg-white dark:bg-stone-800 p-4 rounded-2xl shadow-2xl border border-stone-100 dark:border-stone-700 z-20 animate-float-slow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-sage"><Leaf size={16} /></div>
                            <div className="text-xs font-bold">Organic Cotton</div>
                        </div>
                        <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                            <div className="h-full w-[90%] bg-sage rounded-full"></div>
                        </div>
                     </div>

                     <div className="absolute bottom-10 left-0 w-56 bg-white dark:bg-stone-800 p-4 rounded-2xl shadow-2xl border border-stone-100 dark:border-stone-700 z-20 animate-float-slow" style={{ animationDelay: '1.5s' }}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-terracotta"><Footprints size={16} /></div>
                            <div className="text-xs font-bold">Carbon Savings</div>
                        </div>
                        <div className="text-2xl font-black text-ink dark:text-white">12.5 kg</div>
                        <div className="text-[10px] text-gray-500">Compared to polyester</div>
                     </div>

                     {/* Main Image */}
                     <div className="w-full aspect-[3/4] bg-stone-900 rounded-[3rem] overflow-hidden shadow-2xl relative z-10 rotate-3 hover:rotate-0 transition-transform duration-700 group">
                        <img 
                            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800" 
                            alt="Sustainable Fashion" 
                            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" 
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        
                        {/* Scan Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-terracotta/80 shadow-[0_0_20px_rgba(217,93,57,0.8)] animate-scan"></div>
                     </div>
                 </div>
            </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id="features" className="py-24 bg-white dark:bg-stone-900 border-y border-stone-100 dark:border-stone-800">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
                <h2 className="text-4xl font-black mb-4">Intelligence meets <br/> Sustainability</h2>
                <p className="text-gray-500 dark:text-gray-400">Our hybrid AI engine combines computer vision with large language models to provide the most accurate environmental audit for your clothes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: ScanLine, title: "AI Visual Scan", desc: "Instantly identify fabric types and materials using on-device machine learning.", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                    { icon: Footprints, title: "Carbon Tracking", desc: "Calculate the precise CO2e and water footprint of every item in your wardrobe.", color: "text-terracotta", bg: "bg-orange-50 dark:bg-orange-900/20" },
                    { icon: ShieldCheck, title: "Brand Ethics", desc: "Deep dive into supply chain transparency and labor practices of major brands.", color: "text-sage", bg: "bg-green-50 dark:bg-green-900/20" },
                    { icon: Zap, title: "Instant Analysis", desc: "Powered by Gemini 2.5 Flash for millisecond-latency sustainability reports.", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
                    { icon: Globe, title: "Circular Economy", desc: "Locate nearby textile recycling centers and repair shops to extend lifecycle.", color: "text-periwinkle", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
                    { icon: Sparkles, title: "Gamified Impact", desc: "Earn badges and level up your eco-status by making better choices.", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" }
                ].map((feature, idx) => (
                    <div key={idx} className="p-8 rounded-3xl bg-cream dark:bg-stone-950 border border-stone-100 dark:border-stone-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                        <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
                            <feature.icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* --- How it Works --- */}
      <section id="how-it-works" className="py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-16 items-center">
                  <div className="flex-1 space-y-12">
                      <h2 className="text-4xl font-black">From Photo to <br/> Full Report.</h2>
                      
                      <div className="space-y-8">
                          {[
                              { step: "01", title: "Capture", desc: "Snap a photo of any clothing item or tag using your camera." },
                              { step: "02", title: "Analyze", desc: "Our AI identifies materials and cross-references sustainability databases." },
                              { step: "03", title: "Act", desc: "Get repair guides, recycling locations, and better alternatives." }
                          ].map((item, i) => (
                              <div key={i} className="flex gap-6 group">
                                  <div className="text-3xl font-black text-stone-200 dark:text-stone-800 group-hover:text-terracotta transition-colors">
                                      {item.step}
                                  </div>
                                  <div>
                                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                      <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
                                  </div>
                              </div>
                          ))}
                      </div>

                      <button onClick={onStart} className="flex items-center gap-2 font-bold text-terracotta hover:gap-4 transition-all">
                          Try it now <ChevronRight size={20} />
                      </button>
                  </div>

                  <div className="flex-1 relative">
                      <div className="absolute inset-0 bg-terracotta/20 blur-[100px] rounded-full"></div>
                      {/* App Mockup */}
                      <div className="relative z-10 w-[300px] mx-auto bg-stone-900 rounded-[3rem] border-8 border-stone-800 shadow-2xl overflow-hidden aspect-[9/19]">
                          <div className="absolute inset-0 bg-stone-800 animate-pulse"></div>
                          {/* Simulated UI */}
                          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-20"></div>
                          <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-60" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-stone-900 rounded-t-3xl">
                               <div className="w-12 h-1 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-4"></div>
                               <div className="text-2xl font-black mb-2">92/100</div>
                               <div className="flex gap-2 mb-4">
                                   <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Eco-Friendly</span>
                               </div>
                               <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                   <div className="w-[92%] h-full bg-green-500"></div>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-ink text-white py-16 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Leaf size={16} className="text-ink" />
                      </div>
                      <span className="text-xl font-bold">EcoThreads</span>
                  </div>
                  <p className="text-gray-400 max-w-sm leading-relaxed">
                      Empowering consumers to make transparent, ethical, and sustainable fashion choices through the power of Artificial Intelligence.
                  </p>
              </div>

              <div>
                  <h4 className="font-bold mb-6">Platform</h4>
                  <ul className="space-y-4 text-gray-400 text-sm">
                      <li><a href="#" className="hover:text-white transition-colors">Visual Analysis</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Supply Chain</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Repair Network</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
                  </ul>
              </div>

              <div>
                  <h4 className="font-bold mb-6">Company</h4>
                  <ul className="space-y-4 text-gray-400 text-sm">
                      <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Sustainability Data</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  </ul>
              </div>
          </div>

          <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-500 text-sm">© 2024 EcoThreads AI. All rights reserved.</p>
              <div className="flex gap-6">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
              </div>
          </div>
      </footer>
    </div>
  );
};
