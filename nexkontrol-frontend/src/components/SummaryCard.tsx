// src/components/SummaryCard.tsx
import { Card } from "../components/ui/card"; // Importe Card e CardContent
import { cn } from "../lib/utils";
import type { LucideIcon } from "lucide-react"; // Para tipagem do ícone
 // Para tipagem do ícone

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon; // Novo: para passar o ícone
  iconColorClass: string; // Novo: cor do ícone e do texto do valor
}

export default function SummaryCard({ title, amount, icon: Icon, iconColorClass }: SummaryCardProps) {
  return (
    <Card className="flex flex-col gap-2 p-5 items-start"> {/* Ajuste de padding e alinhamento */}
      <span className="text-sm text-gray-500">{title}</span>
      <div className={cn("text-xl font-bold flex items-center gap-2", iconColorClass)}>
        <Icon className="w-5 h-5" />
        R$ {amount.toFixed(2)}
      </div>
    </Card>
  );
}