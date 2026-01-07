import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useDemoMode } from "@/hooks/useDemoMode";
import {
  LayoutDashboard,
  MessageCircle,
  Users,
  Calendar,
  UserCircle,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Target,
  Stethoscope, // Added Stethoscope
  DollarSign, // Added DollarSign
  Briefcase, // Added Briefcase for Especialidades
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "CRM", href: "/crm" },
  { icon: Calendar, label: "Agenda", href: "/agenda" },
  { icon: Stethoscope, label: "Profissionais", href: "/profissionais" },
  { icon: Briefcase, label: "Especialidades", href: "/especialidades" },
  { icon: DollarSign, label: "Financeiro", href: "/financeiro" },
  { icon: BarChart3, label: "Relatórios", href: "/dashboard/relatorios" },
  { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isDemo, disableDemoMode } = useDemoMode();

  const getFilteredMenuItems = () => {
    // Em modo demo, mostrar todos os itens
    if (isDemo) return menuItems;

    try {
      const sessionStr = localStorage.getItem("user_session");
      if (!sessionStr) return menuItems; // Fallback or empty

      const session = JSON.parse(sessionStr);
      // Admin sees everything
      if (session.role === 'admin') return menuItems;

      const perms = session.permissions || {};

      return menuItems.filter(item => {
        // Map Item Label to Permission Key
        // If no permission key mapped, maybe allow by default? Or hide? 
        // Let's hide restricted areas by default.
        
        switch (item.label) {
          case "Dashboard": return perms.dashboard;
          case "CRM": return perms.crm;
          case "Agenda": return perms.agenda;
          case "Profissionais": return perms.profissionais;
          case "Especialidades": return perms.configuracoes; // Grouped
          case "Financeiro": return perms.financeiro;
          case "Relatórios": return perms.dashboard; // Grouped
          case "Configurações": return perms.configuracoes;
          default: return true; // Public/Common items
        }
      });
    } catch (e) {
      return menuItems;
    }
  };

  const filteredItems = getFilteredMenuItems();

  const handleLogout = async () => {
    // Se estiver em modo demo, apenas desabilitar demo
    if (isDemo) {
      disableDemoMode();
      return;
    }

    // Clear local storage manually as well just in case
    localStorage.removeItem("user_session");
    navigate("/"); // Redirect first
      
    // Then sign out from supabase (if valid session exists)
    await supabase.auth.signOut();
    toast({
        title: "Até logo!",
        description: "Você saiu da sua conta.",
    });
  };

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">VITTALHUB</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Demo Mode Banner */}
      {isDemo && !collapsed && (
        <div className="m-4 p-4 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white shadow-lg border border-white/20 animate-fade-in relative overflow-hidden group">
          <div className="absolute top-0 right-0 -m-2 opacity-20 group-hover:scale-125 transition-transform duration-500">
            <Sparkles className="h-12 w-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-3 w-3" />
              <p className="font-bold text-xs uppercase tracking-wider">Modo Demo Ativo</p>
            </div>
            <p className="text-[10px] text-white/90 leading-tight">Explorando com dados reais simulados</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          )}
        >
          {isDemo ? <X className="h-5 w-5 shrink-0" /> : <LogOut className="h-5 w-5 shrink-0" />}
          {!collapsed && <span>{isDemo ? "Sair da Demo" : "Sair"}</span>}
        </button>
      </div>
    </aside>
  );
};
