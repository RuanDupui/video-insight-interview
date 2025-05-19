import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoRecorder from "@/components/VideoRecorder";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Save, FileText, Send, MessageSquare } from "lucide-react";
import { useVideo } from "@/contexts/VideoContext";
import { useToast } from "@/components/ui/use-toast";

const Interview: React.FC = () => {
  const [position, setPosition] = useState("");
  const { isRecording, recordedVideo } = useVideo();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Chat state
  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: "user" | "assistant", content: string}[]>([
    { role: "assistant", content: "Olá! Estou aqui para ajudar com qualquer dúvida sobre entrevistas. O que gostaria de saber?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePositionChange = (value: string) => {
    setPosition(value);
  };

  const handleAnalyze = () => {
    if (!recordedVideo) {
      toast({
        title: "Nenhuma gravação disponível",
        description: "Você precisa gravar uma entrevista antes de analisá-la.",
        variant: "destructive",
      });
      return;
    }

    if (!position) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione o cargo para a entrevista.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call to analyze interview
    toast({
      title: "Analisando entrevista",
      description: "Sua entrevista está sendo processada pela IA.",
    });
    
    // Navigate to analysis page
    navigate("/analysis");
  };

  const handleSave = () => {
    if (!recordedVideo) {
      toast({
        title: "Nenhuma gravação disponível",
        description: "Você precisa gravar uma entrevista antes de salvá-la.",
        variant: "destructive",
      });
      return;
    }

    // Simulate saving the interview
    toast({
      title: "Entrevista salva",
      description: "Sua entrevista foi salva com sucesso.",
    });
  };

  const handleViewResults = () => {
    if (!recordedVideo) {
      toast({
        title: "Nenhuma gravação disponível",
        description: "Você precisa gravar uma entrevista antes de ver os resultados.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to analysis page - same as handleAnalyze
    navigate("/analysis");
  };

  // Chat functionality
  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    // Mock AI response
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: `Entendi sua pergunta sobre "${userMessage}". Para entrevistas de emprego, é importante preparar-se bem, pesquisar sobre a empresa e praticar suas respostas para perguntas comuns. Posso ajudar com mais dicas específicas se desejar.` 
        }
      ]);
      setIsLoading(false);
      setUserMessage("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-interview-background flex flex-col">
      <header className="bg-white border-b border-interview-border py-4">
        <div className="container max-w-7xl">
          <h1 className="text-2xl font-semibold text-interview-text">InterviewAI</h1>
        </div>
      </header>
      
      <main className="flex-1 container max-w-7xl py-8 px-4 md:px-0">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-interview-text mb-2">Entrevista Presencial</h2>
                <p className="text-interview-secondary">
                  Posicione-se em frente à câmera e clique em "Iniciar Entrevista" quando estiver pronto.
                </p>
              </div>
              
              <VideoRecorder />
              
              <div className="mt-6 text-center text-sm text-interview-secondary">
                <p>Mantenha uma boa iluminação e fale com clareza para melhores resultados.</p>
              </div>
            </CardContent>
          </Card>

          {/* Job Selection and Analysis Button */}
          <div className="mt-6 space-y-4">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-interview-text mb-1">
                      Cargo
                    </label>
                    <Select value={position} onValueChange={handlePositionChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desenvolvedor">Desenvolvedor</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="gerente_projeto">Gerente de Projeto</SelectItem>
                        <SelectItem value="analista_dados">Analista de Dados</SelectItem>
                        <SelectItem value="marketing">Especialista em Marketing</SelectItem>
                        <SelectItem value="rh">Analista de RH</SelectItem>
                        <SelectItem value="vendas">Representante de Vendas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={handleAnalyze}
                      className="w-full bg-interview-primary hover:bg-interview-primary/90 text-white font-medium py-3 rounded-md shadow-md flex items-center justify-center gap-2"
                      disabled={isRecording}
                    >
                      <Zap className="w-5 h-5" />
                      Analisar com IA
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="aiDescription" className="block text-sm font-medium text-interview-text mb-1">
                      Descrição da Entrevista (Análise da IA)
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] border border-gray-200">
                      <p className="text-interview-secondary italic">
                        A análise da entrevista será exibida aqui após o processamento pela IA.
                      </p>
                    </div>
                  </div>

                  {/* Chat Component */}
                  <div className="mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-5 h-5" />
                            <h3 className="text-lg font-medium">Converse com a IA</h3>
                          </div>
                          <div className="border rounded-lg p-4 h-60 overflow-y-auto">
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
                              placeholder="Faça uma pergunta sobre entrevistas..."
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

                  <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      onClick={handleSave}
                      className="bg-interview-accent hover:bg-interview-accent/90 text-white font-medium py-3 rounded-md shadow-md flex items-center justify-center gap-2"
                      disabled={isRecording}
                    >
                      <Save className="w-5 h-5" />
                      Salvar Entrevista
                    </Button>
                    
                    <Button
                      onClick={handleViewResults}
                      className="bg-interview-success hover:bg-interview-success/90 text-white font-medium py-3 rounded-md shadow-md flex items-center justify-center gap-2"
                      disabled={isRecording}
                    >
                      <FileText className="w-5 h-5" />
                      Ver Resultados
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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

export default Interview;
