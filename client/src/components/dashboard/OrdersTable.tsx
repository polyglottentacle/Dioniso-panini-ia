import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface Order {
  id: number;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  status: string;
  total: number;
  deliveryFloor: string;
  deliveryTime: string;
  notes: string | null;
  createdAt: string;
}

export default function OrdersTable() {
  const { toast } = useToast();
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders']
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await apiRequest('PATCH', `/api/admin/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] })
      ]);
      await queryClient.refetchQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Stato aggiornato",
        description: "Lo stato dell'ordine è stato modificato con successo"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      processing: "secondary",
      completed: "default",
      cancelled: "destructive"
    };

    const labels: Record<string, string> = {
      pending: "In attesa",
      processing: "In preparazione",
      completed: "Completato",
      cancelled: "Annullato"
    };

    return <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>;
  };

  const formatCurrency = (cents: number) => {
    return `€${(cents / 100).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ordini Recenti</CardTitle>
          <CardDescription>Gestisci tutti gli ordini del sistema</CardDescription>
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
        <CardTitle>Ordini Recenti</CardTitle>
        <CardDescription>
          {orders?.length || 0} ordini totali nel sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!orders || orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground" data-testid="text-no-orders">
            Nessun ordine presente
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Consegna</TableHead>
                  <TableHead>Totale</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{order.customerEmail || order.customerPhone || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), 'dd MMM yyyy HH:mm', { locale: it })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{order.deliveryTime}</div>
                        <div className="text-xs text-muted-foreground">Piano {order.deliveryFloor}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(status) => updateStatusMutation.mutate({ orderId: order.id, status })}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-[140px]" data-testid={`select-status-${order.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">In attesa</SelectItem>
                          <SelectItem value="processing">In preparazione</SelectItem>
                          <SelectItem value="completed">Completato</SelectItem>
                          <SelectItem value="cancelled">Annullato</SelectItem>
                        </SelectContent>
                      </Select>
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
