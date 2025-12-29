import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, User, Mail, Lock, Phone, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CadastroClinica = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.telefone || !formData.senha) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    setLoading(true);
    
    try {
      console.log("1. Criando Clínica...");
      
      // 1. Criar Clínica primeiro
      const { data: clinica, error: clinicaError } = await supabase
        .from('clinicas')
        .insert({
          nome_clinica: `Clínica de ${formData.nome}`,
          email_clinica: formData.email,
          telefone: formData.telefone
        })
        .select()
        .single();

      if (clinicaError) {
        console.error("Erro ao criar clínica:", clinicaError);
        throw new Error("Erro ao criar clínica: " + clinicaError.message);
      }

      console.log("Clínica criada:", clinica.id);

      // 2. Criar Profile do Admin (sem Auth, direto na tabela)
      console.log("2. Criando Profile do Admin...");
      
      // Gerar um UUID manualmente (simples, mas funcional)
      const userId = crypto.randomUUID();
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          clinica_id: clinica.id,
          email: formData.email,
          full_name: formData.nome,
          telefone: formData.telefone,
          // @ts-expect-error - coluna senha existe mas não está no tipo
          senha: formData.senha,
          role: 'admin',
          status: 'active'
        });

      if (profileError) {
        console.error("Erro ao criar profile:", profileError);
        throw new Error("Erro ao criar usuário: " + profileError.message);
      }

      console.log("Profile criado com sucesso!");

      // Gerar token seguro (usando o ID da clínica como token)
      const token = clinica.id;

      // Sucesso!
      toast.success("Conta criada com sucesso!", {
        description: "Agora configure sua clínica."
      });

      // Redirecionar para configuração da clínica COM TOKEN na URL
      setTimeout(() => {
        navigate(`/configurar-clinica?token=${token}`);
      }, 1500);

    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro ao criar conta', {
        description: error.message || 'Tente novamente mais tarde'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "");
    
    // Limita a 11 dígitos
    const limited = numbers.substring(0, 11);
    
    // Aplica a máscara
    if (limited.length <= 2) return limited;
    if (limited.length <= 7) return `(${limited.substring(0, 2)}) ${limited.substring(2)}`;
    return `(${limited.substring(0, 2)}) ${limited.substring(2, 7)}-${limited.substring(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">CLINIC.AI</h1>
          </div>
          <p className="text-gray-600">Gerencie sua clínica de forma profissional</p>
        </div>

        <Card className="shadow-xl border-gray-100 bg-white">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-bold text-gray-900">Criar nova conta</CardTitle>
            <CardDescription>Cadastre-se para gerenciar sua clínica</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCadastro} className="space-y-4">
              
              <div className="space-y-1">
                <Label htmlFor="nome" className="text-gray-700 font-medium">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    placeholder="Seu nome completo"
                    className="pl-10 h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    className="pl-10 h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-emerald-50/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="telefone" className="text-gray-700 font-medium">Telefone (WhatsApp)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    className="pl-10 h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    maxLength={15}
                  />
                </div>
                <p className="text-xs text-gray-500">Informe um número de WhatsApp válido para contato</p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="senha" className="text-gray-700 font-medium">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    value={formData.senha}
                    onChange={(e) => handleChange('senha', e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-emerald-50/30"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmarSenha" className="text-gray-700 font-medium">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmarSenha"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmarSenha}
                    onChange={(e) => handleChange('confirmarSenha', e.target.value)}
                    placeholder="Digite a senha novamente"
                    className="pl-10 pr-10 h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 mt-2"
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Cadastrar'}
              </Button>

            </form>

            {/* Link para Login */}
            <div className="text-center mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <button
                  onClick={() => navigate('/auth')}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Fazer login
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroClinica;
