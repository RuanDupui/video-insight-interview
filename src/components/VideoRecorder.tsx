
import React, { useRef, useEffect, useState } from "react";
import { useVideo } from "@/contexts/VideoContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { VolumeAnalyzer } from "@/components/VolumeAnalyzer";

const VideoRecorder: React.FC = () => {
  const { isRecording, startRecording, stopRecording, setRecordedVideo } = useVideo();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioSource, setAudioSource] = useState<MediaStreamAudioSourceNode | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        // Setup audio context for volume analysis
        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        setAudioContext(context);
        setAudioSource(source);
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          title: "Erro na câmera",
          description: "Não foi possível acessar sua câmera. Verifique as permissões.",
          variant: "destructive",
        });
      }
    };

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [toast]);

  useEffect(() => {
    if (!streamRef.current) return;

    if (isRecording) {
      // Reset chunks before starting new recording
      chunksRef.current = [];
      
      const options = { mimeType: "video/webm;codecs=vp9,opus" };
      try {
        mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
      } catch (e) {
        // Fallback if the primary codec isn't supported
        try {
          mediaRecorderRef.current = new MediaRecorder(streamRef.current);
        } catch (err) {
          console.error("MediaRecorder not supported:", err);
          toast({
            title: "Erro na gravação",
            description: "Seu navegador não suporta gravação de vídeo.",
            variant: "destructive",
          });
          return;
        }
      }

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        
        // Mock data for demonstration
        // In real app this would come from an AI service
        mockAnalysisData();
        
        navigate("/analysis");
      };

      mediaRecorderRef.current.start();
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording, setRecordedVideo, navigate, toast]);

  const handleStartRecording = () => {
    startRecording();
    toast({
      title: "Gravação iniciada",
      description: "Sua entrevista está sendo gravada.",
    });
  };

  const handleFinishInterview = () => {
    setIsConfirmOpen(true);
  };

  const confirmFinish = () => {
    stopRecording();
    setIsConfirmOpen(false);
  };

  const mockAnalysisData = () => {
    // This function mocks the data that would come from Gemini AI
    // In a real implementation, you would call an API to get analysis from Gemini
    const videoContext = useVideo();
    
    // Mock transcription
    videoContext.setTranscription(
      "Olá, meu nome é João Silva e estou muito feliz em participar deste processo seletivo. Tenho experiência de 5 anos em desenvolvimento de software, principalmente com tecnologias web como React, Node.js e bancos de dados SQL e NoSQL. Trabalhei em projetos de diferentes escalas, desde startups até grandes empresas. Minha principal força é a capacidade de entender requisitos de negócio e transformá-los em soluções técnicas eficientes. Sou apaixonado por aprender novas tecnologias e metodologias, e acredito que posso agregar muito valor à equipe."
    );
    
    // Mock analysis scores
    videoContext.setAnalysis({
      communication: 85,
      clarity: 78,
      confidence: 90,
      energy: 72,
    });
    
    // Mock insights
    videoContext.setInsights({
      strengths: [
        "Comunicação clara e articulada",
        "Demonstra confiança ao falar sobre experiências passadas",
        "Mantém bom contato visual durante toda a entrevista",
        "Estrutura lógica nas respostas"
      ],
      improvements: [
        "Poderia demonstrar mais energia e entusiasmo",
        "Em alguns momentos, usou terminologia técnica sem explicar o contexto",
        "Poderia fornecer exemplos mais concretos de realizações"
      ],
      summary: "O candidato demonstra forte capacidade de comunicação e confiança. Apresenta suas qualificações de forma clara e estruturada, mantendo bom contato visual. Para melhorar, poderia demonstrar mais entusiasmo e fornecer exemplos mais específicos de suas realizações profissionais. No geral, apresenta boa presença e habilidades de comunicação adequadas para a posição."
    });
  };

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-auto rounded-lg shadow-lg"
      />
      
      {/* Volume Analyzer */}
      {audioSource && audioContext && (
        <div className="my-3">
          <VolumeAnalyzer audioSource={audioSource} audioContext={audioContext} />
        </div>
      )}
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
        {!isRecording ? (
          <Button 
            onClick={handleStartRecording}
            className="bg-interview-primary hover:bg-interview-primary/90 text-white font-medium px-6 py-3 rounded-full transition-all shadow-md"
          >
            Iniciar Entrevista
          </Button>
        ) : (
          <Button 
            onClick={handleFinishInterview}
            className="bg-interview-accent hover:bg-interview-accent/90 text-white font-medium px-6 py-3 rounded-full transition-all shadow-md flex items-center gap-2"
          >
            <span className="animate-pulse-record h-3 w-3 rounded-full bg-white"></span>
            Finalizar Entrevista
          </Button>
        )}
      </div>
      
      {isRecording && (
        <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/30 text-white px-3 py-1 rounded-full">
          <span className="animate-pulse-record h-2 w-2 rounded-full bg-interview-accent"></span>
          <span className="text-sm font-medium">Gravando</span>
        </div>
      )}
      
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Entrevista?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja finalizar a entrevista? Após finalizar, você será redirecionado para a tela de análise.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmFinish} className="bg-interview-primary">
              Sim, finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VideoRecorder;
