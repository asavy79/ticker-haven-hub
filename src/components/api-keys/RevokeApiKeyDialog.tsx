import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ApiKeyService } from "@/services/apiKeys";
import { ApiKeyDTO } from "@/types/apiKeys";

interface RevokeApiKeyDialogProps {
  apiKey: ApiKeyDTO | null;
  onOpenChange: (open: boolean) => void;
  onKeyRevoked: (keyId: number) => void;
}

const RevokeApiKeyDialog = ({
  apiKey,
  onOpenChange,
  onKeyRevoked,
}: RevokeApiKeyDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRevoke = async () => {
    if (!apiKey) return;

    setIsLoading(true);

    try {
      await ApiKeyService.revokeApiKey(apiKey.id);
      toast({
        title: "API Key Revoked",
        description: `"${apiKey.name}" has been revoked and can no longer be used.`,
      });
      onKeyRevoked(apiKey.id);
    } catch (err: any) {
      console.error("Error revoking API key:", err);
      toast({
        title: "Revoke Failed",
        description: err.response?.data?.detail || "Failed to revoke API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={!!apiKey} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-destructive">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Revoke API Key
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to revoke the API key "{apiKey?.name}"?
            </p>
            <p className="font-medium text-destructive">
              This action cannot be undone. Any applications using this key will 
              immediately lose access.
            </p>
            <div className="rounded-md bg-muted p-3 font-mono text-xs">
              {apiKey?.key_prefix}...
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRevoke}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Revoking...
              </>
            ) : (
              "Revoke Key"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RevokeApiKeyDialog;

