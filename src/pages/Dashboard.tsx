import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, Activity } from "lucide-react";
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
  const [userName, setUserName] = useState("Usuário");
  const [clinicName, setClinicName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const sessionStr = localStorage.getItem("user_session");
      if (!sessionStr) {
        navigate("/auth");
        return;
      }

      try {
        const session = JSON.parse(sessionStr);
        setUserName(session.name || "Usuário");

        if (session.clinica_id) {
          const { data: clinica, error } = await supabase
            .from('clinicas')
            .select('nome_clinica')
            .eq('id', session.clinica_id)
            .single();
          
          if (!error && clinica) {
            setClinicName(clinica.nome_clinica);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-emerald-50/30 dashboard-theme">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
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
              value="0" // Placeholder data - Table doesnt exist yet
              change="Em breve"
              changeType="neutral"
              icon={Users}
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Consultas Hoje"
              value="0" // Placeholder data - Table doesnt exist yet
              icon={Calendar}
              iconColor="text-blue-600"
            />
            <MetricCard
              title="Taxa de Conversão"
              value="0%"
              change="Em breve"
              changeType="neutral"
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
