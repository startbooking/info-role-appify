import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, type UserRole } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, TrendingDown, Users, ClipboardCheck } from "lucide-react";
import Layout from "@/components/Layout";

const Dashboard = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [stats, setStats] = useState({
    totalSurveys: 0,
    totalWaste: 0,
    menuItems: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    loadUserAndStats();
  }, []);

  const loadUserAndStats = async () => {
    const user = await getCurrentUser();
    if (user) {
      setUserRoles(user.roles);
    }

    // Load stats
    const [surveys, waste, menu, profiles] = await Promise.all([
      supabase.from("surveys").select("id", { count: "exact", head: true }),
      supabase.from("waste_records").select("quantity_kg"),
      supabase.from("menu_items").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
    ]);

    const totalWaste = waste.data?.reduce((sum, record) => sum + Number(record.quantity_kg), 0) || 0;

    setStats({
      totalSurveys: surveys.count || 0,
      totalWaste: Math.round(totalWaste * 10) / 10,
      menuItems: menu.count || 0,
      activeUsers: profiles.count || 0,
    });
  };

  const isAdmin = userRoles.includes("administrador");

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Bienvenido al sistema de gestión de residuos alimentarios
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Encuestas Activas</CardTitle>
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalSurveys}</div>
              <p className="text-xs text-muted-foreground mt-1">Total de encuestas</p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Residuos Registrados</CardTitle>
              <TrendingDown className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.totalWaste} kg</div>
              <p className="text-xs text-muted-foreground mt-1">Peso total</p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Platos en Menú</CardTitle>
              <Leaf className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.menuItems}</div>
              <p className="text-xs text-muted-foreground mt-1">Items disponibles</p>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                <Users className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">Total registrados</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Welcome Card */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle>¡Bienvenido a EcoGestión Alimentaria!</CardTitle>
            <CardDescription>
              Sistema integral para la gestión sostenible de residuos alimentarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">
              Esta plataforma te ayuda a monitorear, analizar y reducir el desperdicio de alimentos
              mediante encuestas, análisis de datos y seguimiento de residuos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h3 className="font-semibold text-primary mb-2">📊 Análisis en Tiempo Real</h3>
                <p className="text-sm text-muted-foreground">
                  Visualiza datos y métricas actualizadas sobre el consumo y desperdicio
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <h3 className="font-semibold text-accent mb-2">🌱 Impacto Sostenible</h3>
                <p className="text-sm text-muted-foreground">
                  Contribuye a reducir el impacto ambiental y optimizar recursos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
