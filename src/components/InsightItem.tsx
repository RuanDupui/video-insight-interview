
import React from "react";
import { Check, AlertTriangle } from "lucide-react";

interface InsightItemProps {
  text: string;
  type: "strength" | "improvement";
}

const InsightItem: React.FC<InsightItemProps> = ({ text, type }) => {
  return (
    <div className="flex items-start gap-2 mb-2">
      {type === "strength" ? (
        <Check className="w-5 h-5 text-interview-success mt-0.5 flex-shrink-0" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-interview-warning mt-0.5 flex-shrink-0" />
      )}
      <p className="text-interview-text text-sm">{text}</p>
    </div>
  );
};

export default InsightItem;
