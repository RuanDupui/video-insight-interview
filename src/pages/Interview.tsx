
import React from "react";
import VideoRecorder from "@/components/VideoRecorder";
import { Card, CardContent } from "@/components/ui/card";

const Interview: React.FC = () => {
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
