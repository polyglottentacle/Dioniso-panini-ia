import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Package } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface InventoryHistoryItem {
  id: number;
  ingredientId: number;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  orderId: number | null;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  ingredient: {
    id: number;
    nameIt: string;
    unit: string;
  };
}

export default function InventoryHistory() {
  const { data: history, isLoading } = useQuery<InventoryHistoryItem[]>({
    queryKey: ['/api/admin/inventory/history'],
  });

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'order':
        return 'bg-blue-100 text-blue-800';
      case 'restock':
        return 'bg-green-100 text-green-800';
      case 'adjustment':
        return 'bg-yellow-100 text-yellow-800';
      case 'waste':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'order':
        return 'Ordine';
      case 'restock':
        return 'Rifornimento';
      case 'adjustment':
        return 'Aggiustamento';
      case 'waste':
        return 'Spreco';
      default:
        return reason;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Caricamento storico...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Storico Movimenti Inventario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${item.quantityChange > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {item.quantityChange > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{item.ingredient?.nameIt || 'Ingrediente sconosciuto'}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getReasonColor(item.reason)}`}>
                      {getReasonLabel(item.reason)}
                    </span>
                    {item.orderId && (
                      <span className="text-xs">Ordine #{item.orderId}</span>
                    )}
                    {item.notes && (
                      <span className="text-xs italic">"{item.notes}"</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${item.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.quantityChange > 0 ? '+' : ''}{item.quantityChange} {item.ingredient?.unit}
                </p>
                <p className="text-xs text-gray-500">
                  {item.previousQuantity} → {item.newQuantity} {item.ingredient?.unit}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(item.createdAt), 'dd MMM yyyy HH:mm', { locale: it })}
                </p>
              </div>
            </div>
          ))}
          {(!history || history.length === 0) && (
            <p className="text-center text-gray-500 py-8">
              Nessun movimento registrato
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
