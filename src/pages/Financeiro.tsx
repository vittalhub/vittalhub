import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
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

// Dados mockados para transações
const mockTransactions = [
  {
    id: "1",
    description: "Consulta Dr. Rafael - Retorno",
    type: "RECEITA",
    category: "Consultas",
    professional: "Dr. Rafael",
    date: "04/06/2025",
    paymentMethod: "PIX",
    value: 350.00,
    status: "Pago"
  },
  {
    id: "2",
    description: "Procedimento Estético - Botox",
    type: "RECEITA",
    category: "Procedimentos Estéticos",
    professional: "Dra. Ana",
    date: "03/06/2025",
    paymentMethod: "Cartão",
    value: 2200.00,
    status: "Pendente"
  },
  {
    id: "3",
    description: "Aluguel da clínica",
    type: "DESPESA",
    category: "Aluguel",
    professional: "-",
    date: "31/05/2025",
    paymentMethod: "PIX",
    value: 8000.00,
    status: "Pago"
  },
  {
    id: "4",
    description: "Compra de luvas e insumos",
    type: "DESPESA",
    category: "Insumos",
    professional: "-",
    date: "01/06/2025",
    paymentMethod: "Cartão",
    value: 1250.00,
    status: "Pago"
  },
  {
    id: "5",
    description: "Plano de saúde - Consulta",
    type: "RECEITA",
    category: "Planos de Saúde",
    professional: "Dr. Pedro",
    date: "02/06/2025",
    paymentMethod: "Transferência",
    value: 180.00,
    status: "Pendente"
  }
];

const Financeiro = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "12345") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta");
    }
  };

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.professional.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "Todos" || transaction.type === typeFilter;
    const matchesStatus = statusFilter === "Todos" || transaction.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

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
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-emerald-50/30 dashboard-theme">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Financeiro</h1>
              <p className="text-gray-600">Gestão financeira da clínica</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 shadow-md">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Cash Flow Chart */}
            <Card className="border-gray-100 shadow-lg">
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
            <Card className="border-gray-100 shadow-lg">
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

          {/* Transactions Section */}
          <Card className="border-gray-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Lançamentos financeiros</CardTitle>
              <p className="text-sm text-gray-600">Filtre por período, tipo, status e acompanhe todas as transações</p>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por descrição, categoria ou profissional..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Período
                </Button>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="RECEITA">Receitas</SelectItem>
                    <SelectItem value="DESPESA">Despesas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Descrição</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Categoria</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Profissional</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Data</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Forma</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Valor</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <Badge 
                              variant="outline" 
                              className={`mt-1 text-xs ${
                                transaction.type === "RECEITA" 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                  : "bg-red-50 text-red-700 border-red-200"
                              }`}
                            >
                              {transaction.type}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                            {transaction.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{transaction.professional}</td>
                        <td className="py-4 px-4 text-gray-700">{transaction.date}</td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
                            {transaction.paymentMethod}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={`font-semibold ${
                            transaction.type === "RECEITA" ? "text-emerald-600" : "text-red-600"
                          }`}>
                            R$ {transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            className={
                              transaction.status === "Pago"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhuma transação encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Financeiro;
