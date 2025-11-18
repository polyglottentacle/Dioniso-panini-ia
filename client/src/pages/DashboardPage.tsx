import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/stats']
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="title-dashboard">
            Dashboard Amministrativa
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestisci ordini, abbonamenti e monitora le statistiche
          </p>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Nota:</strong> Questa è una versione demo. In produzione, l'accesso alla dashboard richiederà autenticazione amministrativa.
            </p>
          </div>
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
