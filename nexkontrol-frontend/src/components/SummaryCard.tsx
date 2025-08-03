// src/components/SummaryCard.tsx
import React from "react";
import { Card } from "./ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "../lib/utils";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  className?: string;
}

const SummaryCard = React.memo<SummaryCardProps>(({ title, value, icon, trend, className }) => {
  return (
    <Card className={`flex flex-col gap-2 p-5 items-start ${className || ""}`}>
      <span className="text-sm text-gray-500">{title}</span>
      <div className="text-xl font-bold flex items-center gap-2">
        {icon}
        {formatCurrency(value)}
      </div>
      {trend && (
        <div className="flex items-center mt-1">
          {trend === "up" ? (
            <TrendingUp 
              className="w-4 h-4 text-green-500 mr-1" 
              aria-hidden="true"
            />
          ) : (
            <TrendingDown 
              className="w-4 h-4 text-red-500 mr-1" 
              aria-hidden="true"
            />
          )}
          <span 
            className={`text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}
            aria-label={`Tendência: ${trend === "up" ? "Crescimento" : "Redução"}`}
          >
            {trend === "up" ? "Crescimento" : "Redução"}
          </span>
        </div>
      )}
    </Card>
  );
});

SummaryCard.displayName = 'SummaryCard';

export default SummaryCard;