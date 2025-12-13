
import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, ScanLine, Globe, Sparkles, Footprints, ShieldCheck, Zap, Moon, Sun, ArrowUpRight, Aperture, Code, Database, Microscope } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, darkMode, toggleTheme }) => {
  const [scrollPos, setScrollPos] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollPos(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#EAE8E4] dark:bg-[#050505] text-[#1A1A1A] dark:text-[#F0F0F0] transition-colors duration-700 font-sans selection:bg-[#D95D39] selection:text-white overflow-x-hidden relative">
      
      {/* Global Grain Texture */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* --- Navigation --- */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrollPos > 50 ? 'py-4 bg-white/5 backdrop-blur-md border-b border-white/10' : 'py-8'}`}>
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer mix-blend-difference text-white" onClick={toggleTheme}>
             <Aperture size={28} className="animate-spin-slow duration-[10s]" />
             <span className="text-lg font-bold tracking-tighter uppercase hidden md:block">EcoThreads</span>
          </div>

          <div className="flex items-center gap-12">
            <div className="hidden md:flex gap-8 text-[10px] font-bold tracking-[0.2em] uppercase mix-blend-difference text-white">
              <a href="#intelligence" className="hover:opacity-50 transition-opacity">Intelligence</a>
              <a href="#impact" className="hover:opacity-50 transition-opacity">Impact</a>
            </div>
            
            <button 
              onClick={onStart}
              className="group relative px-8 py-3 bg-[#D95D39] text-white rounded-full text-xs font-bold uppercase tracking-widest overflow-hidden transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-2">Launch App <ArrowRight size={14} /></span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- Cinematic Hero --- */}
      <header className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Background Image with Parallax */}
        <div 
            className="absolute inset-0 z-0"
            style={{ transform: `translateY(${scrollPos * 0.5}px) scale(1.1)` }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10"></div>
            <img 
                src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=2400&auto=format&fit=crop" 
                alt="High Fashion Texture" 
                className="w-full h-full object-cover object-center"
            />
        </div>

        {/* Massive Typography Layer */}
        <div className="relative z-10 w-full px-6 md:px-12 flex flex-col items-center justify-center pointer-events-none mix-blend-difference text-[#EAE8E4]">
            <div className="w-full flex justify-between border-b border-white/20 pb-2 mb-4 text-[10px] font-bold uppercase tracking-widest opacity-70 animate-fade-in-down">
                <span>Est. 2024</span>
                <span>System: Online</span>
                <span>V2.5 Flash</span>
            </div>
            
            <h1 className="text-[15vw] md:text-[16vw] leading-[0.8] font-medium tracking-tighter text-center animate-fade-in-up">
                RADICAL
            </h1>
            <div className="flex items-center gap-4 md:gap-12 w-full justify-center">
                 <div className="h-[1px] bg-white/50 w-12 md:w-32 hidden md:block"></div>
                 <h1 className="text-[15vw] md:text-[16vw] leading-[0.8] font-medium tracking-tighter text-center italic text-transparent stroke-text animate-fade-in-up delay-100">
                    TRUTH
                 </h1>
                 <div className="h-[1px] bg-white/50 w-12 md:w-32 hidden md:block"></div>
            </div>
        </div>

        {/* Floating Scanner Card (Interactive Element) */}
        <div className="absolute bottom-12 right-6 md:right-12 z-20 w-80 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-none animate-fade-in delay-500 hidden md:block">
            <div className="flex justify-between items-start mb-4 text-white">
                <ScanLine size={24} className="text-[#D95D39] animate-pulse" />
                <span className="text-[10px] font-mono opacity-60">ID: #882-AFX</span>
            </div>
            <div className="space-y-2 font-mono text-xs text-white/80">
                <div className="flex justify-between">
                    <span>Target:</span>
                    <span>Denim_Weave</span>
                </div>
                <div className="flex justify-between">
                    <span>Composition:</span>
                    <span>100% Cotton</span>
                </div>
                <div className="flex justify-between">
                    <span>Impact:</span>
                    <span className="text-green-400">Low</span>
                </div>
                <div className="h-1 w-full bg-white/10 mt-2 overflow-hidden">
                    <div className="h-full bg-[#D95D39] w-[80%] animate-scan"></div>
                </div>
            </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 mix-blend-difference text-white opacity-60">
            <span className="text-[10px] uppercase tracking-widest">Scroll to Audit</span>
            <div className="w-[1px] h-12 bg-white animate-pulse"></div>
        </div>
      </header>

      {/* --- Marquee Tape --- */}
      <div className="bg-[#D95D39] py-3 overflow-hidden border-y border-black">
         <div className="flex whitespace-nowrap gap-8 animate-scan text-black font-mono text-xs font-bold uppercase tracking-widest">
            {[...Array(20)].map((_, i) => (
                <span key={i} className="flex items-center gap-2">
                    <Zap size={10} className="fill-black" /> Sustainable Intelligence
                </span>
            ))}
         </div>
      </div>

      {/* --- Intelligence Section (The System) --- */}
      <section id="intelligence" className="py-32 px-6 md:px-12 max-w-[1920px] mx-auto relative">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column: Manifesto */}
            <div className="lg:col-span-4 sticky top-32 h-fit">
                <span className="inline-block px-3 py-1 border border-[#D95D39] text-[#D95D39] text-[10px] font-bold uppercase tracking-widest rounded-full mb-8">
                    (01) The Architecture
                </span>
                <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[0.9]">
                    DECODE <br/> <span className="text-gray-400 font-light italic">REALITY.</span>
                </h2>
                <p className="text-lg opacity-60 leading-relaxed max-w-sm font-light mb-12">
                    Our hybrid AI engine doesn't just look at your clothes. It reads the molecular history, traces the supply chain, and calculates the true cost of existence.
                </p>
                
                <div className="hidden lg:block">
                     <div className="w-24 h-24 border border-current rounded-full flex items-center justify-center animate-spin-slow opacity-20">
                         <Globe size={48} strokeWidth={1} />
                     </div>
                </div>
            </div>

            {/* Right Column: Technical Specs List */}
            <div className="lg:col-span-8 flex flex-col">
                {[
                    { 
                        id: 1,
                        icon: Microscope, 
                        title: "Visual Spectrometry", 
                        code: "TFJS::MobileNet_V3",
                        desc: "On-device neural networks identify fiber weave patterns and textile classifications in <100ms.",
                        image: "https://images.unsplash.com/photo-1520697830682-8bc9fde6ca6a?auto=format&fit=crop&q=80&w=800"
                    },
                    { 
                        id: 2,
                        icon: Database, 
                        title: "Supply Chain Forensics", 
                        code: "API::OAR_Registry",
                        desc: "Cross-referencing Open Supply Hub data to map factory origins and labor conditions accurately.",
                        image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=800"
                    },
                    { 
                        id: 3,
                        icon: Code, 
                        title: "Generative Fusion", 
                        code: "GCP::Gemini_2.5",
                        desc: "Large Language Models synthesize data into actionable environmental impact reports.",
                        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
                    },
                    { 
                        id: 4,
                        icon: Leaf, 
                        title: "LCA Calculation", 
                        code: "ISO::14040_Std",
                        desc: "Standardized Lifecycle Assessment algorithms predict carbon, water, and waste footprints.",
                        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
                    }
                ].map((item) => (
                    <div 
                        key={item.id}
                        onMouseEnter={() => setHoveredFeature(item.id)}
                        onMouseLeave={() => setHoveredFeature(null)}
                        className="group relative border-t border-black/10 dark:border-white/10 py-12 transition-all duration-500 hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 px-4">
                            <div className="flex items-start gap-6">
                                <span className="text-xs font-mono opacity-30 pt-1">0{item.id}</span>
                                <div>
                                    <h3 className="text-3xl font-medium tracking-tight mb-2 group-hover:translate-x-2 transition-transform duration-300">{item.title}</h3>
                                    <span className="inline-block px-2 py-0.5 bg-black/5 dark:bg-white/10 text-[10px] font-mono mb-4 text-[#D95D39]">
                                        {item.code}
                                    </span>
                                    <p className="max-w-md opacity-60 font-light leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4">
                                <ArrowUpRight className="text-[#D95D39]" size={32} />
                            </div>
                        </div>

                        {/* Hover Image Reveal */}
                        <div 
                            className={`absolute top-0 right-0 w-[300px] h-full overflow-hidden opacity-0 transition-all duration-500 pointer-events-none hidden lg:block ${hoveredFeature === item.id ? 'opacity-100 translate-x-[-20px]' : ''}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-l from-[#EAE8E4] dark:from-[#050505] to-transparent z-10"></div>
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale opacity-50 mix-blend-multiply dark:mix-blend-screen" />
                        </div>
                    </div>
                ))}
                <div className="border-t border-black/10 dark:border-white/10"></div>
            </div>
         </div>
      </section>

      {/* --- Editorial Feature --- */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center bg-black">
         <img 
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            alt="Editorial"
         />
         <div className="relative z-10 text-center text-[#FDF8E4] px-6">
             <div className="inline-block border border-[#FDF8E4] rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest mb-6">
                 Action
             </div>
             <h2 className="text-6xl md:text-9xl font-medium tracking-tighter mb-8 mix-blend-difference">
                 REPAIR <br/> DON'T REPLACE
             </h2>
             <button onClick={onStart} className="bg-[#D95D39] text-white px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform hover:shadow-[0_0_30px_rgba(217,93,57,0.5)]">
                 Locate Tailors Nearby
             </button>
         </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#101010] text-[#888] pt-32 pb-12 px-6 md:px-12">
          <div className="max-w-[1920px] mx-auto border-t border-white/10 pt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
                  <div className="space-y-6">
                      <span className="text-2xl font-bold tracking-tight uppercase text-white">EcoThreads</span>
                      <p className="text-sm opacity-60 max-w-xs leading-relaxed">
                          Redefining fashion consumption through radical transparency and artificial intelligence.
                      </p>
                  </div>
                  
                  <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-[#D95D39]">Platform</h4>
                      <ul className="space-y-4 text-sm font-medium hover:text-white">
                          <li>Visual Engine</li>
                          <li>Sustainability Index</li>
                          <li>API Access</li>
                      </ul>
                  </div>

                  <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-[#D95D39]">Social</h4>
                      <ul className="space-y-4 text-sm font-medium">
                          <li className="hover:text-white cursor-pointer">Instagram</li>
                          <li className="hover:text-white cursor-pointer">Twitter</li>
                          <li className="hover:text-white cursor-pointer">LinkedIn</li>
                      </ul>
                  </div>

                  <div className="flex flex-col justify-end">
                      <button onClick={onStart} className="w-full bg-white text-black py-4 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-[#D95D39] hover:text-white transition-colors">
                          Start Analysis
                      </button>
                  </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/5 pt-8">
                  <h1 className="text-[12vw] leading-none font-black text-white/5 select-none pointer-events-none">
                      ECOTHREADS
                  </h1>
                  <div className="flex gap-8 text-xs font-bold uppercase tracking-widest opacity-40 mt-8 md:mt-0">
                      <span>© 2024</span>
                      <span>Privacy</span>
                      <span>Terms</span>
                  </div>
              </div>
          </div>
      </footer>
      
      <style>{`
        .stroke-text {
            -webkit-text-stroke: 2px currentColor;
        }
        @media (max-width: 768px) {
            .stroke-text {
                -webkit-text-stroke: 1px currentColor;
            }
        }
      `}</style>
    </div>
  );
};
