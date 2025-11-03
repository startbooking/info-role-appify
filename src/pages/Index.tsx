import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, TrendingDown, BarChart3, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-12 h-12" />
            <div>
              <h1 className="font-bold text-xl text-primary">EcoGestión</h1>
              <p className="text-xs text-muted-foreground">Alimentaria</p>
            </div>
          </div>
          <Button onClick={() => navigate("/auth")}>
            Iniciar Sesión
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Gestión Inteligente de Residuos Alimentarios
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Optimiza tu cocina, reduce desperdicios y contribuye a un futuro más sostenible
            con nuestra plataforma integral de gestión alimentaria.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              Comenzar Ahora
            </Button>
            <Button size="lg" variant="outline">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
            <CardHeader>
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-2">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Sostenibilidad</CardTitle>
              <CardDescription>
                Reduce tu huella ambiental monitoreando y optimizando el uso de recursos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
            <CardHeader>
              <div className="p-3 rounded-lg bg-accent/10 w-fit mb-2">
                <TrendingDown className="w-8 h-8 text-accent" />
              </div>
              <CardTitle>Reducción de Desperdicios</CardTitle>
              <CardDescription>
                Identifica patrones y minimiza el desperdicio de alimentos hasta en un 40%
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
            <CardHeader>
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-2">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Análisis en Tiempo Real</CardTitle>
              <CardDescription>
                Dashboard con métricas actualizadas y reportes detallados de tu operación
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
            <CardHeader>
              <div className="p-3 rounded-lg bg-accent/10 w-fit mb-2">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <CardTitle>Gestión por Roles</CardTitle>
              <CardDescription>
                Control de acceso para administradores, cocina, encuestadores y comensales
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto text-center shadow-[var(--shadow-strong)] bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader className="space-y-4 pb-8">
            <CardTitle className="text-3xl md:text-4xl">
              ¿Listo para transformar tu gestión alimentaria?
            </CardTitle>
            <CardDescription className="text-lg">
              Únete a organizaciones que están haciendo la diferencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              Crear Cuenta Gratis
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 EcoGestión Alimentaria. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
