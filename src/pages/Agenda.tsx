import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, User, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  time: string;
  patient: string;
  professional: string;
  service: string;
  status: "confirmed" | "in-progress" | "waiting" | "reception";
  color: string;
}

interface WaitingPatient {
  id: string;
  name: string;
  service: string;
  priority: "normal" | "urgent";
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    time: "09:00",
    patient: "Maria Silva",
    professional: "Dr. Rafael",
    service: "Avaliação Botox",
    status: "confirmed",
    color: "emerald"
  },
  {
    id: "2",
    time: "10:30",
    patient: "João Santos",
    professional: "Dra. Carolina",
    service: "Consulta Dermatológica",
    status: "in-progress",
    color: "purple"
  },
  {
    id: "3",
    time: "14:00",
    patient: "Ana Costa",
    professional: "Dr. Rafael",
    service: "Preenchimento Labial",
    status: "reception",
    color: "yellow"
  },
  {
    id: "4",
    time: "15:30",
    patient: "Pedro Oliveira",
    professional: "Dra. Carolina",
    service: "Limpeza de Pele",
    status: "confirmed",
    color: "emerald"
  }
];

const mockWaitingList: WaitingPatient[] = [
  {
    id: "1",
    name: "Carlos Mendes",
    service: "Consulta de Retorno",
    priority: "urgent"
  },
  {
    id: "2",
    name: "Juliana Souza",
    service: "Avaliação Inicial",
    priority: "normal"
  }
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00"
];

const getStatusBadge = (status: Appointment["status"]) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">Confirmado</Badge>;
    case "in-progress":
      return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs">Em Atendimento</Badge>;
    case "reception":
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs">Na Recepção</Badge>;
    case "waiting":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">Aguardando</Badge>;
  }
};

const Agenda = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month" | "list">("day");
  const [selectedProfessional, setSelectedProfessional] = useState<string>("all");

  const filteredAppointments = selectedProfessional === "all"
    ? mockAppointments
    : mockAppointments.filter(apt => apt.professional === selectedProfessional);

  return (
    <div className="min-h-screen flex bg-gray-50 dashboard-theme">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
              <p className="text-gray-600 mt-1">Gerencie os agendamentos da clínica</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Plus className="h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>

          {/* Filters and View Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant={view === "day" ? "default" : "outline"}
                onClick={() => setView("day")}
                className={view === "day" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                Hoje
              </Button>
              <Button
                variant={view === "week" ? "default" : "outline"}
                onClick={() => setView("week")}
                className={view === "week" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                Semana
              </Button>
              <Button
                variant={view === "month" ? "default" : "outline"}
                onClick={() => setView("month")}
                className={view === "month" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                Mês
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                onClick={() => setView("list")}
                className={view === "list" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                Lista
              </Button>
            </div>

            <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Profissionais</SelectItem>
                <SelectItem value="Dr. Rafael">Dr. Rafael</SelectItem>
                <SelectItem value="Dra. Carolina">Dra. Carolina</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Calendar Area */}
            <div className="lg:col-span-3">
              <Card className="border-gray-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-emerald-600" />
                    {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Time Slots View */}
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {timeSlots.map((time) => {
                      const appointment = filteredAppointments.find(apt => apt.time === time);
                      
                      return (
                        <div key={time} className="flex items-start gap-4 border-b border-gray-100 pb-2">
                          <div className="w-20 flex-shrink-0 pt-2">
                            <span className="text-sm font-medium text-gray-600">{time}</span>
                          </div>
                          
                          {appointment ? (
                            <div className={`flex-1 p-3 rounded-lg border-l-4 border-${appointment.color}-500 bg-${appointment.color}-50 hover:shadow-sm transition-shadow cursor-pointer`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{appointment.patient}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{appointment.service}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <User className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs text-gray-600">{appointment.professional}</span>
                                  </div>
                                </div>
                                {getStatusBadge(appointment.status)}
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 p-3 border border-dashed border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors cursor-pointer">
                              <span className="text-sm text-gray-400">Horário disponível</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Mini Calendar */}
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    locale={ptBR}
                    className="rounded-md"
                  />
                </CardContent>
              </Card>

              {/* Waiting List */}
              <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    Fila de Espera / Encaixes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockWaitingList.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm text-gray-900">{patient.name}</h4>
                          {patient.priority === "urgent" && (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
                              Urgente
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{patient.service}</p>
                      </div>
                    ))}

                    {mockWaitingList.length === 0 && (
                      <div className="text-center py-6 text-gray-400 text-sm">
                        Nenhum paciente na fila
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Agenda;
