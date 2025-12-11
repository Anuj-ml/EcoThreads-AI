import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  try {
    const result = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: m => console.log('Tesseract Log:', m)
      }
    );
    return result.data.text;
  } catch (error) {
    console.error("OCR Error:", error);
    return "";
  }
};