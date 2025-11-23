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
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/stats']
  });

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
