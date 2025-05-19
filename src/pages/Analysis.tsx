
import React, { useEffect, useState } from "react";
import { useVideo } from "@/contexts/VideoContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AnalysisMetric from "@/components/AnalysisMetric";
import InsightItem from "@/components/InsightItem";
import { Download, Play, FileText, BarChart3, ArrowLeft, Send, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const Analysis: React.FC = () => {
  const { recordedVideo, transcription, analysis, insights } = useVideo();
  const navigate = useNavigate();
  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: "user" | "assistant", content: string}[]>([
    { role: "assistant", content: "Olá! Estou aqui para ajudar com qualquer dúvida sobre sua entrevista. O que gostaria de saber?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    // Mock AI response (in a real app, you would call an API)
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: `Entendi sua pergunta sobre "${userMessage}". Com base na sua entrevista, posso dizer que você demonstrou boas habilidades de comunicação. Continue praticando e aperfeiçoando suas respostas.` 
        }
      ]);
      setIsLoading(false);
      setUserMessage("");
    }, 1000);
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Resumo da Análise</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-interview-text">{insights.summary}</p>
                </CardContent>
              </Card>
              
              <div className="mt-8">
                <Card>
                  <CardHeader className="flex flex-row items-center">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Converse com a IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="border rounded-lg p-4 h-80 overflow-y-auto">
                        {chatMessages.map((message, index) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-lg mb-2 ${
                              message.role === "user" 
                                ? "bg-primary text-primary-foreground ml-8" 
                                : "bg-gray-100 text-interview-text mr-8"
                            }`}
                          >
                            {message.content}
                          </div>
                        ))}
                        {isLoading && (
                          <div className="p-3 rounded-lg mb-2 bg-gray-100 text-interview-text mr-8">
                            <div className="flex gap-1 items-center">
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Textarea 
                          placeholder="Faça uma pergunta sobre sua entrevista..."
                          className="resize-none"
                          value={userMessage}
                          onChange={(e) => setUserMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button 
                          className="bg-green-500 hover:bg-green-600" 
                          onClick={handleSendMessage}
                          disabled={isLoading || !userMessage.trim()}
                        >
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
