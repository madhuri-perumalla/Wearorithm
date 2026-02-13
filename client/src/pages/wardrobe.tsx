import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Shirt, Package, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { setAuthHeader } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ColorPalette from "@/components/color-palette";

const categories = [
  { value: "top", label: "Tops", icon: "👕" },
  { value: "bottom", label: "Bottoms", icon: "👖" },
  { value: "shoes", label: "Shoes", icon: "👟" },
  { value: "accessory", label: "Accessories", icon: "👜" },
];

const wardrobeItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  colors: z.string().min(1, "At least one color is required"),
  brand: z.string().optional(),
  size: z.string().optional(),
  tags: z.string().optional(),
});

type WardrobeItemForm = z.infer<typeof wardrobeItemSchema>;

export default function Wardrobe() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wardrobeItems, isLoading } = useQuery({
    queryKey: ['/api/wardrobe'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/wardrobe");
      return response.json();
    },
  });

  const form = useForm<WardrobeItemForm>({
    resolver: zodResolver(wardrobeItemSchema),
    defaultValues: {
      name: "",
      category: "",
      colors: "",
      brand: "",
      size: "",
      tags: "",
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (data: WardrobeItemForm) => {
      const itemData = {
        ...data,
        colors: data.colors.split(',').map(c => c.trim()).filter(Boolean),
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      const response = await apiRequest("POST", "/api/wardrobe", itemData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wardrobe'] });
      setIsAddDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast({
        title: "Item added successfully!",
        description: "Your wardrobe item has been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to add item",
        description: error.message || "Something went wrong",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest("DELETE", `/api/wardrobe/${itemId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wardrobe'] });
      toast({
        title: "Item deleted",
        description: "The item has been removed from your wardrobe.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to delete item",
        description: error.message || "Something went wrong",
      });
    },
  });

  const onSubmit = (data: WardrobeItemForm) => {
    addItemMutation.mutate(data);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      category: item.category,
      colors: item.colors.join(', '),
      brand: item.brand || "",
      size: item.size || "",
      tags: item.tags?.join(', ') || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (itemId: string) => {
    deleteItemMutation.mutate(itemId);
  };

  const filteredItems = wardrobeItems?.filter((item: any) => 
    selectedCategory === "all" || item.category === selectedCategory
  ) || [];

  const getCategoryStats = () => {
    if (!wardrobeItems) return {};
    return wardrobeItems.reduce((acc: any, item: any) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="container mx-auto px-4 py-8" data-testid="wardrobe-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground mb-2">
            My Wardrobe
          </h1>
          <p className="text-muted-foreground">
            Manage your clothing collection and build outfit combinations
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-item">
              <Plus size={16} className="mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Item" : "Add New Item"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Blue cotton t-shirt" {...field} data-testid="input-item-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.icon} {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colors (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="#3b82f6, #1e40af, blue" {...field} data-testid="input-colors" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="Nike" {...field} data-testid="input-brand" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input placeholder="M" {...field} data-testid="input-size" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="casual, summer, comfortable" {...field} data-testid="input-tags" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={addItemMutation.isPending}
                    className="flex-1"
                    data-testid="button-save-item"
                  >
                    {addItemMutation.isPending ? "Saving..." : (editingItem ? "Update" : "Add Item")}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setEditingItem(null);
                      form.reset();
                    }}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card 
          className={`cursor-pointer transition-colors ${selectedCategory === "all" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setSelectedCategory("all")}
          data-testid="filter-all"
        >
          <CardContent className="p-4 text-center">
            <Package className="mx-auto mb-2 text-primary" size={24} />
            <div className="text-2xl font-bold">{wardrobeItems?.length || 0}</div>
            <div className="text-sm text-muted-foreground">All Items</div>
          </CardContent>
        </Card>
        
        {categories.map((category) => (
          <Card 
            key={category.value}
            className={`cursor-pointer transition-colors ${selectedCategory === category.value ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedCategory(category.value)}
            data-testid={`filter-${category.value}`}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-2xl font-bold">{categoryStats[category.value] || 0}</div>
              <div className="text-sm text-muted-foreground">{category.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-32 bg-muted rounded-t-xl"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-muted rounded flex-1"></div>
                  <div className="h-8 bg-muted rounded w-8"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item: any) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow" data-testid={`item-card-${item.id}`}>
              <div className="relative h-32 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center rounded-t-xl">
                <div className="text-center">
                  <div className="text-3xl mb-2">
                    {categories.find(c => c.value === item.category)?.icon || "👕"}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {categories.find(c => c.value === item.category)?.label}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-card-foreground truncate flex-1">
                    {item.name}
                  </h3>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(item)}
                      data-testid={`button-edit-${item.id}`}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                      data-testid={`button-delete-${item.id}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                
                {item.brand && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.brand} {item.size && `• Size ${item.size}`}
                  </p>
                )}
                
                <ColorPalette colors={item.colors} size="sm" />
                
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.tags.slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                
                {item.purchased && (
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Calendar size={12} className="mr-1" />
                    {new Date(item.purchased).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Shirt className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h3 className="text-xl font-semibold mb-4">
            {selectedCategory === "all" ? "Your wardrobe is empty" : `No ${categories.find(c => c.value === selectedCategory)?.label.toLowerCase()} found`}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {selectedCategory === "all" 
              ? "Start building your digital wardrobe by adding your clothing items. This will help us provide better outfit recommendations."
              : `Add some ${categories.find(c => c.value === selectedCategory)?.label.toLowerCase()} to your wardrobe to see them here.`
            }
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-first-item">
            <Plus size={16} className="mr-2" />
            Add Your First Item
          </Button>
        </Card>
      )}
    </div>
  );
}
