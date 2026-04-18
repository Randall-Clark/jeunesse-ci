import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function LoadingState({ message = "Chargement en cours..." }: { message?: string }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="font-medium animate-pulse">{message}</p>
    </div>
  );
}

export function ErrorState({ 
  title = "Une erreur est survenue", 
  message = "Nous n'avons pas pu charger ces données.", 
  onRetry 
}: { 
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-[40vh] flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md bg-destructive/10 border-destructive/20">
        <AlertTitle className="font-display text-lg">{title}</AlertTitle>
        <AlertDescription className="mt-2">
          {message}
          {onRetry && (
            <Button 
              variant="outline" 
              className="mt-4 w-full bg-background hover:bg-background/90" 
              onClick={onRetry}
            >
              Réessayer
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: any;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[40vh] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-2xl bg-muted/30"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-primary" />
        </div>
      )}
      <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </motion.div>
  );
}
