
import React from 'react';
import { ArrowRight, Leaf, ScanLine, Globe, Sparkles, Footprints, ShieldCheck, Zap, Moon, Sun, ArrowUpRight, Aperture } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, darkMode, toggleTheme }) => {
  return (
    <div className="min-h-screen bg-[#FDF8E4] dark:bg-[#0c0a09] text-[#1A1A1A] dark:text-[#FDF8E4] transition-colors duration-700 font-sans selection:bg-[#D95D39] selection:text-white overflow-x-hidden">
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference text-[#FDF8E4]">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={toggleTheme}>
             <Aperture size={28} className="transition-transform duration-700 group-hover:rotate-180" />
             <span className="text-xl font-bold tracking-tight uppercase hidden md:block">EcoThreads</span>
          </div>

          <div className="flex items-center gap-12">
            <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase">
              <a href="#manifesto" className="hover:opacity-50 transition-opacity">Manifesto</a>
              <a href="#intelligence" className="hover:opacity-50 transition-opacity">Intelligence</a>
              <a href="#impact" className="hover:opacity-50 transition-opacity">Impact</a>
            </div>
            
            <button 
              onClick={onStart}
              className="px-6 py-2 border border-current rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#FDF8E4] hover:text-black hover:border-[#FDF8E4] transition-all duration-300"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative min-h-screen flex flex-col pt-32 px-6 md:px-12 max-w-[1920px] mx-auto">
        
        {/* Main Headline */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
            <div className="overflow-hidden">
                <h1 className="text-[12vw] md:text-[9vw] font-medium leading-[0.85] tracking-tighter animate-fade-in-up">
                    CONSCIOUS
                </h1>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 overflow-hidden">
                <h1 className="text-[12vw] md:text-[9vw] font-medium leading-[0.85] tracking-tighter text-[#D95D39] italic animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    CLARITY
                </h1>
                <p className="max-w-md text-sm md:text-base font-medium leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    Deconstruct your wardrobe. Decode the materials. <br/>
                    The first AI-powered sustainability auditor for the modern aesthetic.
                </p>
            </div>
        </div>

        {/* Floating Visual */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[50vw] h-[80vh] pointer-events-none hidden md:block mix-blend-multiply dark:mix-blend-difference opacity-80">
            <img 
                src="https://images.unsplash.com/photo-1550614000-4b9519e003ac?q=80&w=1500&auto=format&fit=crop" 
                alt="Fashion Texture" 
                className="w-full h-full object-cover grayscale contrast-125"
            />
        </div>

        {/* Bottom Bar */}
        <div className="h-24 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-widest opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#D95D39] rounded-full animate-pulse"></span>
                System Operational
            </div>
            <div className="hidden md:block">
                Powered by Gemini 2.5 Flash
            </div>
            <div>
                Scroll to Explore
            </div>
        </div>
      </header>

      {/* --- Marquee --- */}
      <div className="border-y border-black text-black bg-[#D95D39] overflow-hidden py-4">
        <div className="whitespace-nowrap flex gap-12 animate-scan" style={{ animationDuration: '20s', animationDirection: 'reverse', transform: 'none' }}>
            {[...Array(10)].map((_, i) => (
                <span key={i} className="text-4xl md:text-6xl font-black italic tracking-tighter opacity-90">
                    SCAN • ANALYZE • WEAR • REPEAT •
                </span>
            ))}
        </div>
      </div>

      {/* --- The Intelligence (Features) --- */}
      <section id="intelligence" className="py-32 px-6 md:px-12 max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 border-t border-black dark:border-white pt-6">
            <div className="md:col-span-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D95D39] mb-4 block">(01) — The Intelligence</span>
                <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-8">
                    BEYOND <br/> THE LABEL.
                </h2>
                <p className="text-lg opacity-60 leading-relaxed max-w-sm">
                    We combine edge computer vision with large language models to provide a forensic analysis of your garment's environmental history.
                </p>
            </div>

            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">
                {[
                    { icon: ScanLine, title: "Visual Recognition", desc: "MobileNet V3 architecture identifies fabric weaves and garment types instantly." },
                    { icon: Globe, title: "Supply Chain Trace", desc: "Open Apparel Registry integration maps the journey from raw fiber to retail." },
                    { icon: Footprints, title: "Carbon Calculation", desc: "ISO 14040 aligned lifecycle assessment for accurate CO2e estimates." },
                    { icon: Sparkles, title: "Circular Solutions", desc: "Geolocation-based discovery of repair cafes and textile recycling points." }
                ].map((item, idx) => (
                    <div key={idx} className="bg-[#FDF8E4] dark:bg-[#0c0a09] p-12 hover:bg-white dark:hover:bg-black transition-colors group cursor-default">
                        <item.icon className="mb-8 w-8 h-8 opacity-50 group-hover:opacity-100 group-hover:text-[#D95D39] transition-all" />
                        <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                        <p className="text-sm opacity-60 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
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
                 New Feature
             </div>
             <h2 className="text-6xl md:text-8xl font-medium tracking-tighter mb-8 mix-blend-difference">
                 REPAIR <br/> DON'T REPLACE
             </h2>
             <button onClick={onStart} className="bg-[#D95D39] text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                 Locate Tailors Nearby
             </button>
         </div>
      </section>

      {/* --- Impact Dashboard Preview --- */}
      <section id="impact" className="py-32 px-6 md:px-12 max-w-[1920px] mx-auto">
         <div className="flex flex-col md:flex-row gap-16 items-end mb-24">
             <div className="flex-1">
                 <span className="text-xs font-bold uppercase tracking-widest text-[#D95D39] mb-4 block">(02) — The Output</span>
                 <h2 className="text-5xl md:text-7xl font-medium tracking-tighter">
                    DATA IS <br/> BEAUTIFUL.
                 </h2>
             </div>
             <div className="flex-1 pb-2 border-b border-black dark:border-white">
                 <p className="text-xl md:text-2xl font-medium leading-tight opacity-80">
                    "EcoThreads turns complex environmental data into a clear, actionable scorecard for your wardrobe."
                 </p>
             </div>
         </div>

         {/* Mockup Grid */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="md:col-span-2 bg-[#e6e2d3] dark:bg-[#1a1818] rounded-[2rem] overflow-hidden relative group h-[600px]">
                 <div className="absolute inset-0 p-12 flex flex-col justify-between z-10">
                     <div className="flex justify-between items-start">
                         <div className="text-xs font-bold uppercase tracking-widest border border-current px-3 py-1 rounded-full">Analysis Result</div>
                         <ArrowUpRight size={48} className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     </div>
                     <div>
                         <h3 className="text-4xl font-medium mb-2">Organic Cotton Tee</h3>
                         <div className="text-8xl font-black text-[#D95D39]">92<span className="text-2xl text-black dark:text-white font-medium">/100</span></div>
                     </div>
                 </div>
                 <img 
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000" 
                    className="absolute right-0 bottom-0 w-2/3 h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    alt="Product"
                 />
             </div>

             <div className="bg-[#1A1A1A] text-[#FDF8E4] rounded-[2rem] p-12 flex flex-col justify-between h-[600px] relative overflow-hidden">
                 <div className="relative z-10">
                     <ScanLine size={48} className="mb-8 text-[#D95D39]" />
                     <h3 className="text-3xl font-medium mb-4">Instant <br/>Recognition</h3>
                     <p className="opacity-60 leading-relaxed">
                         Point your camera at any garment. Our neural engine identifies texture, material, and brand signature in under 200ms.
                     </p>
                 </div>
                 
                 <div className="space-y-4 relative z-10">
                     <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest opacity-50">
                         <span>AI Confidence</span>
                         <span className="flex-1 h-px bg-current"></span>
                         <span>98.5%</span>
                     </div>
                     <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest opacity-50">
                         <span>Latency</span>
                         <span className="flex-1 h-px bg-current"></span>
                         <span>~150ms</span>
                     </div>
                 </div>

                 {/* Decorative Grid */}
                 <div className="absolute inset-0 opacity-10" 
                     style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '20px 20px' }}>
                 </div>
             </div>
         </div>
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
                      <span>© 2024</span>
                      <span>Privacy</span>
                      <span>Terms</span>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};
