import { Link } from "wouter";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16" data-testid="footer">
      <div className="container mx-auto px-4">
        <div className="py-8 text-center">
          {/* Brand */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="text-primary-foreground" size={16} />
            </div>
            <span className="text-xl font-bold font-serif text-primary">Wearorithm</span>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/recommendations" className="text-muted-foreground hover:text-primary transition-colors">Style</Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/wardrobe" className="text-muted-foreground hover:text-primary transition-colors">Wardrobe</Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors">Profile</Link>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Wearorithm. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
