import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, BarChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";
import Layout from "@/components/Layout";

interface Survey {
  id: string;
  name: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
}

const Surveys = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    loadUserAndSurveys();
  }, []);

  const loadUserAndSurveys = async () => {
    const user = await getCurrentUser();
    if (user) {
      const isEncuestador = user.roles.includes("encuestador");
      const isAdmin = user.roles.includes("administrador");
      setCanCreate(isEncuestador || isAdmin);
    }

    const { data, error } = await supabase
      .from("surveys")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error al cargar encuestas");
    } else {
      setSurveys(data || []);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Encuestas
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestiona y visualiza las encuestas de satisfacción
            </p>
          </div>
          {canCreate && (
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nueva Encuesta
            </Button>
          )}
        </div>

        {surveys.length === 0 ? (
          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BarChart className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No hay encuestas disponibles todavía
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {surveys.map((survey) => (
              <Card key={survey.id} className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{survey.name}</CardTitle>
                    <Badge variant={survey.is_published ? "default" : "secondary"}>
                      {survey.is_published ? "Publicada" : "Borrador"}
                    </Badge>
                  </div>
                  <CardDescription>
                    {survey.description || "Sin descripción"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Surveys;
