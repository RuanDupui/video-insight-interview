
import React from "react";
import { Progress } from "@/components/ui/progress";

interface AnalysisMetricProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
}

const AnalysisMetric: React.FC<AnalysisMetricProps> = ({ title, value, icon }) => {
  // Determine color based on value
  const getColorClass = () => {
    if (value >= 80) return "text-interview-success";
    if (value >= 60) return "text-interview-primary";
    if (value >= 40) return "text-interview-warning";
    return "text-interview-danger";
  };

  const getProgressColor = () => {
    if (value >= 80) return "bg-interview-success";
    if (value >= 60) return "bg-interview-primary";
    if (value >= 40) return "bg-interview-warning";
    return "bg-interview-danger";
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-interview-border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-interview-secondary">{title}</h3>
        <span className={`text-lg font-bold ${getColorClass()}`}>{value}%</span>
      </div>
      <Progress value={value} className="h-2" indicatorClassName={getProgressColor()} />
    </div>
  );
};

export default AnalysisMetric;
