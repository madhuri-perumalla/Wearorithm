import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Eye, Bookmark, Brain, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { setAuthHeader } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import ConfidenceMeter from "./confidence-meter";
import ColorPalette from "./color-palette";
import { Outfit } from "@shared/schema";

interface OutfitCardProps {
  outfit: Outfit;
}

export default function OutfitCard({ outfit }: OutfitCardProps) {
  const [isFavorite, setIsFavorite] = useState(outfit.isFavorite || false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const favoriteMutation = useMutation({
    mutationFn: async (favorite: boolean) => {
      const response = await apiRequest("PUT", `/api/outfits/${outfit.id}/favorite`, { isFavorite: favorite });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/outfits'] });
    },
    onError: () => {
      setIsFavorite(!isFavorite); // Revert on error
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorite status",
      });
    },
  });

  const handleFavoriteToggle = () => {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    favoriteMutation.mutate(newFavorite);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`card-outfit-${outfit.id}`}>
      <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">👗</div>
          <p className="text-sm font-medium text-muted-foreground">{outfit.name}</p>
        </div>
        <div className="absolute top-4 left-4">
          <Badge variant="outline" className="capitalize">
            {outfit.occasion.replace('-', ' ')}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteToggle}
            className={`h-8 w-8 ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
            data-testid={`button-favorite-${outfit.id}`}
          >
            <Heart className={isFavorite ? 'fill-current' : ''} size={16} />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-card-foreground">{outfit.name}</h3>
          <ConfidenceMeter score={outfit.confidenceScore} size="sm" />
        </div>
        
        {outfit.aiAnalysis && (
          <p className="text-sm text-muted-foreground mb-4">
            {outfit.aiAnalysis.feedback}
          </p>
        )}
        
        {/* Color Palette */}
        <div className="mb-4">
          <ColorPalette colors={outfit.colors} />
        </div>

        {/* Mood & Impact */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="text-primary" size={16} />
            <span className="text-muted-foreground">
              Mood: <span className="text-primary font-medium capitalize">{outfit.mood}</span>
            </span>
          </div>
          {outfit.aiAnalysis && (
            <div className="flex items-center space-x-2">
              <Star className="text-yellow-500" size={16} />
              <span className="text-muted-foreground">
                Impact: <span className="font-medium">{outfit.aiAnalysis.impact}</span>
              </span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button 
            variant="default" 
            className="flex-1" 
            size="sm"
            data-testid={`button-tryon-${outfit.id}`}
          >
            <Eye size={16} className="mr-2" />
            Try On
          </Button>
          <Button 
            variant="secondary" 
            className="flex-1" 
            size="sm"
            data-testid={`button-save-${outfit.id}`}
          >
            <Bookmark size={16} className="mr-2" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
