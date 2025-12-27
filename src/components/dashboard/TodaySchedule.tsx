import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  id: string;
  time: string;
  patientName: string;
  service: string;
  professional: string;
  status: "confirmed" | "in-progress" | "pending";
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    time: "09:00",
    patientName: "Maria Silva",
    service: "Avaliação Botox",
    professional: "Dr. Rafael",
    status: "confirmed"
  },
  {
    id: "2",
    time: "10:30",
    patientName: "João Santos",
    service: "Consulta Dermatológica",
    professional: "Dra. Carolina",
    status: "in-progress"
  },
  {
    id: "3",
    time: "14:00",
    patientName: "Ana Costa",
    service: "Preenchimento Labial",
    professional: "Dr. Rafael",
    status: "pending"
  },
  {
    id: "4",
    time: "15:30",
    patientName: "Pedro Oliveira",
    service: "Consulta Inicial",
    professional: "Dra. Carolina",
    status: "confirmed"
  }
];

const getStatusBadge = (status: Appointment["status"]) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Confirmado</Badge>;
    case "in-progress":
      return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Em Atendimento</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pendente</Badge>;
  }
};

export function TodaySchedule() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Agenda do Dia
        </CardTitle>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 text-sm">
              <CalendarIcon className="h-4 w-4" />
              {format(date, "dd/MM/yyyy", { locale: ptBR })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {mockAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
            >
              <div className="flex-shrink-0 w-16 text-center">
                <span className="text-lg font-bold text-gray-900">{appointment.time}</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                <p className="text-sm text-gray-600">{appointment.service}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{appointment.professional}</span>
                {getStatusBadge(appointment.status)}
              </div>
            </div>
          ))}

          {mockAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Nenhuma consulta agendada para hoje</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
