import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, TrendingUp, PieChart } from "lucide-react";
import Layout from "@/components/Layout";

const Reports = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Reportes
          </h1>
          <p className="text-muted-foreground mt-2">
            Genera y descarga informes consolidados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Reporte de Residuos</CardTitle>
                  <CardDescription>Análisis mensual completo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Incluye tendencias, comparativas y proyecciones de reducción de residuos
              </p>
              <Button className="w-full gap-2">
                <Download className="w-4 h-4" />
                Descargar PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-accent/10">
                  <PieChart className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <CardTitle>Reporte de Encuestas</CardTitle>
                  <CardDescription>Análisis de satisfacción</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Resultados consolidados de encuestas y feedback de comensales
              </p>
              <Button className="w-full gap-2" variant="outline">
                <Download className="w-4 h-4" />
                Descargar Excel
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Reporte de Menú</CardTitle>
                  <CardDescription>Análisis de aceptación</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Estadísticas de platos, desperdicios y recomendaciones de optimización
              </p>
              <Button className="w-full gap-2" variant="secondary">
                <Download className="w-4 h-4" />
                Descargar PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-strong)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-accent/10">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <CardTitle>Reporte de Impacto</CardTitle>
                  <CardDescription>Ahorro y sostenibilidad</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Medición de impacto ambiental, reducción de CO2 y ahorro económico estimado
              </p>
              <Button className="w-full gap-2">
                <Download className="w-4 h-4" />
                Descargar PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
