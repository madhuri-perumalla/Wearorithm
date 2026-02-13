import { Link } from "wouter";
import { Sparkles } from "lucide-react";
import { Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16" data-testid="footer">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="text-primary-foreground" size={16} />
              </div>
              <span className="text-xl font-bold font-serif text-primary">Wearorithm</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your personal AI fashion mentor that evolves with your unique style.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-card-foreground mb-3">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors" data-testid="link-ai-analysis">AI Analysis</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors" data-testid="link-recommendations">Style Recommendations</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors" data-testid="link-color-intelligence">Color Intelligence</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors" data-testid="link-virtual-tryon">Virtual Try-On</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-card-foreground mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/profile" className="hover:text-primary transition-colors" data-testid="link-my-profile">My Profile</Link></li>
              <li><Link href="/wardrobe" className="hover:text-primary transition-colors" data-testid="link-wardrobe">Wardrobe</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors" data-testid="link-preferences">Preferences</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors" data-testid="link-settings">Settings</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-card-foreground mb-3">Connect</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-instagram">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                <Twitter size={20} />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 Wearorithm. Powered by AI fashion intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
