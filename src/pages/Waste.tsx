import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";

interface WasteRecord {
  id: string;
  waste_type: string;
  quantity_kg: number;
  destination: string;
  record_date: string;
  profiles: {
    full_name: string;
  } | null;
}

const Waste = () => {
  const [records, setRecords] = useState<WasteRecord[]>([]);

  useEffect(() => {
    loadWasteRecords();
  }, []);

  const loadWasteRecords = async () => {
    const { data, error } = await supabase
      .from("waste_records")
      .select(`
        *,
        profiles:recorded_by (
          full_name
        )
      `)
      .order("record_date", { ascending: false })
      .limit(20);

    if (error) {
      toast.error("Error al cargar registros");
    } else {
      setRecords(data || []);
    }
  };

  const getWasteTypeColor = (type: string) => {
    switch (type) {
      case "vegetal":
        return "bg-primary/10 text-primary border-primary/20";
      case "carbon":
        return "bg-accent/10 text-accent border-accent/20";
      case "mixto":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDestinationColor = (destination: string) => {
    switch (destination) {
      case "compostaje":
        return "bg-primary/10 text-primary border-primary/20";
      case "donacion":
        return "bg-accent/10 text-accent border-accent/20";
      case "basura":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const totalWaste = records.reduce((sum, record) => sum + Number(record.quantity_kg), 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Gestión de Residuos
            </h1>
            <p className="text-muted-foreground mt-2">
              Registro y seguimiento de residuos orgánicos
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Registro
          </Button>
        </div>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle>Resumen Total</CardTitle>
            <CardDescription>Cantidad acumulada de residuos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-accent">{totalWaste.toFixed(1)} kg</div>
            <p className="text-sm text-muted-foreground mt-2">
              Basado en {records.length} registros
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle>Registros Recientes</CardTitle>
            <CardDescription>Últimos 20 registros de residuos</CardDescription>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Trash2 className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay registros disponibles</p>
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getWasteTypeColor(record.waste_type)}>
                          {record.waste_type}
                        </Badge>
                        <Badge className={getDestinationColor(record.destination)}>
                          {record.destination}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Registrado por: {record.profiles?.full_name || "Desconocido"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Fecha: {new Date(record.record_date).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">
                        {Number(record.quantity_kg).toFixed(1)}
                      </div>
                      <p className="text-xs text-muted-foreground">kg</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Waste;
