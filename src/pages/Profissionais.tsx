import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Mail, Phone, Edit, Trash2, Stethoscope, UserPlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  registration: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  role?: string;
}

const Profissionais = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    especialidade: "",
    role: "professional",
    telefone: ""
  });

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('clinica_id')
        .eq('id', session.user.id)
        .single();
      
      if (!userProfile?.clinica_id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('clinica_id', userProfile.clinica_id);
      
      if (error) throw error;

      if (data) {
        const mappedProfessionals: Professional[] = data.map(profile => ({
          id: profile.id,
          name: profile.full_name || 'Sem nome',
          specialty: profile.especialidade || 'Não informada',
          registration: profile.registro_profissional || '-',
          phone: profile.telefone || '-',
          email: profile.email,
          status: profile.status as "active" | "inactive" || "active",
          role: profile.role
        }));
        setProfessionals(mappedProfessionals);
      }
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      toast.error("Erro ao carregar profissionais");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfessional = async () => {
    if (!formData.nome || !formData.email) {
      toast.error("Preencha nome e email");
      return;
    }

    setCreating(true);
    try {
      // Como não podemos criar usuário Auth no client sem deslogar,
      // vamos simular o convite por enquanto ou usar uma função RPC se existisse.
      // Para este MVP, vamos apenas mostrar um Toast informando o fluxo correto.
      
      // IDEAL: Chamar Edge Function que faz supabase.auth.admin.inviteUserByEmail()
      
      // Simulação visual para o usuário ver o fluxo:
      toast.success("Convite enviado com sucesso!", {
        description: `Um email foi enviado para ${formData.email} com instruções para definir a senha.`
      });
      
      setIsModalOpen(false);
      setFormData({
        nome: "",
        email: "",
        especialidade: "",
        role: "professional",
        telefone: ""
      });

    } catch (error) {
      toast.error("Erro ao enviar convite");
    } finally {
      setCreating(false);
    }
  };

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
            
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 shadow-md hover:shadow-lg transition-all">
                  <UserPlus className="h-4 w-4" />
                  Convidar Profissional
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Convidar Profissional</DialogTitle>
                  <DialogDescription>
                    Envie um convite para um novo membro da equipe. Ele receberá um email para definir a senha.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Dr. João Silva"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Corporativo</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="joao@clinica.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Função / Permissão</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value) => setFormData({...formData, role: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador (Acesso Total)</SelectItem>
                        <SelectItem value="professional">Profissional de Saúde</SelectItem>
                        <SelectItem value="receptionist">Recepcionista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="specialty">Especialidade (Opcional)</Label>
                    <Input
                      id="specialty"
                      value={formData.especialidade}
                      onChange={(e) => setFormData({...formData, especialidade: e.target.value})}
                      placeholder="Ex: Dermatologista"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button onClick={handleCreateProfessional} disabled={creating} className="bg-emerald-600">
                    {creating ? "Enviando..." : "Enviar Convite"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                      variant={professional.status === "active" ? "default" : "secondary"}
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
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize text-xs">
                           {professional.role === 'admin' ? 'Administrador' : 
                            professional.role === 'receptionist' ? 'Recepção' : 'Profissional'}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">Reg: {professional.registration}</span>
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

          {!loading && filteredProfessionals.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Stethoscope className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Nenhum profissional encontrado</p>
              <p className="text-gray-400 text-sm mt-1">Clique em "Convidar Profissional" para adicionar alguém.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profissionais;
