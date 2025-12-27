import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Patient } from "@/types/patient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
  onChatClick?: (patient: Patient) => void;
}

export function PatientCard({ patient, onClick, onChatClick }: PatientCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: patient.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "group relative bg-white p-4 rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-all cursor-pointer",
        isDragging && "opacity-50 rotate-2 scale-105 shadow-xl ring-2 ring-primary/20",
        "hover:border-primary/20"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10 border border-gray-100 bg-gray-50 text-emerald-600 font-semibold">
          <AvatarImage src={patient.avatar} alt={patient.name} />
          <AvatarFallback className="bg-emerald-50 text-emerald-600">
             {getInitials(patient.name)}
          </AvatarFallback>
        </Avatar>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
             <div>
                <h3 className="font-semibold text-gray-900 truncate pr-2">{patient.name}</h3>
                <p className="text-xs text-gray-500 truncate">{patient.service}</p>
             </div>
             {patient.priority === "high" && (
                 <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" title="Prioridade Alta" />
             )}
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
             <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{patient.date}</span>
             </div>
             {patient.time && (
                 <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{patient.time}</span>
                 </div>
             )}
          </div>

            {/* Tags & Value */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
               <div className="flex gap-2">
                   {patient.healthPlan && (
                       <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                           {patient.healthPlan}
                       </Badge>
                   )}
                   {/* Fallback Badge if no plan but needs tag */}
                   {!patient.healthPlan && (
                       <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal bg-gray-100 text-gray-600">
                           Particular
                       </Badge>
                   )}
               </div>
               
               {patient.value && (
                   <span className="text-xs font-medium text-gray-700">
                       {patient.value}
                   </span>
               )}
            </div>

            {/* Actions (Hover) */}
            <div className="absolute bottom-3 right-3 hidden group-hover:flex items-center gap-1 bg-white pl-2 shadow-[-10px_0_10px_white]">
               {onChatClick && (
                    <div 
                        role="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChatClick(patient);
                        }}
                        className="p-1.5 hover:bg-green-50 rounded-full text-green-600 transition-colors"
                        title="Abrir WhatsApp"
                    >
                        <MessageCircle className="h-4 w-4" />
                    </div>
               )}
            </div>
        </div>
      </div>
    </div>
  );
}
