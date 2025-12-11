
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, ArrowRight, ScanLine, Barcode, History, AlertCircle, X, Moon, Sun, Loader2, Zap, Leaf, Menu } from 'lucide-react';
import { AppState, AnalysisResult, LocalAIResult, HistoryItem } from './types';
import { classifyImage, loadModel } from './services/tensorFlowService';
import { extractTextFromImage } from './services/ocrService';
import { analyzeSustainability, analyzeSustainabilityLocal } from './services/geminiService';
import { getGamificationProfile } from './services/storageService';
import { AnalysisLoader } from './components/AnalysisLoader';
import { ResultsDashboard } from './components/ResultsDashboard';
import { BarcodeScanner } from './components/BarcodeScanner';
import { ScanHistory } from './components/ScanHistory';
import { SideMenu } from './components/SideMenu';
import { PRODUCTS_DB } from './data/knowledgeBase';

export const App = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [analysisStage, setAnalysisStage] = useState<'vision' | 'ocr' | 'fusion' | 'complete'>('vision');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentImageThumbnail, setCurrentImageThumbnail] = useState<string>("");
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // For Camera Capture
  const [isUploading, setIsUploading] = useState(false); // For File Upload
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Scanning overlay state
  const [scanGuidance, setScanGuidance] = useState<{text: string, color: string}>({ text: "Searching...", color: "border-white/30" });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Connectivity Listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Preload Models for Offline readiness
  useEffect(() => {
    if (navigator.onLine) {
       loadModel().catch(console.error);
    }
  }, []);

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scan Guidance Simulation
  useEffect(() => {
    if (appState === AppState.SCANNING && !showBarcodeScanner) {
        // Reset
        setScanGuidance({ text: "Align subject...", color: "border-white/30" });
        
        // Simulate detection sequence
        const timers = [
            setTimeout(() => setScanGuidance({ text: "Analyzing lighting...", color: "border-white/50" }), 1000),
            setTimeout(() => setScanGuidance({ text: "Subject detected", color: "border-yellow-400/60" }), 2500),
            setTimeout(() => setScanGuidance({ text: "Hold steady", color: "border-green-400/80" }), 4000),
        ];
        return () => timers.forEach(clearTimeout);
    }
  }, [appState, showBarcodeScanner]);

  // Stop camera stream
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Start camera stream
  const startCamera = async () => {
    setError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        throw new Error("Camera API not supported in this browser.");
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      if (err.name === 'NotAllowedError') {
        setError("Camera permission denied. Please enable access or upload a photo.");
      } else {
        setError("Could not access camera. Please upload an image instead.");
      }
    }
  };

  useEffect(() => {
    if (appState === AppState.SCANNING && !showBarcodeScanner) {
      startCamera();
    } else {
      stopStream();
    }
    return () => stopStream();
  }, [appState, showBarcodeScanner]);

  const handleStart = () => {
    setError(null);
    setAppState(AppState.SCANNING);
  };

  const handleBarcodeScan = (code: string) => {
    setShowBarcodeScanner(false);
    setError(null);
    
    if (PRODUCTS_DB[code]) {
        setResult(PRODUCTS_DB[code] as AnalysisResult);
        setCurrentImageThumbnail("https://picsum.photos/seed/barcode/200");
        setAppState(AppState.RESULTS);
    } else {
        setError(`Barcode/QR ${code} not found in database. Try Visual Scan.`);
    }
  };

  // Image Processing Pipeline
  const applyImageEnhancements = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Sharpening Convolution (Kernel: [[0,-1,0], [-1,5,-1], [0,-1,0]])
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const src = new Uint8ClampedArray(data); // Create copy for reading
    const stride = width * 4;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        // Apply kernel to RGB
        for (let c = 0; c < 3; c++) {
          const val = (5 * src[idx + c]) 
            - src[idx - 4 + c]          // Left
            - src[idx + 4 + c]          // Right
            - src[idx - stride + c]     // Up
            - src[idx + stride + c];    // Down
            
          data[idx + c] = Math.min(255, Math.max(0, val));
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const getProcessedImage = async (source: HTMLVideoElement | HTMLImageElement): Promise<{ blob: Blob, base64: string }> => {
    const canvas = document.createElement('canvas');
    const maxDim = 1080;
    let w = 'videoWidth' in source ? source.videoWidth : source.naturalWidth;
    let h = 'videoWidth' in source ? source.videoHeight : source.naturalHeight;
    
    const scale = Math.min(1, maxDim / Math.max(w, h));
    w = Math.floor(w * scale);
    h = Math.floor(h * scale);
    
    canvas.width = w;
    canvas.height = h;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Failed to get canvas context");

    // 1. Draw original
    ctx.drawImage(source, 0, 0, w, h);

    // 2. Analyze Brightness (Only apply enhancements if necessary)
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    let brightnessSum = 0;
    // Sample every 40th pixel to speed up analysis
    for (let i = 0; i < data.length; i += 40) {
        brightnessSum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    const avgBrightness = brightnessSum / (data.length / 40);

    // If image is poorly lit (too dark < 70) or low contrast, run enhancements
    if (avgBrightness < 70) {
         console.log("Low light detected (" + Math.round(avgBrightness) + "), applying enhancement filters.");
         // Re-draw with filters
         ctx.filter = 'contrast(1.4) brightness(1.3) saturate(1.1)';
         ctx.drawImage(source, 0, 0, w, h);
         ctx.filter = 'none'; // Reset
         
         // Apply sharpening for better OCR
         applyImageEnhancements(ctx, w, h);
    } else {
        // If lighting is good, skip convolution to save battery/processing time
        console.log("Good lighting (" + Math.round(avgBrightness) + "), skipping enhancements.");
    }

    return new Promise((resolve, reject) => {
       const base64 = canvas.toDataURL('image/jpeg', 0.9);
       canvas.toBlob(blob => {
         if (blob) resolve({ blob, base64 });
         else reject(new Error("Canvas conversion failed"));
       }, 'image/jpeg', 0.9);
    });
  };

  const captureImage = async () => {
    if (videoRef.current && videoRef.current.readyState === 4) {
      setIsProcessing(true);
      try {
        const { blob, base64 } = await getProcessedImage(videoRef.current);
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        processImagePipeline(file, base64);
      } catch (e: any) {
        setError(e.message);
        setIsProcessing(false);
      }
    } else {
        setError("Camera not ready. Please wait a moment.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
         if (event.target?.result) {
            const img = new Image();
            img.src = event.target.result as string;
            await new Promise(r => img.onload = r);
            
            const { blob, base64 } = await getProcessedImage(img);
            const processedFile = new File([blob], file.name, { type: file.type });
            processImagePipeline(processedFile, base64);
         }
      };
      reader.readAsDataURL(file);
    }
  };

  const processImagePipeline = async (file: File, base64data: string) => {
    stopStream();
    setAppState(AppState.ANALYZING);
    setAnalysisStage('vision');
    setError(null);
    setIsProcessing(false);
    setIsUploading(false);
    setCurrentImageThumbnail(base64data);

    try {
        // 1. TF.js Classification (Runs locally)
        const imgElement = document.createElement('img');
        imgElement.src = base64data;
        await new Promise((resolve) => { imgElement.onload = resolve; });
        
        const classifications = await classifyImage(imgElement);
        setAnalysisStage('ocr');

        // 2. OCR (Runs locally)
        const ocrText = await extractTextFromImage(file);
        setAnalysisStage('fusion');

        const localAI: LocalAIResult = { classification: classifications, ocrText };

        // 3. Analysis (Cloud vs Local)
        if (navigator.onLine) {
            const finalResult = await analyzeSustainability(base64data, localAI);
            setResult(finalResult);
        } else {
            console.log("Offline mode detected. Running heuristic analysis.");
            const localResult = analyzeSustainabilityLocal(localAI);
            setResult(localResult);
            await new Promise(r => setTimeout(r, 1500)); 
        }
        
        setAnalysisStage('complete');
        setAppState(AppState.RESULTS);
    } catch (e: any) {
        console.error(e);
        const msg = e.message || "An unexpected error occurred during analysis.";
        setError(msg);
        setAppState(AppState.SCANNING);
        setIsUploading(false);
        setIsProcessing(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
      setResult(item.result);
      setCurrentImageThumbnail(item.thumbnail);
      setAppState(AppState.RESULTS);
  };

  const renderError = () => {
    if (!error) return null;
    return (
        <div className="absolute top-4 left-4 right-4 z-50 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 animate-slide-down">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{error}</div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 dark:hover:text-red-300">
                <X size={18} />
            </button>
        </div>
    );
  };

  const renderLanding = () => (
    <div className="flex flex-col h-screen bg-cream dark:bg-stone-950 transition-colors duration-500 relative overflow-hidden">
        {renderError()}
        
        <SideMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            onNavigate={(state) => setAppState(state)}
            onSelectHistory={handleHistorySelect}
            profile={getGamificationProfile()}
        />

        {/* Top Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-30">
             <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-3 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 backdrop-blur-md rounded-full shadow-sm transition-all text-ink dark:text-white"
             >
                <Menu size={24} />
             </button>
             
             <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 backdrop-blur-md rounded-full shadow-sm transition-all text-ink dark:text-white"
            >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
        </div>

        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none">
             <div className="absolute -top-[20%] -right-[20%] w-[80vh] h-[80vh] bg-terracotta/10 rounded-full blur-[120px] animate-pulse"></div>
             <div className="absolute top-[40%] -left-[20%] w-[60vh] h-[60vh] bg-periwinkle/10 rounded-full blur-[100px]"></div>
        </div>

        {/* Main Content Centered */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8 text-center">
            
            {/* New Attractive Logo */}
            <div className="mb-12 animate-fade-in-down">
                <div className="w-32 h-32 mx-auto mb-6 relative hover:scale-105 transition-transform duration-700">
                    <div className="absolute inset-0 bg-gradient-to-tr from-ink to-stone-800 dark:from-white dark:to-stone-400 rounded-3xl opacity-10 rotate-6 transform"></div>
                    <div className="w-full h-full bg-gradient-to-br from-ink to-stone-800 dark:from-white dark:to-stone-200 rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10 overflow-hidden">
                         <svg viewBox="0 0 200 200" className="w-20 h-20 text-cream dark:text-ink">
                             {/* Abstract Thread Spool / Leaf Composition */}
                             <path d="M100 170 C 60 170, 30 140, 30 90 C 30 40, 100 20, 100 20 C 100 20, 170 40, 170 90 C 170 140, 140 170, 100 170 Z" 
                                   fill="currentColor" opacity="0.1" />
                             <path d="M100 160 V 120" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                             {/* Interwoven Thread Line */}
                             <path d="M100 120 C 100 120, 50 100, 50 70 C 50 40, 80 30, 100 30 C 120 30, 150 40, 150 70 C 150 100, 100 120, 100 120" 
                                   fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                             {/* Veins / Stitches */}
                             <path d="M100 40 V 110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 4" opacity="0.8"/>
                             <path d="M100 60 L 130 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                             <path d="M100 80 L 70 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                         </svg>
                    </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-light text-ink dark:text-white leading-tight tracking-tighter">
                    EcoThreads
                </h1>
                <p className="text-sm font-bold tracking-[0.3em] uppercase text-terracotta mt-2">AI Sustainability Lens</p>
            </div>

            {/* Scan Trigger */}
            <div className="relative group cursor-pointer animate-fade-in-up delay-100" onClick={handleStart}>
                 <div className="absolute inset-0 bg-terracotta/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-150"></div>
                 <button 
                    className="relative px-12 py-6 bg-ink dark:bg-white text-white dark:text-ink rounded-full font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group-hover:shadow-terracotta/50"
                 >
                    <ScanLine size={24} />
                    Start Analysis
                    <div className="w-8 h-8 bg-white/20 dark:bg-black/10 rounded-full flex items-center justify-center ml-2">
                        <ArrowRight size={16} />
                    </div>
                 </button>
            </div>

            {isOffline && (
                <div className="mt-8 animate-fade-in">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800/50 rounded-full text-xs font-bold text-gray-500 dark:text-gray-400 border border-stone-200 dark:border-stone-700">
                        <Zap size={12} className="text-orange-400" /> Offline Mode Active
                    </span>
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="p-6 text-center z-10 opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-xs text-ink dark:text-white font-medium">Powered by Gemini Hybrid AI</p>
        </div>
    </div>
  );

  const renderScanning = () => (
    <div className="flex flex-col h-screen bg-black relative">
        {renderError()}
        <div className="flex-1 flex items-center justify-center bg-stone-900 relative overflow-hidden">
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            
            {/* Visual Guide Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Darkened borders */}
                <div className="absolute top-0 left-0 w-full h-[15%] bg-black/60 backdrop-blur-sm"></div>
                <div className="absolute bottom-0 left-0 w-full h-[15%] bg-black/60 backdrop-blur-sm"></div>
                
                {/* Dynamic Scan Box */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-[3px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${scanGuidance.color}`}>
                    
                    {/* Grid Overlay for alignment cues */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                        <div className="border-r border-b border-white/20"></div>
                        <div className="border-r border-b border-white/20"></div>
                        <div className="border-b border-white/20"></div>
                        <div className="border-r border-b border-white/20"></div>
                        <div className="border-r border-b border-white/20"></div>
                        <div className="border-b border-white/20"></div>
                        <div className="border-r border-white/20"></div>
                        <div className="border-r border-white/20"></div>
                        <div></div>
                    </div>

                    {/* Animated Scan Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-terracotta/80 shadow-[0_0_20px_rgba(217,93,57,0.8)] animate-scan"></div>
                    
                    {/* Corner Markers */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                </div>
                
                <p className="absolute bottom-[18%] left-0 right-0 text-center text-white/90 text-sm font-medium tracking-wide drop-shadow-md transition-all duration-300">
                    {scanGuidance.text}
                </p>
                
                {isOffline && (
                     <div className="absolute top-[18%] left-0 right-0 text-center">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold text-white/80 border border-white/10">
                            <Zap size={10} className="text-orange-400" /> Offline Mode
                        </span>
                    </div>
                )}
            </div>
        </div>

        {/* Controls */}
        <div className="h-40 bg-black flex items-center justify-around px-8 rounded-t-3xl -mt-6 z-30 relative border-t border-white/10">
            <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
            />
            
            <button 
                onClick={() => setShowBarcodeScanner(true)}
                className="p-4 rounded-full bg-stone-800 text-white hover:bg-stone-700 transition-colors flex flex-col items-center gap-1 active:scale-95"
                title="Scan Barcode or QR"
            >
                <Barcode size={24} />
            </button>

            <button 
                onClick={captureImage}
                disabled={isProcessing}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group disabled:opacity-50 disabled:cursor-not-allowed"
                title="Capture Image"
            >
                {isProcessing ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                    <div className="w-16 h-16 bg-white rounded-full group-active:scale-90 transition-transform"></div>
                )}
            </button>

             <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-4 rounded-full bg-stone-800 text-white hover:bg-stone-700 transition-colors flex flex-col items-center gap-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                title="Upload Image"
            >
                {isUploading ? (
                     <Loader2 size={24} className="animate-spin text-terracotta" />
                ) : (
                     <Upload size={24} />
                )}
            </button>
        </div>
        
        {/* Back Button */}
        <button 
            onClick={() => setAppState(AppState.LANDING)}
            className="absolute top-6 left-6 z-40 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md transition-colors"
        >
            <ArrowRight className="rotate-180" size={24} />
        </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto h-screen shadow-2xl overflow-hidden font-sans relative bg-cream dark:bg-stone-900">
      {showBarcodeScanner && (
        <BarcodeScanner 
            onScan={handleBarcodeScan} 
            onClose={() => setShowBarcodeScanner(false)} 
        />
      )}
      {!showBarcodeScanner && appState === AppState.LANDING && renderLanding()}
      {!showBarcodeScanner && appState === AppState.HISTORY && (
        <ScanHistory 
            onBack={() => setAppState(AppState.LANDING)} 
            onSelect={handleHistorySelect} 
        />
      )}
      {!showBarcodeScanner && appState === AppState.SCANNING && renderScanning()}
      {!showBarcodeScanner && appState === AppState.ANALYZING && <AnalysisLoader stage={analysisStage} />}
      {!showBarcodeScanner && appState === AppState.RESULTS && result && (
        <ResultsDashboard 
            result={result} 
            thumbnail={currentImageThumbnail}
            onReset={() => setAppState(AppState.LANDING)}
            isHistoryView={false} 
        />
      )}
    </div>
  );
};
