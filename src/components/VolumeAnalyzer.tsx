
import React, { useEffect, useRef, useState } from 'react';
import { Slider } from "@/components/ui/slider";

interface VolumeAnalyzerProps {
  audioSource: MediaStreamAudioSourceNode;
  audioContext: AudioContext;
}

export const VolumeAnalyzer: React.FC<VolumeAnalyzerProps> = ({ audioSource, audioContext }) => {
  const [volume, setVolume] = useState<number>(0);
  const [sensitivity, setSensitivity] = useState<number>(1.5);
  const rafRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    // Create analyzer node
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 256;
    audioSource.connect(analyserNode);
    
    // Create data array for analyzer data
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Store refs
    analyserRef.current = analyserNode;
    dataArrayRef.current = dataArray;
    
    // Start the volume analyzer
    const updateVolume = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      
      // Get volume data
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      // Calculate average volume
      const average = dataArrayRef.current.reduce((acc, val) => acc + val, 0) / dataArrayRef.current.length;
      
      // Normalize to 0-100 and apply sensitivity
      const normalizedVolume = Math.min(100, average * sensitivity);
      
      setVolume(normalizedVolume);
      
      // Continue animation loop
      rafRef.current = requestAnimationFrame(updateVolume);
    };
    
    updateVolume();
    
    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (analyserRef.current) {
        audioSource.disconnect(analyserRef.current);
      }
    };
  }, [audioContext, audioSource, sensitivity]);
  
  // Determine the color based on volume level
  const getVolumeColor = () => {
    if (volume < 30) return 'bg-gray-300'; // Low volume
    if (volume < 70) return 'bg-green-500'; // Good volume
    return 'bg-red-500'; // Too loud
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
        <span>Volume</span>
        <div className="flex items-center gap-2">
          <span>Sensitivity:</span>
          <Slider 
            value={[sensitivity]} 
            min={0.5} 
            max={3} 
            step={0.1}
            onValueChange={(values) => setSensitivity(values[0])}
            className="w-24"
          />
        </div>
      </div>
      
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getVolumeColor()} transition-all duration-75`} 
          style={{ width: `${volume}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>Silêncio</span>
        <span>Volume Ideal</span>
        <span>Muito Alto</span>
      </div>
    </div>
  );
};
