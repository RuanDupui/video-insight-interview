
import React, { useEffect } from "react";
import { useVideo } from "@/contexts/VideoContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AnalysisMetric from "@/components/AnalysisMetric";
import InsightItem from "@/components/InsightItem";
import { Download, Play, FileText, BarChart3, ArrowLeft } from "lucide-react";

const Analysis: React.FC = () => {
  const { recordedVideo, transcription, analysis, insights } = useVideo();
  const navigate = useNavigate();

  useEffect(() => {
    // If there's no recorded video, redirect to the interview page
    if (!recordedVideo) {
      navigate("/");
    }
  }, [recordedVideo, navigate]);

  const handleDownload = () => {
    if (recordedVideo) {
      const a = document.createElement("a");
      a.href = recordedVideo;
      a.download = `entrevista-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleNewInterview = () => {
    navigate("/");
  };

  if (!recordedVideo) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-interview-background flex flex-col">
      <header className="bg-white border-b border-interview-border py-4">
        <div className="container max-w-7xl">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-interview-text">InterviewAI</h1>
            <Button
              variant="outline"
              onClick={handleNewInterview}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Nova Entrevista
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container max-w-7xl py-8 px-4 md:px-0">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-interview-text mb-2">Análise da Entrevista</h2>
          <p className="text-interview-secondary">
            Veja abaixo a análise detalhada da sua entrevista feita com inteligência artificial.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <Tabs defaultValue="resumo" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="resumo" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Resumo
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Vídeo
              </TabsTrigger>
              <TabsTrigger value="transcricao" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Transcrição
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="resumo" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Métricas de Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AnalysisMetric title="Comunicação" value={analysis.communication} />
                      <AnalysisMetric title="Clareza" value={analysis.clarity} />
                      <AnalysisMetric title="Confiança" value={analysis.confidence} />
                      <AnalysisMetric title="Energia" value={analysis.energy} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium text-interview-text mb-2">Pontos Fortes</h3>
                    <div className="mb-4">
                      {insights.strengths.map((strength, index) => (
                        <InsightItem key={index} text={strength} type="strength" />
                      ))}
                    </div>
                    
                    <h3 className="font-medium text-interview-text mb-2">Áreas para Melhorar</h3>
                    <div>
                      {insights.improvements.map((improvement, index) => (
                        <InsightItem key={index} text={improvement} type="improvement" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Resumo da Análise</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-interview-text">{insights.summary}</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="video" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Gravação da Entrevista</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-4xl mx-auto">
                    <video
                      src={recordedVideo}
                      controls
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                    
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Baixar Vídeo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transcricao" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Transcrição da Entrevista</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-6 text-interview-text whitespace-pre-wrap">
                    {transcription}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-interview-secondary bg-white border-t border-interview-border">
        <div className="container">
          <p>© 2025 InterviewAI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Analysis;
