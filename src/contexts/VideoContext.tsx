
import React, { createContext, useState, useContext, ReactNode } from "react";

interface VideoContextProps {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  recordedVideo: string | null;
  setRecordedVideo: (url: string | null) => void;
  transcription: string;
  setTranscription: (text: string) => void;
  analysis: {
    communication: number;
    clarity: number;
    confidence: number;
    energy: number;
  };
  setAnalysis: (analysis: {
    communication: number;
    clarity: number;
    confidence: number;
    energy: number;
  }) => void;
  insights: {
    strengths: string[];
    improvements: string[];
    summary: string;
  };
  setInsights: (insights: {
    strengths: string[];
    improvements: string[];
    summary: string;
  }) => void;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [transcription, setTranscription] = useState("");
  const [analysis, setAnalysis] = useState({
    communication: 0,
    clarity: 0,
    confidence: 0,
    energy: 0,
  });
  const [insights, setInsights] = useState({
    strengths: [],
    improvements: [],
    summary: "",
  });

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const value = {
    isRecording,
    startRecording,
    stopRecording,
    recordedVideo,
    setRecordedVideo,
    transcription,
    setTranscription,
    analysis,
    setAnalysis,
    insights,
    setInsights,
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};

export const useVideo = (): VideoContextProps => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
};
