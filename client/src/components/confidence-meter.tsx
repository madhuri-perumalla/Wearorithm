interface ConfidenceMeterProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function ConfidenceMeter({ score, size = "md" }: ConfidenceMeterProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const barWidth = size === "sm" ? "w-20" : size === "lg" ? "w-32" : "w-24";
  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  return (
    <div className="flex items-center space-x-2" data-testid="confidence-meter">
      <div className={`confidence-bar ${barWidth} h-2 rounded-full overflow-hidden`}>
        <div 
          className={`h-full rounded-full transition-all duration-300 ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <span className={`font-medium ${getScoreColor(score)} ${textSize}`} data-testid="confidence-score">
        {score}%
      </span>
    </div>
  );
}
