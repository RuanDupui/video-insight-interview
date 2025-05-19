
import React from "react";
import { Progress } from "@/components/ui/progress";

interface AnalysisMetricProps {
  label: string;
  value: number;
  color: string;
}

const AnalysisMetric: React.FC<AnalysisMetricProps> = ({ label, value, color }) => {
  const getColorClass = () => {
    switch (color) {
      case "green":
        return "bg-interview-success";
      case "yellow":
        return "bg-interview-warning";
      case "blue":
        return "bg-interview-info";
      case "purple":
        return "bg-interview-primary";
      default:
        return "bg-interview-accent";
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-interview-text">{label}</span>
        <span className="text-sm font-semibold text-interview-text">{value}%</span>
      </div>
      <Progress 
        value={value} 
        className="h-2 w-full bg-slate-200"
        // Remove the indicatorClassName prop and use style for the indicator color
        style={{ 
          "--progress-indicator-color": getColorClass().replace("bg-", "var(--")+")"
        } as React.CSSProperties}
      />
    </div>
  );
};

export default AnalysisMetric;
