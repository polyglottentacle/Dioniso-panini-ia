import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageCheck, TrendingUp, Clock, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  stats?: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    activeSubscriptions: number;
  };
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (cents: number) => {
    return `€${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card data-testid="card-total-orders">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ordini Totali</CardTitle>
          <PackageCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-total-orders">
            {stats?.totalOrders || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Tutti gli ordini ricevuti
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-revenue">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fatturato</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-revenue">
            {formatCurrency(stats?.totalRevenue || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Entrate totali
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-pending">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ordini Pendenti</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-pending">
            {stats?.pendingOrders || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Da processare
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-subscriptions">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Abbonamenti Attivi</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-subscriptions">
            {stats?.activeSubscriptions || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Clienti abbonati
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
