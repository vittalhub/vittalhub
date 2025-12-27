import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Mail, Phone, Edit, Trash2, Stethoscope } from "lucide-react";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  registration: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
}

const mockProfessionals: Professional[] = [
  {
    id: "1",
    name: "Dr. Rafael Costa",
    specialty: "Dermatologista",
    registration: "CRM 12345-SP",
    phone: "(11) 98765-4321",
    email: "rafael.costa@clinica.com",
    status: "active"
  },
  {
    id: "2",
    name: "Dra. Carolina Silva",
    specialty: "Esteticista",
    registration: "REG 67890-SP",
    phone: "(11) 98765-1234",
    email: "carolina.silva@clinica.com",
    status: "active"
  },
  {
    id: "3",
    name: "Dr. Pedro Oliveira",
    specialty: "Cirurgião Plástico",
    registration: "CRM 54321-SP",
    phone: "(11) 98765-5678",
    email: "pedro.oliveira@clinica.com",
    status: "inactive"
  },
  {
    id: "4",
    name: "Dra. Ana Martins",
    specialty: "Nutricionista",
    registration: "CRN 98765-SP",
    phone: "(11) 98765-9999",
    email: "ana.martins@clinica.com",
    status: "active"
  }
];

const Profissionais = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [professionals] = useState<Professional[]>(mockProfessionals);

  const filteredProfessionals = professionals.filter((prof) =>
    prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-emerald-50/30 dashboard-theme">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Profissionais</h1>
              <p className="text-gray-600">Gerencie a equipe da clínica</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 shadow-md hover:shadow-lg transition-all">
              <Plus className="h-4 w-4" />
              Novo Profissional
            </Button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou especialidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 shadow-sm"
              />
            </div>
          </div>

          {/* Professionals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional) => (
              <Card 
                key={professional.id} 
                className="border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg shadow-sm">
                        <Stethoscope className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{professional.name}</h3>
                        <p className="text-sm text-gray-600">{professional.specialty}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        professional.status === "active"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                      }
                    >
                      {professional.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <span className="font-medium">Registro:</span> {professional.registration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-emerald-600" />
                      {professional.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-emerald-600" />
                      <span className="truncate">{professional.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="flex-1 gap-2 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProfessionals.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Stethoscope className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Nenhum profissional encontrado</p>
              <p className="text-gray-400 text-sm mt-1">Tente ajustar sua busca</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profissionais;
