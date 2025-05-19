
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-interview-background">
      <div className="text-center">
        <h1 className="text-7xl font-bold mb-4 text-interview-primary">404</h1>
        <p className="text-xl text-interview-secondary mb-8">Ops! Página não encontrada</p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-interview-primary hover:bg-interview-primary/90"
        >
          Voltar para a Página Inicial
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
