
import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, ScanLine, Globe, Sparkles, Footprints, ShieldCheck, Zap, Moon, Sun, ArrowUpRight, Aperture, Code, Database, Microscope, Menu, X } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, darkMode, toggleTheme }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  // Preloader Simulation
  useEffect(() => {
    const timer = setInterval(() => {
        setProgress(prev => {
            if (prev >= 100) {
                clearInterval(timer);
                setTimeout(() => setLoading(false), 500);
                return 100;
            }
            return prev + Math.floor(Math.random() * 10) + 1;
        });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
      return (
          <div className="fixed inset-0 bg-[#002FA7] z-[100] flex flex-col justify-between p-6 md:p-12 text-white">
              <div className="flex justify-between items-start font-mono text-xs uppercase tracking-widest">
                  <span>EcoThreads™ System</span>
                  <span>Loading Assets</span>
              </div>
              <div className="text-[12vw] font-serif italic leading-none flex items-baseline">
                  {progress}<span className="text-[4vw] font-sans not-italic">%</span>
              </div>
              <div className="w-full h-px bg-white/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#080808] text-black dark:text-white transition-colors duration-700 font-sans selection:bg-[#002FA7] selection:text-white overflow-x-hidden relative">
      
      {/* --- Corner Navigation (Fixed) --- */}
      <div className="fixed inset-0 pointer-events-none z-50 p-6 md:p-8 flex flex-col justify-between text-xs font-bold uppercase tracking-widest mix-blend-difference text-white">
          {/* Top Left */}
          <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1 pointer-events-auto cursor-pointer group" onClick={toggleTheme}>
                  <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-current rounded-full group-hover:scale-150 transition-transform"></div>
                      <span>EcoThreads™</span>
                  </div>
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">AI Auditor V2.5</span>
              </div>
              
              {/* Top Right */}
              <button onClick={onStart} className="pointer-events-auto hover:text-[#002FA7] transition-colors flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">Start System</span>
                  [ Enter ]
              </button>
          </div>

          {/* Bottom Left */}
          <div className="flex justify-between items-end">
             <div className="flex flex-col gap-1">
                 <span>37.7749° N, 122.4194° W</span>
                 <span className="opacity-50">{new Date().toLocaleTimeString()}</span>
             </div>

             {/* Bottom Right */}
             <div className="pointer-events-auto flex flex-col items-end gap-1">
                 <a href="#intelligence" className="hover:underline">Intelligence</a>
                 <a href="#manifesto" className="hover:underline">Manifesto</a>
             </div>
          </div>
      </div>

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
              <div className="absolute inset-0 bg-[#002FA7] mix-blend-color z-10 opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>
              <img 
                src="https://images.unsplash.com/photo-1550614000-4b9519e003ac?q=80&w=1800&auto=format&fit=crop" 
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-[2s]"
                alt="Texture"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
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
      <footer className="bg-[#002FA7] text-white pt-24 pb-12 px-6 md:px-12">
          <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-12">
                   <div className="w-16 h-16 border border-white rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
                       <Aperture size={24} />
                   </div>
                   <h2 className="text-4xl md:text-6xl font-serif italic mb-6">Ready to see the unseen?</h2>
                   <button onClick={onStart} className="bg-white text-[#002FA7] px-12 py-5 rounded-none text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                       Launch Scanner
                   </button>
              </div>
              
              <div className="w-full h-px bg-white/20 mb-8"></div>
              
              <div className="w-full flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-60">
                  <div className="flex gap-6 mb-4 md:mb-0">
                      <span>Instagram</span>
                      <span>Twitter</span>
                      <span>LinkedIn</span>
                  </div>
                  <span>© 2024 EcoThreads AI. All Rights Reserved.</span>
              </div>
          </div>
      </footer>
    </div>
  );
};
