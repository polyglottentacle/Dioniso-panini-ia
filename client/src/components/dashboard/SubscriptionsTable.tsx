import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface Subscription {
  id: number;
  userId: number;
  menuPreference: string;
  preferredDays: string[];
  preferredTime: string;
  isActive: boolean;
  createdAt: string;
}

export default function SubscriptionsTable() {
  const { data: subscriptions, isLoading } = useQuery<Subscription[]>({
    queryKey: ['/api/admin/subscriptions']
  });

  const getMenuLabel = (preference: string) => {
    const labels: Record<string, string> = {
      standard: "Standard",
      vegetarian: "Vegetariano",
      halal: "Halal"
    };
    return labels[preference] || preference;
  };

  const getDaysLabel = (days: string[]) => {
    const labels: Record<string, string> = {
      mon: "Lun",
      tue: "Mar",
      wed: "Mer",
      thu: "Gio",
      fri: "Ven"
    };
    return days.map(d => labels[d] || d).join(", ");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Abbonamenti Attivi</CardTitle>
          <CardDescription>Gestisci gli abbonamenti settimanali</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Abbonamenti Attivi</CardTitle>
        <CardDescription>
          {subscriptions?.length || 0} abbonamenti attivi
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!subscriptions || subscriptions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground" data-testid="text-no-subscriptions">
            Nessun abbonamento presente
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Menu</TableHead>
                  <TableHead>Giorni</TableHead>
                  <TableHead>Orario</TableHead>
                  <TableHead>Data Inizio</TableHead>
                  <TableHead>Stato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id} data-testid={`row-subscription-${sub.id}`}>
                    <TableCell className="font-medium">#{sub.id}</TableCell>
                    <TableCell>User #{sub.userId}</TableCell>
                    <TableCell>{getMenuLabel(sub.menuPreference)}</TableCell>
                    <TableCell>{getDaysLabel(sub.preferredDays as string[])}</TableCell>
                    <TableCell>{sub.preferredTime}</TableCell>
                    <TableCell>
                      {format(new Date(sub.createdAt), 'dd MMM yyyy', { locale: it })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sub.isActive ? "default" : "secondary"}>
                        {sub.isActive ? "Attivo" : "Inattivo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
