
import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, ScanLine, Globe, Sparkles, Footprints, ShieldCheck, Zap, Moon, Sun, ArrowUpRight, Aperture, Code, Database, Microscope, Menu, X, Smartphone, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, darkMode, toggleTheme }) => {
  const [loading, setLoading] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Preloader Simulation
  useEffect(() => {
    // Just a timer to simulate loading the "woven" animation
    const timer = setTimeout(() => {
        setLoading(false);
    }, 3500); // 3.5s to let the animation play out
    return () => clearTimeout(timer);
  }, []);

  // Scroll Listener for Navbar
  useEffect(() => {
      const handleScroll = () => {
          setHasScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
      return (
          <div className="fixed inset-0 bg-[#FDF8E4] dark:bg-[#080808] z-[100] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden">
              <style>{`
                 @keyframes weave {
                   0% { stroke-dashoffset: 100%; opacity: 0; }
                   10% { opacity: 1; }
                   100% { stroke-dashoffset: 0; opacity: 1; }
                 }
                 @keyframes fadeInColor {
                   0% { fill-opacity: 0; }
                   100% { fill-opacity: 1; }
                 }
                 .woven-text {
                   fill: transparent;
                   stroke: #D95D39;
                   stroke-width: 1.5px;
                   stroke-dasharray: 400; /* Approximate path length for letters */
                   stroke-dashoffset: 400;
                   animation: weave 2.5s cubic-bezier(0.3, 0, 0.2, 1) forwards;
                   font-family: 'Playfair Display', serif;
                   font-style: italic;
                 }
                 .woven-text-fill {
                   fill: currentColor;
                   stroke: none;
                   fill-opacity: 0;
                   animation: fadeInColor 1s ease-out forwards 2.2s;
                 }
                 .thread-guide {
                    stroke-dasharray: 10;
                    animation: dash 20s linear infinite;
                 }
                 @keyframes dash {
                    to { stroke-dashoffset: 1000; }
                 }
               `}</style>
              
              <div className="relative flex items-center justify-center w-full h-full text-[#1A1A1A] dark:text-[#FDF8E4]">
                  <div className="relative z-10 w-full max-w-4xl px-4">
                       <svg className="w-full h-auto" viewBox="0 0 600 150">
                           {/* Background decorative thread line */}
                           <path 
                             d="M-100,75 C100,150 200,0 300,75 C400,150 500,0 700,75" 
                             fill="none" 
                             stroke="currentColor" 
                             strokeWidth="0.5" 
                             opacity="0.1"
                             className="thread-guide"
                           />
                           
                           {/* The Woven Text Outline */}
                           <text 
                             x="50%" 
                             y="50%" 
                             dominantBaseline="middle" 
                             textAnchor="middle" 
                             fontSize="90" 
                             className="woven-text"
                           >
                               EcoThreads
                           </text>

                           {/* The Solid Text Fill (Fades in later) */}
                           <text 
                             x="50%" 
                             y="50%" 
                             dominantBaseline="middle" 
                             textAnchor="middle" 
                             fontSize="90" 
                             fontFamily="'Playfair Display', serif"
                             fontStyle="italic"
                             className="woven-text-fill"
                           >
                               EcoThreads
                           </text>
                       </svg>
                       <div className="text-center mt-4 font-sans text-xs font-bold uppercase tracking-[0.3em] opacity-0 animate-fade-in-up" style={{ animationDelay: '2.5s', animationFillMode: 'forwards' }}>
                           System Initialized
                       </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#080808] text-black dark:text-white transition-colors duration-700 font-sans selection:bg-[#002FA7] selection:text-white overflow-x-hidden relative">
      
      {/* --- Adaptive Navigation Bar --- */}
      {/* 
          Logic:
          - Initial (!hasScrolled): Transparent background, 'mix-blend-difference' to ensure visibility over both the light text section and the dark/image hero section.
          - Scrolled (hasScrolled): Glassmorphism (blur + semi-transparent bg), standard text colors, sticky behavior.
      */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 transition-all duration-500 ease-in-out ${
          hasScrolled 
          ? 'py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 shadow-sm text-black dark:text-white' 
          : 'py-6 bg-transparent mix-blend-difference text-white' 
      }`}>
          <div className="flex justify-between items-center max-w-[1920px] mx-auto">
            {/* Brand */}
            <div className="flex items-center gap-4 cursor-pointer group" onClick={toggleTheme}>
                <div className={`relative w-8 h-8 flex items-center justify-center border rounded-full transition-colors ${hasScrolled ? 'border-black/10 dark:border-white/30 group-hover:border-black dark:group-hover:border-white' : 'border-white/30 group-hover:border-white'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${hasScrolled ? 'bg-black dark:bg-white' : 'bg-white'}`}></div>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold uppercase tracking-widest leading-none">EcoThreads</span>
                </div>
            </div>

            {/* Menu / Actions */}
            <div className="flex items-center gap-6">
                <button onClick={toggleTheme} className={`hidden md:block text-[10px] font-bold uppercase tracking-widest transition-colors ${hasScrolled ? 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white' : 'text-white/80 hover:text-white'}`}>
                    {darkMode ? 'Light' : 'Dark'}
                </button>
                <button 
                    onClick={onStart}
                    className={`flex items-center gap-3 px-6 py-2 rounded-full transition-all duration-300 group ${
                        hasScrolled 
                        ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-[#D95D39] dark:hover:bg-[#D95D39] hover:text-white' 
                        : 'bg-white text-black hover:bg-[#D95D39] hover:text-white'
                    }`}
                >
                    <span className="text-[10px] font-bold uppercase tracking-widest">Start Analysis</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative h-screen w-full flex flex-col md:flex-row">
          
          {/* Left: Typography */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-6 md:px-12 pt-20 md:pt-0 border-r border-black/5 dark:border-white/5 bg-[#F4F4F4] dark:bg-[#080808]">
              <h1 className="text-[12vw] md:text-[8vw] font-serif italic leading-[0.85] tracking-tight mb-6 animate-fade-in-up">
                  The <br/>
                  <span className="text-[#002FA7]">Naked</span> <br/>
                  Truth
              </h1>
              <p className="max-w-xs text-sm font-medium opacity-60 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Deconstruct your wardrobe. Decode the materials. 
                  The first AI-powered sustainability auditor for the modern aesthetic.
              </p>
              
              <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <button onClick={onStart} className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-[#002FA7] dark:hover:bg-[#002FA7] hover:text-white transition-colors">
                      Begin Analysis
                  </button>
              </div>
          </div>

          {/* Right: Visual */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden group">
              {/* Overlay: Fades OUT on hover to reveal true colors */}
              <div className="absolute inset-0 bg-[#002FA7] mix-blend-color z-10 opacity-60 group-hover:opacity-0 transition-opacity duration-700 ease-in-out"></div>
              
              {/* Hero Image: Grayscale by default, Full Color on hover */}
              <img 
                src="https://images.unsplash.com/photo-1643286131725-5e0ad3b3ca02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHN1c3RhaW5hYmxlJTIwZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 contrast-125 group-hover:scale-105 transition-all duration-700 ease-in-out"
                alt="Sustainable Fashion"
              />
              
              {/* Center Icon: Fades out on hover */}
              <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                   <div className="w-32 h-32 rounded-full border border-white flex items-center justify-center animate-spin-slow text-white">
                        <ScanLine size={32} />
                   </div>
              </div>
          </div>
      </section>

      {/* --- Marquee --- */}
      <div className="border-y border-black/10 dark:border-white/10 py-6 overflow-hidden">
          <div className="whitespace-nowrap flex gap-24 animate-scan opacity-40 hover:opacity-100 transition-opacity">
              {[...Array(6)].map((_, i) => (
                  <span key={i} className="text-xl md:text-2xl font-serif italic tracking-wide">
                      Radical Transparency <span className="font-sans not-italic text-xs font-bold align-top text-[#002FA7]">v2.0</span>
                  </span>
              ))}
          </div>
      </div>

      {/* --- Manifesto --- */}
      <section id="manifesto" className="py-32 px-6 md:px-12 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="w-full md:w-1/4">
                  <span className="text-[#002FA7] text-xs font-bold uppercase tracking-widest block mb-2">01 / The Mission</span>
                  <div className="h-px w-12 bg-black dark:bg-white"></div>
              </div>
              <div className="w-full md:w-3/4">
                  <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8">
                      We believe that <span className="italic text-[#002FA7]">true luxury</span> is knowing the cost of your choices.
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm font-medium leading-relaxed opacity-70">
                      <p>
                          Fashion is the second most polluting industry in the world. Yet, the data remains opaque, hidden behind greenwashing and marketing jargon. 
                      </p>
                      <p>
                          EcoThreads utilizes edge computing and generative AI to perform forensic audits on your garments instantly. No labs. No delays. Just truth.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- App Interface Preview Section --- */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-[#111] border-y border-black/5 dark:border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
              
              {/* Text Side */}
              <div className="w-full md:w-1/2 space-y-8 order-2 md:order-1">
                   <div>
                      <span className="text-[#D95D39] text-xs font-bold uppercase tracking-widest block mb-2">02 / Interface</span>
                      <h2 className="text-4xl md:text-5xl font-serif italic text-black dark:text-white mb-6">
                          Pocket Intelligence.
                      </h2>
                      <p className="text-sm opacity-60 leading-relaxed max-w-md">
                          The EcoThreads dashboard translates complex lifecycle data into a single, verified Eco-Score. Access carbon footprint metrics, water savings, and actionable care guides in seconds.
                      </p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                       <div className="p-4 border border-black/5 dark:border-white/5 rounded-xl bg-white dark:bg-black/20">
                           <Zap className="w-6 h-6 text-[#002FA7] mb-3" />
                           <h4 className="font-bold text-sm">Instant Audit</h4>
                           <p className="text-xs opacity-50 mt-1">Real-time analysis via Edge AI.</p>
                       </div>
                       <div className="p-4 border border-black/5 dark:border-white/5 rounded-xl bg-white dark:bg-black/20">
                           <ShieldCheck className="w-6 h-6 text-[#D95D39] mb-3" />
                           <h4 className="font-bold text-sm">Verified Data</h4>
                           <p className="text-xs opacity-50 mt-1">Cross-referenced with global registries.</p>
                       </div>
                   </div>

                   <button onClick={onStart} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#002FA7] transition-colors group">
                       Try the Demo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                   </button>
              </div>

              {/* Phone Mockup Side */}
              <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2">
                  <div className="relative w-[300px] h-[600px] bg-[#1A1A1A] rounded-[3rem] border-[8px] border-[#2A2A2A] shadow-2xl overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2A2A2A] rounded-b-xl z-20"></div>
                      
                      {/* Screen Content Mockup */}
                      <div className="w-full h-full bg-[#FDF8E4] dark:bg-[#080808] flex flex-col relative">
                          {/* Mock Image Header */}
                          <div className="h-48 bg-gray-200 relative">
                              <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60" className="w-full h-full object-cover opacity-80" alt="Mock Scan" />
                              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-white dark:bg-stone-900 rounded-full flex items-center justify-center shadow-lg border-4 border-[#FDF8E4] dark:border-[#080808]">
                                  <div className="relative w-full h-full flex items-center justify-center">
                                      <svg className="w-full h-full p-1 transform -rotate-90" viewBox="0 0 100 100">
                                          <circle cx="50" cy="50" r="45" stroke="#eee" strokeWidth="6" fill="transparent" />
                                          <circle cx="50" cy="50" r="45" stroke="#8A9A5B" strokeWidth="6" fill="transparent" strokeDasharray="283" strokeDashoffset="30" strokeLinecap="round" />
                                      </svg>
                                      <span className="absolute text-xl font-black text-black dark:text-white">92</span>
                                  </div>
                              </div>
                          </div>
                          
                          {/* Mock Body */}
                          <div className="p-6 pt-10 text-center flex-1">
                              <h3 className="font-serif italic text-2xl mb-1 text-black dark:text-white">Organic Cotton Tee</h3>
                              <p className="text-[10px] uppercase font-bold text-gray-400 mb-6">Patagonia • Verified Ethical</p>
                              
                              <div className="space-y-3 text-left">
                                  <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-black/5 flex items-center gap-3">
                                      <Leaf size={16} className="text-[#8A9A5B]" />
                                      <div>
                                          <div className="text-xs font-bold text-black dark:text-white">0.8kg CO2e</div>
                                          <div className="text-[8px] text-gray-400 uppercase">Carbon Footprint</div>
                                      </div>
                                  </div>
                                  <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-black/5 flex items-center gap-3">
                                      <Globe size={16} className="text-[#002FA7]" />
                                      <div>
                                          <div className="text-xs font-bold text-black dark:text-white">500 Liters</div>
                                          <div className="text-[8px] text-gray-400 uppercase">Water Saved</div>
                                      </div>
                                  </div>
                              </div>

                              <div className="mt-8">
                                  <button className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-bold uppercase">
                                      View Full Report
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- The Intelligence Grid --- */}
      <section id="intelligence" className="border-t border-black/10 dark:border-white/10">
          {[
              { 
                  id: "01",
                  title: "Visual Recognition",
                  desc: "Neural networks identify fabric weaves and garment composition in real-time.",
                  tech: "TFJS / MobileNet",
                  img: "https://images.unsplash.com/photo-1520697830682-8bc9fde6ca6a?auto=format&fit=crop&q=80&w=800"
              },
              { 
                  id: "02",
                  title: "Supply Chain Trace",
                  desc: "Mapping the journey from raw fiber to retail using global registry data.",
                  tech: "Open Supply Hub",
                  img: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=800"
              },
              { 
                  id: "03",
                  title: "Impact Calculation",
                  desc: "Quantifying water usage, carbon emissions, and microplastic shedding.",
                  tech: "ISO 14040 Lifecycle",
                  img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
              }
          ].map((item, idx) => (
              <div key={idx} className="group relative border-b border-black/10 dark:border-white/10 h-[60vh] md:h-[40vh] overflow-hidden flex flex-col md:flex-row">
                  {/* Hover Image Background */}
                  <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <img src={item.img} className="w-full h-full object-cover grayscale opacity-20" alt="" />
                  </div>

                  <div className="relative z-10 w-full md:w-1/3 p-8 md:p-12 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 flex flex-col justify-between bg-white/80 dark:bg-black/80 backdrop-blur-sm md:bg-transparent transition-colors group-hover:text-[#002FA7]">
                      <span className="text-5xl font-serif italic">{item.id}</span>
                      <span className="text-xs font-bold uppercase tracking-widest">{item.tech}</span>
                  </div>

                  <div className="relative z-10 w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
                      <h3 className="text-4xl md:text-6xl font-medium tracking-tighter mb-4 group-hover:translate-x-4 transition-transform duration-500">
                          {item.title}
                      </h3>
                      <p className="max-w-md text-sm opacity-60 group-hover:opacity-100 transition-opacity">
                          {item.desc}
                      </p>
                      
                      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                          <ArrowRight size={32} />
                      </div>
                  </div>
              </div>
          ))}
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#1A1A1A] text-[#FDF8E4] pt-32 pb-12 px-6 md:px-12">
          <div className="max-w-[1920px] mx-auto border-t border-white/20 pt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
                  <div className="space-y-6">
                      <span className="text-2xl font-bold tracking-tight uppercase">EcoThreads</span>
                      <p className="text-sm opacity-60 max-w-xs leading-relaxed">
                          Redefining fashion consumption through radical transparency and artificial intelligence.
                      </p>
                  </div>
                  
                  <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-[#D95D39]">Platform</h4>
                      <ul className="space-y-4 text-sm font-medium opacity-80">
                          <li><a href="#" className="hover:text-[#D95D39] transition-colors">Visual Engine</a></li>
                          <li><a href="#" className="hover:text-[#D95D39] transition-colors">Sustainability Index</a></li>
                          <li><a href="#" className="hover:text-[#D95D39] transition-colors">API Access</a></li>
                      </ul>
                  </div>

                  <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-[#D95D39]">Social</h4>
                      <ul className="space-y-4 text-sm font-medium opacity-80">
                          <li><a href="#" className="hover:text-[#D95D39] transition-colors">Instagram</a></li>
                          <li><a href="#" className="hover:text-[#D95D39] transition-colors">Twitter</a></li>
                          <li><a href="#" className="hover:text-[#D95D39] transition-colors">LinkedIn</a></li>
                      </ul>
                  </div>

                  <div className="flex flex-col justify-end">
                      <button onClick={onStart} className="w-full bg-[#FDF8E4] text-black py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#D95D39] hover:text-white transition-colors">
                          Start Analysis
                      </button>
                  </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-8">
                  <h1 className="text-[10vw] leading-none font-black text-white/5 select-none pointer-events-none">
                      ECOTHREADS
                  </h1>
                  <div className="flex gap-8 text-xs font-bold uppercase tracking-widest opacity-40 mt-8 md:mt-0">
                      <span>© 2025</span>
                      <span>Privacy</span>
                      <span>Terms</span>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};
