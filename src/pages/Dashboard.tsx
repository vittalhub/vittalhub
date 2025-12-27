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
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-emerald-50/30 dashboard-theme">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-gray-600">Bem-vindo de volta ao VITTALHUB</p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Total de Pacientes"
              value="248"
              change="+12% vs mês anterior"
              changeType="positive"
              icon={Users}
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Consultas Hoje"
              value="8"
              icon={Calendar}
              iconColor="text-blue-600"
            />
            <MetricCard
              title="Taxa de Conversão"
              value="78%"
              change="+5% vs mês anterior"
              changeType="positive"
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
                <p className="text-sm text-gray-600">Últimos 6 meses</p>
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
