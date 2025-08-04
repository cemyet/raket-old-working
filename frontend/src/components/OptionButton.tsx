import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OptionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "outline" | "success";
  className?: string;
  disabled?: boolean;
}

export function OptionButton({ 
  children, 
  onClick, 
  variant = "outline", 
  className,
  disabled = false 
}: OptionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={variant === "success" ? "default" : variant}
      className={cn(
        "w-full justify-start text-left py-3 px-4 h-auto font-normal text-sm border-border hover:bg-muted/50 transition-colors",
        variant === "success" && "bg-primary hover:bg-primary/90 text-primary-foreground border-primary",
        className
      )}
    >
      <span>{children}</span>
    </Button>
  );
}