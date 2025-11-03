import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createExampleUsers, checkIfUsersExist, exampleUsers } from "@/lib/seedData";
import logo from "@/assets/logo.png";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const FirstTimeSetup = () => {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [usersExist, setUsersExist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkUsers();
  }, []);

  const checkUsers = async () => {
    setChecking(true);
    const exists = await checkIfUsersExist();
    setUsersExist(exists);
    setChecking(false);
    
    if (exists) {
      // Si ya hay usuarios, redirigir al login
      setTimeout(() => navigate("/auth"), 2000);
    }
  };

  const handleCreateUsers = async () => {
    setLoading(true);
    
    try {
      const results = await createExampleUsers();
      const successCount = results.filter(r => r.success).length;
      
      if (successCount > 0) {
        toast.success(`¡${successCount} usuarios creados exitosamente!`);
        setTimeout(() => navigate("/auth"), 2000);
      } else {
        toast.error("No se pudieron crear los usuarios. Algunos pueden ya existir.");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al crear usuarios de ejemplo");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando configuración...</p>
        </div>
      </div>
    );
  }

  if (usersExist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <Card className="w-full max-w-md shadow-[var(--shadow-strong)]">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={logo} alt="EcoGestión Alimentaria" className="w-32 h-32" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Sistema Configurado</CardTitle>
            </div>
            <CardDescription>
              Ya existen usuarios en el sistema. Redirigiendo al login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary">
      <Card className="w-full max-w-2xl shadow-[var(--shadow-strong)]">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src={logo} alt="EcoGestión Alimentaria" className="w-32 h-32" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Configuración Inicial
          </CardTitle>
          <CardDescription className="text-base">
            Bienvenido a EcoGestión Alimentaria. Para comenzar, necesitas crear los usuarios de ejemplo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
            <h3 className="font-semibold text-primary mb-3 text-lg">👥 Usuarios que se crearán:</h3>
            <div className="space-y-3">
              {exampleUsers.map((user) => (
                <div key={user.email} className="flex items-center justify-between p-3 rounded-md bg-background/50">
                  <div>
                    <p className="font-medium text-foreground">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Nota:</strong> Todos los usuarios tendrán una contraseña temporal que puedes encontrar en el archivo USUARIOS_EJEMPLO.md
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCreateUsers}
              disabled={loading}
              className="flex-1"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creando usuarios...
                </>
              ) : (
                "Crear Usuarios de Ejemplo"
              )}
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              variant="outline"
              size="lg"
            >
              Ir al Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstTimeSetup;
