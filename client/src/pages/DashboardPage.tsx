import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import OrdersTable from "../components/dashboard/OrdersTable";
import SubscriptionsTable from "../components/dashboard/SubscriptionsTable";
import StatsCards from "../components/dashboard/StatsCards";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeSubscriptions: number;
}

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/stats'],
    enabled: isAuthenticated
  });

  const handleAdminAuth = () => {
    // Password semplice per demo (in produzione usare autenticazione sicura)
    if (adminPassword === "dioniso2025") {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Password non corretta");
      setAdminPassword("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fisher-blue to-fisher-blue-dark flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-fisher-blue mb-2 text-center">Dioniso Caffè</h1>
          <p className="text-gray-600 text-center mb-6">Admin Dashboard</p>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Inserisci password admin"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminAuth()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-fisher-blue focus:border-fisher-blue"
              data-testid="input-admin-password"
            />
            {passwordError && (
              <p className="text-red-600 text-sm font-medium">{passwordError}</p>
            )}
            <button
              onClick={handleAdminAuth}
              className="w-full bg-fisher-blue hover:bg-fisher-blue-dark text-white font-bold py-2 px-4 rounded-lg transition"
              data-testid="button-admin-login"
            >
              Accedi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <button 
            onClick={() => setLocation('/')}
            className="flex items-center space-x-2 text-fisher-blue hover:text-fisher-blue-dark mb-4 transition"
            data-testid="button-back-to-home"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Torna alla Home</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="title-dashboard">
            Dashboard Amministrativa
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestisci ordini, abbonamenti e monitora le statistiche
          </p>
        </div>

        <StatsCards stats={stats} loading={statsLoading} />

        <Tabs defaultValue="orders" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="orders" data-testid="tab-orders">Ordini</TabsTrigger>
            <TabsTrigger value="subscriptions" data-testid="tab-subscriptions">Abbonamenti</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <OrdersTable />
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-6">
            <SubscriptionsTable />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
