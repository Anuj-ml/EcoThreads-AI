import React from 'react';
import { Camera, ScanEye, BrainCircuit, Leaf } from 'lucide-react';

interface AnalysisLoaderProps {
  stage: 'vision' | 'ocr' | 'fusion' | 'complete';
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ stage }) => {
  const steps = [
    { id: 'vision', label: 'ResNet50 / MobileNet', sub: 'Detecting Fabric Composition', icon: ScanEye },
    { id: 'ocr', label: 'EasyOCR / Tesseract', sub: 'Reading Material Tags', icon: Camera },
    { id: 'fusion', label: 'Gemini Fusion Engine', sub: 'Calculating Sustainability Index', icon: BrainCircuit },
  ];

  const getStatusColor = (stepId: string) => {
    if (stage === stepId) return 'text-terracotta animate-pulse';
    const stages = ['vision', 'ocr', 'fusion', 'complete'];
    if (stages.indexOf(stage) > stages.indexOf(stepId)) return 'text-sage';
    return 'text-gray-300 dark:text-gray-600';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8 bg-cream dark:bg-stone-900 transition-colors duration-300">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-periwinkle/20 dark:bg-periwinkle/10 flex items-center justify-center animate-bounce">
          <Leaf className="w-12 h-12 text-terracotta" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-ink dark:text-white">Analyzing Impact...</h2>
      
      <div className="w-full max-w-md space-y-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="flex items-center p-4 bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-100 dark:border-stone-700 transition-all duration-300">
              <div className={`p-3 rounded-full bg-cream dark:bg-stone-900 ${getStatusColor(step.id)}`}>
                <Icon size={24} />
              </div>
              <div className="ml-4 text-left">
                <h3 className={`font-bold ${getStatusColor(step.id)}`}>{step.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{step.sub}</p>
              </div>
              {getStatusColor(step.id).includes('sage') && (
                <div className="ml-auto text-sage font-bold">✓</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};