import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw } from "lucide-react";
import { setAuthHeader } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import OutfitCard from "@/components/outfit-card";

const occasions = [
  { value: "work-meeting", label: "Work Meeting" },
  { value: "casual-day", label: "Casual Day" },
  { value: "date-night", label: "Date Night" },
  { value: "weekend-brunch", label: "Weekend Brunch" },
  { value: "formal-event", label: "Formal Event" },
  { value: "workout", label: "Workout" },
];

const moods = [
  { value: "confident", label: "Confident" },
  { value: "playful", label: "Playful" },
  { value: "elegant", label: "Elegant" },
  { value: "bold", label: "Bold" },
  { value: "calm", label: "Calm" },
  { value: "creative", label: "Creative" },
];

export default function Recommendations() {
  const [selectedOccasion, setSelectedOccasion] = useState("work-meeting");
  const [selectedMood, setSelectedMood] = useState("confident");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: outfits, isLoading } = useQuery({
    queryKey: ['/api/outfits'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/outfits");
      return response.json();
    },
  });

  const generateMutation = useMutation({
    mutationFn: async ({ occasion, mood }: { occasion: string; mood: string }) => {
      const response = await apiRequest("POST", "/api/recommendations", { 
        occasion, 
        mood, 
        count: 4 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/outfits'] });
      toast({
        title: "New recommendations generated!",
        description: "Your personalized outfit suggestions are ready.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error.message || "Failed to generate recommendations",
      });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({ 
      occasion: selectedOccasion, 
      mood: selectedMood 
    });
  };

  const filteredOutfits = outfits?.filter((outfit: any) => 
    outfit.occasion === selectedOccasion || outfit.mood === selectedMood
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8" data-testid="recommendations-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-foreground mb-2">
          Style Recommendations
        </h1>
        <p className="text-muted-foreground">
          Discover AI-powered outfit suggestions tailored to your style and preferences
        </p>
      </div>

      {/* Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2" size={20} />
            Generate New Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Occasion
              </label>
              <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
                <SelectTrigger data-testid="select-occasion">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {occasions.map((occasion) => (
                    <SelectItem key={occasion.value} value={occasion.value}>
                      {occasion.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Mood
              </label>
              <Select value={selectedMood} onValueChange={setSelectedMood}>
                <SelectTrigger data-testid="select-mood">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((mood) => (
                    <SelectItem key={mood.value} value={mood.value}>
                      {mood.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="px-6"
              data-testid="button-generate-recommendations"
            >
              {generateMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Selection */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-muted-foreground">Showing recommendations for:</span>
        <Badge variant="outline" className="capitalize">
          {occasions.find(o => o.value === selectedOccasion)?.label}
        </Badge>
        <Badge variant="outline" className="capitalize">
          {moods.find(m => m.value === selectedMood)?.label}
        </Badge>
      </div>

      {/* Recommendations Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-xl"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-muted rounded flex-1"></div>
                  <div className="h-8 bg-muted rounded flex-1"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredOutfits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutfits.map((outfit: any) => (
            <OutfitCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      ) : outfits && outfits.length > 0 ? (
        <div>
          <div className="text-center mb-8">
            <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No recommendations for this combination
            </h3>
            <p className="text-muted-foreground mb-4">
              Generate new recommendations for {occasions.find(o => o.value === selectedOccasion)?.label.toLowerCase()} with a {selectedMood} mood
            </p>
            <Button onClick={handleGenerate} data-testid="button-generate-for-selection">
              Generate Recommendations
            </Button>
          </div>
          
          <div className="border-t border-border pt-8">
            <h3 className="text-xl font-semibold mb-4">All Your Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outfits.map((outfit: any) => (
                <OutfitCard key={outfit.id} outfit={outfit} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Sparkles className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h3 className="text-xl font-semibold mb-4">Get Your First Recommendations</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start your style journey with AI-powered outfit suggestions tailored to your preferences and the occasion.
          </p>
          <Button onClick={handleGenerate} size="lg" data-testid="button-first-recommendations">
            <Sparkles className="mr-2 h-5 w-5" />
            Generate My First Recommendations
          </Button>
        </Card>
      )}
    </div>
  );
}
