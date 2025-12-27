import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Mail, Phone, User } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  healthPlan: string;
  phone: string;
  email: string;
  lastService: string;
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Maria Silva",
    healthPlan: "Unimed",
    phone: "(11) 98765-4321",
    email: "maria.silva@email.com",
    lastService: "Avaliação Botox - 20/12/2024"
  },
  {
    id: "2",
    name: "João Santos",
    healthPlan: "Particular",
    phone: "(11) 98765-1234",
    email: "joao.santos@email.com",
    lastService: "Consulta Dermatológica - 18/12/2024"
  },
  {
    id: "3",
    name: "Ana Costa",
    healthPlan: "Bradesco Saúde",
    phone: "(11) 98765-5678",
    email: "ana.costa@email.com",
    lastService: "Preenchimento Labial - 15/12/2024"
  },
  {
    id: "4",
    name: "Pedro Oliveira",
    healthPlan: "Particular",
    phone: "(11) 98765-9012",
    email: "pedro.oliveira@email.com",
    lastService: "Limpeza de Pele - 10/12/2024"
  }
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const Pacientes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients] = useState<Patient[]>(mockPatients);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dashboard-theme">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
              <p className="text-gray-600 mt-1">Gerencie os pacientes da clínica</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Plus className="h-4 w-4" />
              Novo Paciente
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar paciente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Patients List */}
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <Card
                key={patient.id}
                className="border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 bg-emerald-50 text-emerald-600 text-lg font-semibold">
                      <AvatarFallback className="bg-emerald-50 text-emerald-600">
                        {getInitials(patient.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{patient.name}</h3>
                        <Badge
                          className={
                            patient.healthPlan === "Particular"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                              : "bg-purple-100 text-purple-700 hover:bg-purple-100"
                          }
                        >
                          {patient.healthPlan}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="text-xs">Último: {patient.lastService}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Nenhum paciente encontrado</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Pacientes;
