import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const Analytics = () => {
  const [wasteByType, setWasteByType] = useState<{ type: string; total: number }[]>([]);
  const [wasteByDestination, setWasteByDestination] = useState<{ dest: string; total: number }[]>([]);
  const [topDishes, setTopDishes] = useState<{ name: string; rate: number }[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    // Waste by type
    const { data: wasteData, error: wasteError } = await supabase
      .from("waste_records")
      .select("waste_type, quantity_kg");

    if (!wasteError && wasteData) {
      const byType = wasteData.reduce((acc: any, record) => {
        const type = record.waste_type;
        if (!acc[type]) acc[type] = 0;
        acc[type] += Number(record.quantity_kg);
        return acc;
      }, {});
      
      setWasteByType(
        Object.entries(byType).map(([type, total]) => ({ 
          type, 
          total: total as number 
        }))
      );
    }

    // Waste by destination
    const { data: destData } = await supabase
      .from("waste_records")
      .select("destination, quantity_kg");

    if (destData) {
      const byDest = destData.reduce((acc: any, record) => {
        const dest = record.destination;
        if (!acc[dest]) acc[dest] = 0;
        acc[dest] += Number(record.quantity_kg);
        return acc;
      }, {});
      
      setWasteByDestination(
        Object.entries(byDest).map(([dest, total]) => ({ 
          dest, 
          total: total as number 
        }))
      );
    }

    // Top dishes
    const { data: dishData } = await supabase
      .from("menu_items")
      .select("dish_name, acceptance_rate")
      .order("acceptance_rate", { ascending: false })
      .limit(5);

    if (dishData) {
      setTopDishes(
        dishData.map((d) => ({ 
          name: d.dish_name, 
          rate: Number(d.acceptance_rate) || 0 
        }))
      );
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Análisis y Estadísticas
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualización de datos y métricas clave
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Waste by Type */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-accent" />
                Residuos por Tipo
              </CardTitle>
              <CardDescription>Distribución de residuos según clasificación</CardDescription>
            </CardHeader>
            <CardContent>
              {wasteByType.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No hay datos disponibles
                </p>
              ) : (
                <div className="space-y-4">
                  {wasteByType.map((item) => (
                    <div key={item.type}>
                      <div className="flex justify-between mb-2">
                        <span className="capitalize font-medium">{item.type}</span>
                        <span className="text-accent font-bold">{item.total.toFixed(1)} kg</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                          style={{
                            width: `${(item.total / Math.max(...wasteByType.map(w => w.total))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Waste by Destination */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Destino de Residuos
              </CardTitle>
              <CardDescription>Distribución por destino final</CardDescription>
            </CardHeader>
            <CardContent>
              {wasteByDestination.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No hay datos disponibles
                </p>
              ) : (
                <div className="space-y-4">
                  {wasteByDestination.map((item) => (
                    <div key={item.dest}>
                      <div className="flex justify-between mb-2">
                        <span className="capitalize font-medium">{item.dest}</span>
                        <span className="text-primary font-bold">{item.total.toFixed(1)} kg</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                          style={{
                            width: `${(item.total / Math.max(...wasteByDestination.map(w => w.total))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Dishes */}
          <Card className="shadow-[var(--shadow-soft)] lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Platos Mejor Valorados
              </CardTitle>
              <CardDescription>Top 5 de platos con mayor aceptación</CardDescription>
            </CardHeader>
            <CardContent>
              {topDishes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No hay datos disponibles
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {topDishes.map((dish, index) => (
                    <div
                      key={dish.name}
                      className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
                    >
                      <div className="text-3xl font-bold text-primary mb-1">
                        #{index + 1}
                      </div>
                      <p className="font-medium text-sm mb-2 line-clamp-2">{dish.name}</p>
                      <div className="text-xl font-bold text-accent">
                        {dish.rate.toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
