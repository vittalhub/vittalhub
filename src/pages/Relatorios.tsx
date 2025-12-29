import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  Download,
  Filter
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

// Dados mockados para os gráficos
// Dados mockados para os gráficos (ZERADOS para produção)
const appointmentsData = [
  { month: "Jul", agendamentos: 0, realizados: 0, cancelados: 0 },
  { month: "Ago", agendamentos: 0, realizados: 0, cancelados: 0 },
  { month: "Set", agendamentos: 0, realizados: 0, cancelados: 0 },
  { month: "Out", agendamentos: 0, realizados: 0, cancelados: 0 },
  { month: "Nov", agendamentos: 0, realizados: 0, cancelados: 0 },
  { month: "Dez", agendamentos: 0, realizados: 0, cancelados: 0 }
];

const revenueData = [
  { month: "Jul", receita: 0, despesas: 0 },
  { month: "Ago", receita: 0, despesas: 0 },
  { month: "Set", receita: 0, despesas: 0 },
  { month: "Out", receita: 0, despesas: 0 },
  { month: "Nov", receita: 0, despesas: 0 },
  { month: "Dez", receita: 0, despesas: 0 }
];

const servicesData = [
  { name: "Sem dados", value: 100, color: "#e5e7eb" }
];

const conversionData = [
  { origem: "Instagram", leads: 0, convertidos: 0, taxa: 0 },
  { origem: "Google", leads: 0, convertidos: 0, taxa: 0 },
  { origem: "Indicação", leads: 0, convertidos: 0, taxa: 0 },
  { origem: "WhatsApp", leads: 0, convertidos: 0, taxa: 0 },
  { origem: "Facebook", leads: 0, convertidos: 0, taxa: 0 }
];

const professionalPerformance = [
  // { name: "Dr. Rafael", atendimentos: 145, receita: 28500, satisfacao: 4.8 },
  // Deixando vazio para não mostrar dados fictícios
];

const peakHours = [
  { hora: "08:00", atendimentos: 0 },
  { hora: "09:00", atendimentos: 0 },
  { hora: "10:00", atendimentos: 0 },
  { hora: "11:00", atendimentos: 0 },
  { hora: "14:00", atendimentos: 0 },
  { hora: "15:00", atendimentos: 0 },
  { hora: "16:00", atendimentos: 0 },
  { hora: "17:00", atendimentos: 0 },
  { hora: "18:00", atendimentos: 0 }
];

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  icon: React.ElementType;
}

const MetricCard = ({ title, value, change, changeType, icon: Icon }: MetricCardProps) => {
  const isPositive = changeType === "positive";
  
  return (
    <Card className="border-gray-100 shadow-md hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-sm">
            <Icon className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Relatorios = () => {
  const [period, setPeriod] = useState("6months");

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-emerald-50/30 dashboard-theme">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Relatórios</h1>
              <p className="text-gray-600">Análises e métricas de desempenho da clínica</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                  <SelectItem value="6months">Últimos 6 meses</SelectItem>
                  <SelectItem value="year">Último ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total de Agendamentos"
              value="0"
              change="Sem dados"
              changeType="positive" // Manter neutro se possível, mas o componente pode exigir um tipo
              icon={Calendar}
            />
            <MetricCard
              title="Taxa de Comparecimento"
              value="0%"
              change="Sem dados"
              changeType="positive"
              icon={Activity}
            />
            <MetricCard
              title="Receita Total"
              value="R$ 0,00"
              change="Sem dados"
              changeType="positive"
              icon={DollarSign}
            />
            <MetricCard
              title="Novos Pacientes"
              value="0"
              change="Sem dados"
              changeType="positive"
              icon={Users}
            />
          </div>

          {/* Gráficos Principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Agendamentos por Período */}
            <Card className="border-gray-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Agendamentos por Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={appointmentsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="agendamentos" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Agendados" />
                    <Area type="monotone" dataKey="realizados" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Realizados" />
                    <Area type="monotone" dataKey="cancelados" stackId="3" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Cancelados" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Receita vs Despesas */}
            <Card className="border-gray-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  Receita vs Despesas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="receita" fill="#10b981" name="Receita" />
                    <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Segunda Linha de Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Serviços Mais Procurados */}
            <Card className="border-gray-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Serviços Mais Procurados</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={servicesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {servicesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Taxa de Conversão por Origem */}
            <Card className="lg:col-span-2 border-gray-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Taxa de Conversão por Origem</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={conversionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#666" />
                    <YAxis dataKey="origem" type="category" stroke="#666" width={100} />
                    <Tooltip />
                    <Bar dataKey="taxa" fill="#10b981" name="Taxa de Conversão (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Terceira Linha */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Desempenho por Profissional */}
            <Card className="border-gray-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Desempenho por Profissional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {professionalPerformance.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum profissional com dados registrados neste período.
                    </div>
                  ) : (
                    professionalPerformance.map((prof) => (
                      <div key={prof.name} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                        {/* ... existing card content ... */}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Horários de Pico */}
            <Card className="border-gray-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Horários de Pico</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={peakHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hora" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="atendimentos" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 5 }}
                      name="Atendimentos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Relatorios;
