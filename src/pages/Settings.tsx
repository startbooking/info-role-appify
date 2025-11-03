import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Globe, Database } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const Settings = () => {
  const handleSave = () => {
    toast.success("Configuración guardada");
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Configuración
          </h1>
          <p className="text-muted-foreground mt-2">
            Personaliza la aplicación según tus preferencias
          </p>
        </div>

        <div className="space-y-4">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Moon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Tema</CardTitle>
                  <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="cursor-pointer">
                  Modo oscuro
                </Label>
                <Switch id="dark-mode" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Bell className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>Configura las alertas y notificaciones</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notif" className="cursor-pointer">
                  Notificaciones por email
                </Label>
                <Switch id="email-notif" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="waste-alerts" className="cursor-pointer">
                  Alertas de residuos altos
                </Label>
                <Switch id="waste-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="survey-notif" className="cursor-pointer">
                  Nuevas respuestas de encuestas
                </Label>
                <Switch id="survey-notif" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Idioma</CardTitle>
                  <CardDescription>Selecciona el idioma de la interfaz</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Idioma actual: <span className="font-medium text-foreground">Español</span>
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Database className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Base de Datos</CardTitle>
                  <CardDescription>Gestión de datos y almacenamiento</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Exportar todos los datos
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">Cancelar</Button>
            <Button onClick={handleSave}>Guardar cambios</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
