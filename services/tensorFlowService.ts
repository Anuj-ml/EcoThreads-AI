import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

// Singleton to hold the model
let model: mobilenet.MobileNet | null = null;

export const loadModel = async () => {
  if (!model) {
    console.log("Loading MobileNet model...");
    // Force CPU backend if WebGL is unstable in some environments, but usually auto is fine.
    await tf.ready();
    model = await mobilenet.load();
    console.log("MobileNet model loaded.");
  }
  return model;
};

export const classifyImage = async (imageElement: HTMLImageElement): Promise<string[]> => {
  try {
    const net = await loadModel();
    const predictions = await net.classify(imageElement);
    return predictions.map(p => p.className);
  } catch (error) {
    console.error("Classification Error:", error);
    return [];
  }
};