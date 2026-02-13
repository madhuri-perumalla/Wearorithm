import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Camera, Sparkles, Palette, Heart, Brain, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { setAuthHeader } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import OutfitCard from "@/components/outfit-card";
import ConfidenceMeter from "@/components/confidence-meter";
import ColorPalette from "@/components/color-palette";
import ImageUpload from "@/components/image-upload";
import { Outfit, OutfitAnalysis, UserProfile } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const { data: outfits, isLoading } = useQuery<Outfit[]>({
    queryKey: ['/api/outfits'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/outfits");
      return response.json() as Promise<Outfit[]>;
    },
  });

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['/api/profile'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/profile");
      return response.json() as Promise<UserProfile>;
    },
  });

  const { data: analyses } = useQuery<OutfitAnalysis[]>({
    queryKey: ['/api/analyses'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/analyses");
      return response.json() as Promise<OutfitAnalysis[]>;
    },
  });

  const recentOutfits: Outfit[] = outfits?.slice(0, 2) ?? [];
  const recentAnalyses: OutfitAnalysis[] = analyses?.slice(0, 3) ?? [];

  return (
    <div className="container mx-auto px-4 py-8" data-testid="dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-foreground mb-2">
          Welcome back, <span className="text-primary">{user?.firstName}</span>!
        </h1>
        <p className="text-muted-foreground">Let's find your perfect style for today</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Camera className="text-primary" size={24} />
              </div>
              <Badge variant="secondary">AI Powered</Badge>
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Upload & Analyze</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get AI feedback on your outfit choices
            </p>
            <ImageUpload />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Sparkles className="text-accent" size={24} />
              </div>
              <Badge variant="outline">Personal</Badge>
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Style Recommendations</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Personalized outfit suggestions for you
            </p>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-get-recommendations" onClick={() => setLocation('/recommendations')}>
              Get Suggestions
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 via-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                <Palette className="text-white" size={24} />
              </div>
              <Badge variant="outline">Trending</Badge>
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Color Intelligence</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Discover complementary colors & trends
            </p>
            <Button variant="secondary" className="w-full" data-testid="button-explore-colors" onClick={() => setLocation('/profile')}>
              Explore Colors
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Recommendations */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-serif text-foreground">Today's Recommendations</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Occasion:</span>
            <Select defaultValue="work-meeting">
              <SelectTrigger className="w-[180px]" data-testid="select-occasion">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work-meeting">Work Meeting</SelectItem>
                <SelectItem value="casual-day">Casual Day</SelectItem>
                <SelectItem value="date-night">Date Night</SelectItem>
                <SelectItem value="weekend-brunch">Weekend Brunch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
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
        ) : recentOutfits.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentOutfits.map((outfit) => (
              <OutfitCard key={outfit.id} outfit={outfit} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate your first outfit recommendations to get started
            </p>
            <Button data-testid="button-generate-first-recommendations" onClick={() => setLocation('/recommendations')}>Generate Recommendations</Button>
          </Card>
        )}
      </section>

      {/* Personal Style Profile */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold font-serif text-foreground mb-6">Your Style Profile</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Style Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="text-accent mr-2" size={20} />
                Style Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.stylePreferences ? (
                <div className="space-y-3">
                  {Object.entries(profile.stylePreferences).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <div className="w-24 h-2 bg-muted rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No preferences set</p>
              )}
            </CardContent>
          </Card>

          {/* Color Personality */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="text-accent mr-2" size={20} />
                Color Personality
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.colorPersonality ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium text-card-foreground capitalize">
                      {profile.colorPersonality.undertone} Undertones
                    </p>
                  </div>
                  {profile.colorPersonality.preferredColors?.length > 0 && (
                    <ColorPalette colors={profile.colorPersonality.preferredColors} />
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No color profile set</p>
              )}
            </CardContent>
          </Card>

          {/* Confidence Meter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="text-accent mr-2" size={20} />
                Confidence Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ConfidenceMeter 
                score={recentOutfits.length > 0 ? 
                  Math.round(recentOutfits.reduce((acc, outfit) => acc + outfit.confidenceScore, 0) / recentOutfits.length) : 
                  0
                } 
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-2xl font-bold font-serif text-foreground mb-6">Recent Activity</h2>
        <Card>
          {recentAnalyses.length > 0 ? (
            recentAnalyses.map((analysis, index) => (
              <div key={analysis.id} className={`p-4 ${index < recentAnalyses.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={analysis.imageUrl} 
                      alt="Analyzed outfit" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-card-foreground">Analyzed outfit</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Received {analysis.analysis.suitability}% suitability score
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={analysis.analysis.suitability > 80 ? "default" : "secondary"}>
                      {analysis.analysis.suitability > 80 ? "High Match" : "Good Match"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <CardContent className="p-8 text-center">
              <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
              <p className="text-muted-foreground">
                Upload your first outfit photo to start building your style profile
              </p>
            </CardContent>
          )}
        </Card>
      </section>
    </div>
  );
}
