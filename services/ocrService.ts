import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  try {
    // Check for online status before attempting to load external scripts
    if (!navigator.onLine) {
        console.warn("Offline: Skipping OCR as it requires downloading workers.");
        return "";
    }

    const result = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: m => console.log('Tesseract Log:', m),
        // Explicitly set paths to stable CDN versions to avoid importScripts errors
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.0/dist/worker.min.js',
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.0/tesseract-core.wasm.js',
        errorHandler: (err) => console.warn("Internal Tesseract Error:", err)
      }
    );
    return result.data.text;
  } catch (error) {
    console.warn("OCR Error (Non-fatal): Failed to process image text.", error);
    // Return empty string to allow the application to proceed with just visual analysis
    return "";
  }
};