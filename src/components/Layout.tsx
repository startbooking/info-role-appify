import { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  ClipboardList, 
  TrendingUp, 
  UtensilsCrossed,
  Trash2,
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { signOut, getCurrentUser, type UserRole } from "@/lib/auth";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [userName, setUserName] = useState("");
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const user = await getCurrentUser();
    if (user) {
      setUserName(user.profile.full_name);
      setUserRoles(user.roles);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Error al cerrar sesión");
    } else {
      toast.success("Sesión cerrada");
      navigate("/auth");
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", roles: ["administrador", "cocina", "encuestador", "comensal"] },
    { icon: ClipboardList, label: "Encuestas", path: "/surveys", roles: ["administrador", "encuestador", "comensal"] },
    { icon: TrendingUp, label: "Análisis", path: "/analytics", roles: ["administrador", "cocina"] },
    { icon: UtensilsCrossed, label: "Menú", path: "/menu", roles: ["administrador", "cocina"] },
    { icon: Trash2, label: "Residuos", path: "/waste", roles: ["administrador", "cocina"] },
    { icon: FileText, label: "Reportes", path: "/reports", roles: ["administrador"] },
    { icon: Settings, label: "Configuración", path: "/settings", roles: ["administrador"] },
  ];

  const accessibleMenuItems = menuItems.filter((item) =>
    item.roles.some((role) => userRoles.includes(role as UserRole))
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <span className="font-bold text-primary">EcoGestión</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-40 w-64 bg-card border-r border-border
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 shadow-[var(--shadow-soft)]
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-12 h-12" />
              <div>
                <h1 className="font-bold text-lg text-primary">EcoGestión</h1>
                <p className="text-xs text-muted-foreground">Alimentaria</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {accessibleMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${active 
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" 
                      : "hover:bg-secondary text-foreground"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userRoles[0] || "Usuario"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start gap-2"
              size="sm"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-0 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
