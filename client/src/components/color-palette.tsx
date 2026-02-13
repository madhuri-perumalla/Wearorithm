interface ColorPaletteProps {
  colors: string[];
  size?: "sm" | "md" | "lg";
}

export default function ColorPalette({ colors, size = "md" }: ColorPaletteProps) {
  if (!colors || colors.length === 0) return null;

  const colorSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6";

  return (
    <div className="flex items-center space-x-2" data-testid="color-palette">
      <span className="text-xs text-muted-foreground">Colors:</span>
      <div className="flex space-x-1">
        {colors.slice(0, 6).map((color, index) => (
          <div
            key={index}
            className={`${colorSize} rounded-full border border-gray-300 flex-shrink-0`}
            style={{ backgroundColor: color }}
            title={color}
            data-testid={`color-${index}`}
          />
        ))}
        {colors.length > 6 && (
          <div className={`${colorSize} rounded-full bg-muted border border-gray-300 flex items-center justify-center flex-shrink-0`}>
            <span className="text-xs text-muted-foreground">+{colors.length - 6}</span>
          </div>
        )}
      </div>
    </div>
  );
}
