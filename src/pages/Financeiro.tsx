import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Dados mockados para os gráficos
const cashFlowData = [
  { month: "Jan", receita: 42000, despesas: 12000 },
  { month: "Fev", receita: 38000, despesas: 11500 },
  { month: "Mar", receita: 45000, despesas: 13000 },
  { month: "Abr", receita: 48000, despesas: 12800 },
  { month: "Mai", receita: 52000, despesas: 14200 },
  { month: "Jun", receita: 45280, despesas: 12450 }
];

const revenueByCategory = [
  { name: "Consultas", value: 18500, color: "#3b82f6" },
  { name: "Procedimentos", value: 15200, color: "#10b981" },
  { name: "Produtos", value: 8300, color: "#8b5cf6" },
  { name: "Outros", value: 3280, color: "#f59e0b" }
];

const Financeiro = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "12345") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex bg-gray-50 dashboard-theme">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Acesso ao Financeiro</CardTitle>
              <p className="text-sm text-gray-600 text-center mt-2">
                Digite a senha para acessar o módulo financeiro
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Digite a senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={error ? "border-red-500" : ""}
                  />
                  {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                  <p className="text-xs text-gray-500 mt-2">Senha demo: 12345</p>
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Entrar no financeiro
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dashboard-theme">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
              <p className="text-gray-600 mt-1">Gestão financeira da clínica</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Plus className="h-4 w-4" />
              Nova transação
            </Button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Receita Total"
              value="R$ 45.280"
              change="+15% vs mês anterior"
              changeType="positive"
              icon={DollarSign}
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Despesas Operacionais"
              value="R$ 12.450"
              change="-8% vs mês anterior"
              changeType="positive"
              icon={TrendingDown}
              iconColor="text-red-600"
            />
            <MetricCard
              title="Contas a Receber"
              value="R$ 8.920"
              icon={Wallet}
              iconColor="text-blue-600"
            />
            <MetricCard
              title="Lucro Líquido"
              value="R$ 32.830"
              change="+22% vs mês anterior"
              changeType="positive"
              icon={TrendingUp}
              iconColor="text-purple-600"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cash Flow Chart */}
            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Fluxo de Caixa (6 meses)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cashFlowData}>
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

            {/* Revenue by Category Chart */}
            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Receita por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={(entry) => `${entry.name}: R$ ${entry.value.toLocaleString()}`}
                    >
                      {revenueByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Financeiro;
