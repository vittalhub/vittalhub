import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { KanbanBoard } from "@/components/dashboard/kanban/KanbanBoard";
import { Search, Filter, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhatsAppInterface } from "@/components/crm/WhatsAppInterface";
import { FloatingWhatsAppButton } from "@/components/crm/FloatingWhatsAppButton";
import { NewPatientModal } from "@/components/crm/NewPatientModal";
import { Patient } from "@/types/patient";
import { initialColumns } from "@/data/mockData";

const CRM = () => {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [selectedChatPatient, setSelectedChatPatient] = useState<Patient | null>(null);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [columns, setColumns] = useState(initialColumns);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChatOpen = (patient?: Patient) => {
    if (patient) {
      setSelectedChatPatient(patient);
    }
    setIsWhatsAppOpen(true);
  };

  const handleAddPatient = (newPatient: Omit<Patient, "id">) => {
    const patientWithId: Patient = {
      ...newPatient,
      id: `patient-${Date.now()}`,
    };

    // Adicionar à coluna "Novos Contatos"
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === "new"
          ? { ...col, patients: [...col.patients, patientWithId] }
          : col
      )
    );
  };

  return (
    <div className="min-h-screen flex bg-muted/30 dashboard-theme">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fluxo de Atendimento</h1>
              <p className="text-sm text-gray-500">Gerencie o pipeline de pacientes</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Notificações */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Botão Novo Contato */}
              <Button
                onClick={() => setIsNewPatientModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Contato
              </Button>
            </div>
          </div>

          {/* Barra de Busca e Filtros */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar contato..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Kanban Area */}
        <div className="flex-1 overflow-x-auto p-6">
          <KanbanBoard onChatClick={handleChatOpen} />
        </div>

        {/* WhatsApp Interface Overlay */}
        <WhatsAppInterface
          isOpen={isWhatsAppOpen}
          onClose={() => setIsWhatsAppOpen(false)}
          initialPatient={selectedChatPatient?.name}
        />

        {/* Floating Action Button */}
        {!isWhatsAppOpen && (
          <FloatingWhatsAppButton onClick={() => setIsWhatsAppOpen(true)} />
        )}

        {/* New Patient Modal */}
        <NewPatientModal
          isOpen={isNewPatientModalOpen}
          onClose={() => setIsNewPatientModalOpen(false)}
          onAddPatient={handleAddPatient}
        />
      </main>
    </div>
  );
};

export default CRM;
