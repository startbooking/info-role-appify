import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, UtensilsCrossed } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Progress } from "@/components/ui/progress";

interface MenuItem {
  id: string;
  dish_name: string;
  category: string;
  acceptance_rate: number | null;
  waste_percentage: number | null;
  recommended_portions: number | null;
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("dish_name");

    if (error) {
      toast.error("Error al cargar menú");
    } else {
      setMenuItems(data || []);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Planificación de Menú
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestiona platos y optimiza porciones basado en datos
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Agregar Plato
          </Button>
        </div>

        {menuItems.length === 0 ? (
          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UtensilsCrossed className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay platos registrados</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Card key={item.id} className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{item.dish_name}</CardTitle>
                  <CardDescription className="capitalize">{item.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Tasa de Aceptación</span>
                      <span className="font-medium text-primary">
                        {item.acceptance_rate?.toFixed(0) || 0}%
                      </span>
                    </div>
                    <Progress value={item.acceptance_rate || 0} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Desperdicio</span>
                      <span className="font-medium text-accent">
                        {item.waste_percentage?.toFixed(0) || 0}%
                      </span>
                    </div>
                    <Progress 
                      value={item.waste_percentage || 0} 
                      className="h-2"
                    />
                  </div>

                  {item.recommended_portions && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">Porciones recomendadas</p>
                      <p className="text-2xl font-bold text-primary">
                        {item.recommended_portions}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Menu;
