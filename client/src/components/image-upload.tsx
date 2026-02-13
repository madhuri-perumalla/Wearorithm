import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { setAuthHeader } from "@/lib/auth";

export default function ImageUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: setAuthHeader(),
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis complete!",
        description: `Suitability score: ${data.analysis.suitability}%`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/analyses'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to analyze image",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image under 5MB",
      });
      return;
    }

    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full" data-testid="image-upload">
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'}
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        data-testid="upload-area"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          data-testid="file-input"
        />
        
        <div className="flex flex-col items-center space-y-2">
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          
          <div>
            <p className="text-sm font-medium text-foreground">
              {isUploading ? "Analyzing..." : "Drop your photo here"}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse
            </p>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full mt-4" 
        onClick={handleClick}
        disabled={isUploading}
        data-testid="button-upload"
      >
        <Camera size={16} className="mr-2" />
        {isUploading ? "Analyzing..." : "Choose Photo"}
      </Button>
    </div>
  );
}
