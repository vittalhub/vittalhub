import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useDemoMode } from "@/hooks/useDemoMode";
import { demoMetricas, demoUsuario, demoClinica, demoConsultas } from "@/data/demoData";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, Activity, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Dados mockados para o gráfico de crescimento
const appointmentGrowthData = [
  { month: "Jul", agendamentos: 45 },
  { month: "Ago", agendamentos: 52 },
  { month: "Set", agendamentos: 61 },
  { month: "Out", agendamentos: 73 },
  { month: "Nov", agendamentos: 89 },
  { month: "Dez", agendamentos: 108 }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDemo } = useDemoMode();
  const [userName, setUserName] = useState("Usuário");
  const [clinicName, setClinicName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      // Se estiver em modo demo, pular autenticação
      if (isDemo) {
        setUserName(demoUsuario.nome);
        setClinicName(demoClinica.nome);
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      try {
        setLoading(true);
        // Fetch User Profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, clinica_id')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
            console.error("Error fetching profile:", profileError);
        }

        if (profile) {
            setUserName(profile.full_name || "Usuário");
            
            if (profile.clinica_id) {
                const { data: clinica, error: clinicaError } = await supabase
                  .from('clinicas')
                  .select('nome_clinica')
                  .eq('id', profile.clinica_id)
                  .single();
                
                if (!clinicaError && clinica) {
                  setClinicName(clinica.nome_clinica);
                }
            }
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate, isDemo]);

  // Usar métricas demo se estiver em modo demo
  const metricas = isDemo ? demoMetricas : {
    totalPacientes: 0,
    consultasHoje: 0,
    taxaConversao: 0,
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-emerald-50/30 dashboard-theme">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Demo Mode Banner */}
          {isDemo && (
            <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Modo Demonstração</p>
                  <p className="text-sm text-white/90">Você está navegando com dados fictícios. Explore todas as funcionalidades!</p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <div className="flex flex-col">
              <p className="text-xl text-emerald-700 font-semibold">
                Bem-vindo de volta, {userName}!
              </p>
              {clinicName && (
                <p className="text-sm text-gray-500 mt-1">
                  Gerenciando: <span className="font-medium text-gray-700">{clinicName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Total de Pacientes"
              value={metricas.totalPacientes.toString()}
              change={isDemo ? "+23 este mês" : "Em breve"}
              changeType={isDemo ? "positive" : "neutral"}
              icon={Users}
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Consultas Hoje"
              value={metricas.consultasHoje.toString()}
              change={isDemo ? "4 confirmadas" : undefined}
              icon={Calendar}
              iconColor="text-blue-600"
            />
            <MetricCard
              title="Taxa de Conversão"
              value={`${metricas.taxaConversao}%`}
              change={isDemo ? "+12% vs mês anterior" : "Em breve"}
              changeType={isDemo ? "positive" : "neutral"}
              icon={TrendingUp}
              iconColor="text-purple-600"
            />
          </div>

          {/* Growth Chart */}
          <div className="mb-8">
            <Card className="border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  Crescimento de Agendamentos
                </CardTitle>
                <p className="text-sm text-gray-600">Dados de exemplo (Módulo em desenvolvimento)</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={appointmentGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="agendamentos" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agenda do Dia - Takes 2 columns */}
            <div className="lg:col-span-2">
              <TodaySchedule />
            </div>

            {/* Ações Rápidas - Takes 1 column */}
            <div>
              <QuickActions />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
