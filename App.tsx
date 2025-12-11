
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, ArrowRight, ScanLine, Barcode, History, AlertCircle, X, Moon, Sun, Loader2 } from 'lucide-react';
import { AppState, AnalysisResult, LocalAIResult, HistoryItem } from './types';
import { classifyImage } from './services/tensorFlowService';
import { extractTextFromImage } from './services/ocrService';
import { analyzeSustainability } from './services/geminiService';
import { getGamificationProfile } from './services/storageService';
import { AnalysisLoader } from './components/AnalysisLoader';
import { ResultsDashboard } from './components/ResultsDashboard';
import { BarcodeScanner } from './components/BarcodeScanner';
import { ScanHistory } from './components/ScanHistory';
import { GamificationHub } from './components/GamificationHub';
import { PRODUCTS_DB } from './data/knowledgeBase';

export const App = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [analysisStage, setAnalysisStage] = useState<'vision' | 'ocr' | 'fusion' | 'complete'>('vision');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentImageThumbnail, setCurrentImageThumbnail] = useState<string>("");
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const enhanceImage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.filter = 'contrast(1.2) brightness(1.1) saturate(1.1)';
  };

  const captureImage = () => {
    if (videoRef.current && videoRef.current.readyState === 4) {
      setIsProcessing(true); // Start loading spinner
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        enhanceImage(canvas, ctx);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            processImage(file);
          } else {
            setError("Failed to capture image frame.");
            setIsProcessing(false);
          }
        }, 'image/jpeg', 0.9);
      }
    } else {
        setError("Camera not ready. Please wait a moment.");
    }
  };

  const processImage = async (file: File) => {
    stopStream();
    setAppState(AppState.ANALYZING);
    setAnalysisStage('vision');
    setError(null);
    setIsProcessing(false); // Stop capture spinner, transitioning to analysis loader

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
        const base64data = reader.result as string;
        setCurrentImageThumbnail(base64data);

        if (!navigator.onLine) {
            setError("You are offline. Please check your internet connection.");
            setAppState(AppState.SCANNING);
            return;
        }

        try {
            // 1. TF.js
            const imgElement = document.createElement('img');
            imgElement.src = base64data;
            await new Promise((resolve) => { imgElement.onload = resolve; });
            
            const classifications = await classifyImage(imgElement);
            setAnalysisStage('ocr');

            // 2. OCR
            const ocrText = await extractTextFromImage(file);
            setAnalysisStage('fusion');

            // 3. Gemini
            const localAI: LocalAIResult = { classification: classifications, ocrText };
            const finalResult = await analyzeSustainability(base64data, localAI);
            
            setResult(finalResult);
            setAnalysisStage('complete');
            setAppState(AppState.RESULTS);
        } catch (e: any) {
            console.error(e);
            const msg = e.message || "An unexpected error occurred during analysis.";
            setError(msg);
            setAppState(AppState.SCANNING);
        }
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
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
    <div className="flex flex-col h-screen bg-cream dark:bg-stone-900 transition-colors duration-300 relative overflow-hidden">
        {renderError()}
        {/* Toggle Dark Mode */}
        <button 
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 dark:text-white transition-colors"
        >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-terracotta rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-periwinkle rounded-full opacity-20 blur-xl"></div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 w-full max-w-md mx-auto">
            {/* Gamification Hub */}
            <div className="w-full mb-8">
               <GamificationHub profile={getGamificationProfile()} />
            </div>

            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-ink dark:text-white mb-2 transition-colors">EcoThreads</h1>
                <h2 className="text-xl font-medium text-terracotta">Scan for Earth</h2>
            </div>
            
            <div className="relative w-56 h-56 mb-10 group cursor-pointer mx-auto" onClick={handleStart}>
                 <img src="https://picsum.photos/id/445/500/500" className="w-full h-full object-cover rounded-full border-4 border-white dark:border-stone-800 shadow-xl transition-colors" alt="Fashion" />
                 <div className="absolute -bottom-4 -right-4 bg-white dark:bg-stone-800 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ScanLine className="w-8 h-8 text-terracotta" />
                 </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-xs text-lg transition-colors text-center mx-auto">
                Instantly analyze your wardrobe's impact via 
                <span className="font-bold text-ink dark:text-white"> AI Fusion & Barcodes</span>.
            </p>

            <div className="flex gap-4 justify-center">
                <button 
                    onClick={handleStart}
                    className="bg-ink dark:bg-white text-white dark:text-ink px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-all flex items-center gap-3"
                >
                    Start Scanning <ArrowRight size={20} />
                </button>
                
                <button 
                    onClick={() => setAppState(AppState.HISTORY)}
                    className="bg-white dark:bg-stone-800 text-ink dark:text-white p-4 rounded-full shadow-lg hover:scale-105 transition-all border border-stone-100 dark:border-stone-700"
                    aria-label="History"
                >
                    <History size={24} />
                </button>
            </div>
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
                
                {/* Scan Box */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-white/30 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Animated Scan Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-terracotta/80 shadow-[0_0_20px_rgba(217,93,57,0.8)] animate-scan"></div>
                    
                    {/* Corner Markers */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                </div>
                
                <p className="absolute bottom-[18%] left-0 right-0 text-center text-white/90 text-sm font-medium tracking-wide drop-shadow-md">
                    Align garment within frame
                </p>
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
                className="p-4 rounded-full bg-stone-800 text-white hover:bg-stone-700 transition-colors flex flex-col items-center gap-1 active:scale-95"
                title="Upload Image"
            >
                <Upload size={24} />
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
