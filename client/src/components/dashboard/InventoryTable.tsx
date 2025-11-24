import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Package, AlertCircle, TrendingDown, Edit, Trash } from "lucide-react";
import InventoryHistory from "./InventoryHistory";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Ingredient {
  id: number;
  nameIt: string;
  nameEn: string;
  nameEs: string;
  unit: string;
  currentQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  costPerUnit: number;
  category: string | null;
  lastRestockedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface InventoryStats {
  totalIngredients: number;
  lowStockItems: number;
  totalValue: number;
  recentConsumption: any[];
}

export default function InventoryTable() {
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState(0);
  const [adjustReason, setAdjustReason] = useState("restock");
  const [adjustNotes, setAdjustNotes] = useState("");

  const [formData, setFormData] = useState({
    nameIt: "",
    nameEn: "",
    nameEs: "",
    unit: "kg",
    currentQuantity: 0,
    minQuantity: 0,
    maxQuantity: 100,
    costPerUnit: 0,
    category: "altro",
  });

  const { data: ingredients, isLoading } = useQuery<Ingredient[]>({
    queryKey: ['/api/admin/inventory'],
  });

  const { data: stats } = useQuery<InventoryStats>({
    queryKey: ['/api/admin/inventory/stats'],
  });

  const { data: lowStockItems } = useQuery<Ingredient[]>({
    queryKey: ['/api/admin/inventory/alerts/low-stock'],
  });

  const createIngredientMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create ingredient');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory/stats'] });
      setShowAddDialog(false);
      setFormData({
        nameIt: "",
        nameEn: "",
        nameEs: "",
        unit: "kg",
        currentQuantity: 0,
        minQuantity: 0,
        maxQuantity: 100,
        costPerUnit: 0,
        category: "altro",
      });
    },
  });

  const adjustQuantityMutation = useMutation({
    mutationFn: async ({ ingredientId, quantityChange, reason, notes }: any) => {
      const response = await fetch(`/api/admin/inventory/${ingredientId}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantityChange, reason, notes }),
      });
      if (!response.ok) throw new Error('Failed to adjust quantity');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory/alerts/low-stock'] });
      setShowAdjustDialog(false);
      setSelectedIngredient(null);
      setAdjustQuantity(0);
      setAdjustNotes("");
    },
  });

  const deleteIngredientMutation = useMutation({
    mutationFn: async (ingredientId: number) => {
      const response = await fetch(`/api/admin/inventory/${ingredientId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete ingredient');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory/stats'] });
    },
  });

  const handleSubmit = () => {
    createIngredientMutation.mutate(formData);
  };

  const handleAdjust = () => {
    if (selectedIngredient && adjustQuantity !== 0) {
      adjustQuantityMutation.mutate({
        ingredientId: selectedIngredient.id,
        quantityChange: adjustQuantity,
        reason: adjustReason,
        notes: adjustNotes,
      });
    }
  };

  const handleDelete = (ingredientId: number) => {
    if (confirm("Sei sicuro di voler eliminare questo ingrediente?")) {
      deleteIngredientMutation.mutate(ingredientId);
    }
  };

  const getStockStatus = (ingredient: Ingredient) => {
    if (ingredient.currentQuantity <= ingredient.minQuantity) {
      return { color: 'text-red-600 bg-red-50', label: 'Scarso' };
    }
    if (ingredient.currentQuantity <= ingredient.minQuantity * 2) {
      return { color: 'text-yellow-600 bg-yellow-50', label: 'Basso' };
    }
    return { color: 'text-green-600 bg-green-50', label: 'OK' };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Caricamento inventario...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-fisher-blue" />
              <div>
                <p className="text-sm text-gray-500">Ingredienti Totali</p>
                <p className="text-2xl font-bold">{stats?.totalIngredients || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-500">Scorte Basse</p>
                <p className="text-2xl font-bold text-red-600">{stats?.lowStockItems || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingDown className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Valore Totale</p>
                <p className="text-2xl font-bold">€{((stats?.totalValue || 0) / 100).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-center">
            <Button onClick={() => setShowAddDialog(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Ingrediente
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems && lowStockItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Allarme Scorte Basse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="font-medium">{item.nameIt}</span>
                  <span className="text-sm text-red-600">
                    {item.currentQuantity} {item.unit} (min: {item.minQuantity})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ingredients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gestione Ingredienti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">Categoria</th>
                  <th className="text-right p-3">Quantità</th>
                  <th className="text-right p-3">Min/Max</th>
                  <th className="text-center p-3">Stato</th>
                  <th className="text-right p-3">Costo/Unit</th>
                  <th className="text-center p-3">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {ingredients?.map((ingredient) => {
                  const status = getStockStatus(ingredient);
                  return (
                    <tr key={ingredient.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{ingredient.nameIt}</p>
                          <p className="text-sm text-gray-500">{ingredient.nameEn}</p>
                        </div>
                      </td>
                      <td className="p-3 capitalize">{ingredient.category || '-'}</td>
                      <td className="p-3 text-right font-medium">
                        {ingredient.currentQuantity} {ingredient.unit}
                      </td>
                      <td className="p-3 text-right text-sm text-gray-500">
                        {ingredient.minQuantity} / {ingredient.maxQuantity}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        €{(ingredient.costPerUnit / 100).toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedIngredient(ingredient);
                              setShowAdjustDialog(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(ingredient.id)}
                          >
                            <Trash className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Ingredient Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Aggiungi Nuovo Ingrediente</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli del nuovo ingrediente
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nameIt">Nome (Italiano)</Label>
              <Input
                id="nameIt"
                value={formData.nameIt}
                onChange={(e) => setFormData({ ...formData, nameIt: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="nameEn">Nome (English)</Label>
              <Input
                id="nameEn"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="nameEs">Nome (Español)</Label>
              <Input
                id="nameEs"
                value={formData.nameEs}
                onChange={(e) => setFormData({ ...formData, nameEs: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="unit">Unità</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="pz">Pezzi</SelectItem>
                  <SelectItem value="l">Litri</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carni">Carni</SelectItem>
                  <SelectItem value="verdure">Verdure</SelectItem>
                  <SelectItem value="pane">Pane</SelectItem>
                  <SelectItem value="condimenti">Condimenti</SelectItem>
                  <SelectItem value="bevande">Bevande</SelectItem>
                  <SelectItem value="altro">Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currentQuantity">Quantità Iniziale</Label>
              <Input
                id="currentQuantity"
                type="number"
                value={formData.currentQuantity}
                onChange={(e) => setFormData({ ...formData, currentQuantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="minQuantity">Quantità Minima</Label>
              <Input
                id="minQuantity"
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="maxQuantity">Quantità Massima</Label>
              <Input
                id="maxQuantity"
                type="number"
                value={formData.maxQuantity}
                onChange={(e) => setFormData({ ...formData, maxQuantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="costPerUnit">Costo per Unità (€)</Label>
              <Input
                id="costPerUnit"
                type="number"
                step="0.01"
                value={formData.costPerUnit / 100}
                onChange={(e) => setFormData({ ...formData, costPerUnit: Math.round(parseFloat(e.target.value) * 100) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Annulla
            </Button>
            <Button onClick={handleSubmit}>
              Aggiungi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Quantity Dialog */}
      <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Quantità</DialogTitle>
            <DialogDescription>
              {selectedIngredient?.nameIt} - Attuale: {selectedIngredient?.currentQuantity} {selectedIngredient?.unit}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="quantity">Quantità da Aggiungere/Rimuovere</Label>
              <Input
                id="quantity"
                type="number"
                value={adjustQuantity}
                onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 0)}
                placeholder="Es: +50 per aggiungere, -10 per rimuovere"
              />
              <p className="text-sm text-gray-500 mt-1">
                Nuova quantità: {(selectedIngredient?.currentQuantity || 0) + adjustQuantity} {selectedIngredient?.unit}
              </p>
            </div>
            <div>
              <Label htmlFor="reason">Motivo</Label>
              <Select value={adjustReason} onValueChange={setAdjustReason}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restock">Rifornimento</SelectItem>
                  <SelectItem value="adjustment">Aggiustamento</SelectItem>
                  <SelectItem value="waste">Spreco</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Note (opzionale)</Label>
              <Input
                id="notes"
                value={adjustNotes}
                onChange={(e) => setAdjustNotes(e.target.value)}
                placeholder="Aggiungi note..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustDialog(false)}>
              Annulla
            </Button>
            <Button onClick={handleAdjust}>
              Salva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inventory History */}
      <InventoryHistory />
    </div>
  );
}
