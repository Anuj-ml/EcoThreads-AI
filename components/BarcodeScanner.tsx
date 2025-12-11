import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Loader2 } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const elementId = "qr-reader-container";
    
    const startScanner = async () => {
      try {
        // Wait briefly for DOM and previous camera streams to cleanup
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!mountedRef.current) return;

        const html5QrCode = new Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            formatsToSupport: [
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.QR_CODE
            ]
          },
          (decodedText) => {
            if (mountedRef.current) {
                if (navigator.vibrate) navigator.vibrate(200);
                onScan(decodedText);
                // Stop immediately to prevent duplicate reads
                html5QrCode.stop().catch(console.error);
            }
          },
          (errorMessage) => {
            // Ignore frame parse errors
          }
        );
        
        if (mountedRef.current) setIsInitializing(false);

      } catch (err: any) {
        console.error("Scanner Start Error:", err);
        if (mountedRef.current) {
            setIsInitializing(false);
            if (err?.name === 'NotAllowedError') {
                setError("Camera permission denied. Please allow camera access.");
            } else if (err?.name === 'NotFoundError') {
                setError("No camera found.");
            } else {
                setError("Failed to start scanner. Please try again.");
            }
        }
      }
    };

    startScanner();

    return () => {
      mountedRef.current = false;
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
            scannerRef.current?.clear();
        }).catch(err => console.warn("Scanner stop error:", err));
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fade-in">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm z-50 transition-colors"
        aria-label="Close Scanner"
      >
        <X size={24} />
      </button>
      
      <div className="w-full max-w-sm px-6 relative flex flex-col items-center">
        <h3 className="text-white mb-6 font-bold text-xl tracking-tight">Scan Barcode or QR</h3>
        
        <div className="w-full aspect-square bg-stone-900 rounded-2xl overflow-hidden shadow-2xl relative border border-white/10">
            {/* The library mounts the video element here */}
            <div id="qr-reader-container" className="w-full h-full"></div>
            
            {/* Loading Overlay */}
            {isInitializing && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900 z-10">
                    <Loader2 className="w-10 h-10 text-terracotta animate-spin mb-4" />
                    <p className="text-white/60 text-sm">Initializing camera...</p>
                </div>
            )}

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900 z-20 p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                        <X className="text-red-500" size={24} />
                    </div>
                    <p className="text-white font-medium mb-4">{error}</p>
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200"
                    >
                        Close
                    </button>
                </div>
            )}
            
            {/* Visual Guide Overlay (Visible when active) */}
            {!isInitializing && !error && (
                <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute inset-0 border-[40px] border-black/50"></div>
                     <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>
                     <div className="absolute bottom-6 left-0 right-0 text-center">
                        <span className="text-xs text-white/90 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                            Align code inside box
                        </span>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};