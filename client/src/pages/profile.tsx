import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Palette, Heart, Brain, Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setAuthHeader } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import ColorPalette from "@/components/color-palette";
import ConfidenceMeter from "@/components/confidence-meter";

const occasions = [
  "work-meeting", "casual-day", "date-night", "weekend-brunch", 
  "formal-event", "workout", "party", "travel"
];

const moods = [
  "confident", "playful", "elegant", "bold", "calm", "creative", "romantic", "edgy"
];

const profileSchema = z.object({
  stylePreferences: z.object({
    minimalist: z.number().min(0).max(100),
    boldColors: z.number().min(0).max(100),
    vintage: z.number().min(0).max(100),
    formal: z.number().min(0).max(100),
  }),
  colorPersonality: z.object({
    undertone: z.enum(["warm", "cool", "neutral"]),
    preferredColors: z.array(z.string()),
  }),
  bodyType: z.string().optional(),
  favoriteOccasions: z.array(z.string()),
  moodPreferences: z.array(z.string()),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
  const [newColor, setNewColor] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/profile'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/profile");
      return response.json();
    },
  });

  const { data: outfits } = useQuery({
    queryKey: ['/api/outfits'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/outfits");
      return response.json();
    },
  });

  const { data: feedback } = useQuery({
    queryKey: ['/api/feedback'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/feedback");
      return response.json();
    },
  });

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      stylePreferences: {
        minimalist: 50,
        boldColors: 50,
        vintage: 50,
        formal: 50,
      },
      colorPersonality: {
        undertone: "neutral",
        preferredColors: [],
      },
      bodyType: "",
      favoriteOccasions: [],
      moodPreferences: [],
    },
  });

  // Update form when profile data loads
  React.useEffect(() => {
    if (profile) {
      form.reset({
        stylePreferences: profile.stylePreferences || {
          minimalist: 50,
          boldColors: 50,
          vintage: 50,
          formal: 50,
        },
        colorPersonality: profile.colorPersonality || {
          undertone: "neutral",
          preferredColors: [],
        },
        bodyType: profile.bodyType || "",
        favoriteOccasions: profile.favoriteOccasions || [],
        moodPreferences: profile.moodPreferences || [],
      });
    }
  }, [profile, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      const response = await apiRequest("PUT", "/api/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      toast({
        title: "Profile updated!",
        description: "Your style preferences have been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: error.message || "Something went wrong",
      });
    },
  });

  const onSubmit = (data: ProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const addColor = () => {
    if (newColor && !form.getValues("colorPersonality.preferredColors").includes(newColor)) {
      const currentColors = form.getValues("colorPersonality.preferredColors");
      form.setValue("colorPersonality.preferredColors", [...currentColors, newColor]);
      setNewColor("");
    }
  };

  const removeColor = (colorToRemove: string) => {
    const currentColors = form.getValues("colorPersonality.preferredColors");
    form.setValue("colorPersonality.preferredColors", currentColors.filter(c => c !== colorToRemove));
  };

  const toggleOccasion = (occasion: string) => {
    const current = form.getValues("favoriteOccasions");
    if (current.includes(occasion)) {
      form.setValue("favoriteOccasions", current.filter(o => o !== occasion));
    } else {
      form.setValue("favoriteOccasions", [...current, occasion]);
    }
  };

  const toggleMood = (mood: string) => {
    const current = form.getValues("moodPreferences");
    if (current.includes(mood)) {
      form.setValue("moodPreferences", current.filter(m => m !== mood));
    } else {
      form.setValue("moodPreferences", [...current, mood]);
    }
  };

  const getConfidenceStats = () => {
    if (!outfits || outfits.length === 0) return { average: 0, trend: "neutral" };
    
    const scores = outfits.map((outfit: any) => outfit.confidenceScore);
    const average = Math.round(scores.reduce((acc: number, score: number) => acc + score, 0) / scores.length);
    
    // Simple trend calculation (compare first half vs second half)
    const midPoint = Math.floor(scores.length / 2);
    const firstHalf = scores.slice(0, midPoint);
    const secondHalf = scores.slice(midPoint);
    
    const firstAvg = firstHalf.reduce((acc: number, score: number) => acc + score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((acc: number, score: number) => acc + score, 0) / secondHalf.length;
    
    const trend = secondAvg > firstAvg + 5 ? "improving" : secondAvg < firstAvg - 5 ? "declining" : "stable";
    
    return { average, trend };
  };

  const confidenceStats = getConfidenceStats();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8" data-testid="profile-page">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="profile-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-foreground mb-2">
          Style Profile
        </h1>
        <p className="text-muted-foreground">
          Customize your preferences to get better outfit recommendations
        </p>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" size={20} />
              Profile Info
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-foreground">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <h3 className="font-semibold text-lg">{user?.firstName} {user?.lastName}</h3>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <Badge variant="outline" className="mt-2">@{user?.username}</Badge>
          </CardContent>
        </Card>

        {/* Confidence Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2" size={20} />
              Confidence Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <ConfidenceMeter score={confidenceStats.average} size="lg" />
            <p className="text-sm text-muted-foreground mt-4">Average Score</p>
            <div className="mt-4">
              <Badge 
                variant={confidenceStats.trend === "improving" ? "default" : "outline"}
                className="capitalize"
              >
                {confidenceStats.trend}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Style Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2" size={20} />
              Style Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Undertone:</span>
                <span className="ml-2 capitalize">{profile?.colorPersonality?.undertone || "Not set"}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Favorite Occasions:</span>
                <div className="mt-1">
                  {profile?.favoriteOccasions?.length > 0 ? (
                    profile.favoriteOccasions.slice(0, 2).map((occasion: string) => (
                      <Badge key={occasion} variant="secondary" className="mr-1 text-xs">
                        {occasion.replace('-', ' ')}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs">None selected</span>
                  )}
                </div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Total Outfits:</span>
                <span className="ml-2">{outfits?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2" size={20} />
            Style Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="style" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="style" data-testid="tab-style">Style</TabsTrigger>
                  <TabsTrigger value="colors" data-testid="tab-colors">Colors</TabsTrigger>
                  <TabsTrigger value="preferences" data-testid="tab-preferences">Preferences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="style" className="space-y-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Style Preferences</h3>
                    
                    {Object.entries(form.watch("stylePreferences")).map(([key, value]) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={`stylePreferences.${key}` as any}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel className="capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                              </FormLabel>
                              <span className="text-sm text-muted-foreground">{field.value}%</span>
                            </div>
                            <FormControl>
                              <Slider
                                min={0}
                                max={100}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="w-full"
                                data-testid={`slider-${key}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="colors" className="space-y-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Color Personality</h3>
                    
                    <FormField
                      control={form.control}
                      name="colorPersonality.undertone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skin Undertone</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-undertone">
                                <SelectValue placeholder="Select your undertone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="warm">Warm</SelectItem>
                              <SelectItem value="cool">Cool</SelectItem>
                              <SelectItem value="neutral">Neutral</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <FormLabel>Preferred Colors</FormLabel>
                      <div className="mt-2 space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter color (hex, name, or rgb)"
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                            data-testid="input-new-color"
                          />
                          <Button type="button" onClick={addColor} data-testid="button-add-color">
                            Add
                          </Button>
                        </div>
                        
                        {form.watch("colorPersonality.preferredColors").length > 0 && (
                          <div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {form.watch("colorPersonality.preferredColors").map((color, index) => (
                                <div key={index} className="flex items-center gap-1 bg-muted rounded-md p-1">
                                  <div 
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: color }}
                                  />
                                  <span className="text-xs px-1">{color}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4"
                                    onClick={() => removeColor(color)}
                                    data-testid={`button-remove-color-${index}`}
                                  >
                                    ×
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <ColorPalette colors={form.watch("colorPersonality.preferredColors")} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Favorite Occasions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {occasions.map((occasion) => (
                          <Button
                            key={occasion}
                            type="button"
                            variant={form.watch("favoriteOccasions").includes(occasion) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleOccasion(occasion)}
                            className="capitalize"
                            data-testid={`button-occasion-${occasion}`}
                          >
                            {occasion.replace('-', ' ')}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Mood Preferences</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {moods.map((mood) => (
                          <Button
                            key={mood}
                            type="button"
                            variant={form.watch("moodPreferences").includes(mood) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleMood(mood)}
                            className="capitalize"
                            data-testid={`button-mood-${mood}`}
                          >
                            {mood}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end pt-6 border-t">
                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-save-profile"
                >
                  <Save size={16} className="mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
