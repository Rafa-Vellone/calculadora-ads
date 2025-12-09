interface ResultCardProps {
  label: string;
  value: string;
  delay?: number;
}

const ResultCard = ({ label, value, delay = 0 }: ResultCardProps) => {
  return (
    <div 
      className="result-card animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
};

export default ResultCard;
