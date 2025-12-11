
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

// Singleton to hold the model
let model: mobilenet.MobileNet | null = null;
let loadAttempted = false;

export const loadModel = async () => {
  if (model) return model;
  if (loadAttempted) return null; // Prevent retrying if it failed once

  try {
    console.log("Loading MobileNet model...");
    // Force CPU backend if WebGL is unstable in some environments, but usually auto is fine.
    await tf.ready();
    
    // Attempt to load. This usually fetches from GCS. 
    // If offline, it throws "Failed to fetch".
    model = await mobilenet.load();
    console.log("MobileNet model loaded.");
    return model;
  } catch (error) {
    console.warn("MobileNet load failed (likely offline). Visual classification disabled.", error);
    loadAttempted = true; // Mark as failed to stop future attempts
    return null;
  }
};

export const classifyImage = async (imageElement: HTMLImageElement): Promise<string[]> => {
  const net = await loadModel();
  
  if (!net) {
    // Return fallback classification if model isn't available
    return ["textile", "fashion_item"];
  }

  try {
    const predictions = await net.classify(imageElement);
    return predictions.map(p => p.className);
  } catch (error) {
    console.error("Classification Inference Error:", error);
    return ["fashion_item"];
  }
};
