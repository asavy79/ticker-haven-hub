import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Key, 
  Copy, 
  Check, 
  AlertTriangle, 
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ApiKeyService } from "@/services/apiKeys";
import { ApiKeyDTO, CreateApiKeyResponse } from "@/types/apiKeys";

interface CreateApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeyCreated: (key: ApiKeyDTO) => void;
}

type ModalStep = "create" | "display";

const CreateApiKeyModal = ({
  open,
  onOpenChange,
  onKeyCreated,
}: CreateApiKeyModalProps) => {
  const [step, setStep] = useState<ModalStep>("create");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createdKey, setCreatedKey] = useState<CreateApiKeyResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(true);

  const resetModal = () => {
    setStep("create");
    setName("");
    setCreatedKey(null);
    setCopied(false);
    setShowKey(true);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      // If closing after key was created, notify parent
      if (createdKey) {
        onKeyCreated({
          id: createdKey.id,
          key_prefix: createdKey.key_prefix,
          name: createdKey.name,
          is_active: true,
          created_at: createdKey.created_at,
          last_used_at: null,
          expires_at: createdKey.expires_at,
        });
      }
      resetModal();
    }
    onOpenChange(open);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your API key.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await ApiKeyService.createApiKey({ name: name.trim() });
      setCreatedKey(response);
      setStep("display");
      toast({
        title: "API Key Created",
        description: "Your new API key has been created successfully.",
      });
    } catch (err: any) {
      console.error("Error creating API key:", err);
      toast({
        title: "Creation Failed",
        description: err.response?.data?.detail || "Failed to create API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!createdKey) return;

    try {
      await navigator.clipboard.writeText(createdKey.full_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      toast({
        title: "Copied!",
        description: "API key copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const maskKey = (key: string) => {
    // Show first 20 chars, mask the rest
    const visible = key.slice(0, 20);
    const masked = "•".repeat(key.length - 20);
    return visible + masked;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {step === "create" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Create New API Key
              </DialogTitle>
              <DialogDescription>
                Create an API key to connect trading bots or external applications 
                to your QuantX account.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g., My Trading Bot, Production Server"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Give your key a descriptive name to identify it later.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleClose(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isLoading || !name.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Key"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-green-600 dark:text-green-400">
                <Check className="h-5 w-5 mr-2" />
                API Key Created!
              </DialogTitle>
              <DialogDescription>
                Your new API key "{createdKey?.name}" has been created.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Warning Alert */}
              <Alert variant="destructive" className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800 dark:text-amber-200">
                  Save this key now!
                </AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-300">
                  This is the only time you'll see this key. Copy it and store it 
                  securely. If you lose it, you'll need to create a new one.
                </AlertDescription>
              </Alert>

              {/* API Key Display */}
              <div className="space-y-2">
                <Label>Your API Key</Label>
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        readOnly
                        value={showKey ? createdKey?.full_key : maskKey(createdKey?.full_key || "")}
                        className="font-mono text-sm pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => setShowKey(!showKey)}
                      >
                        {showKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      variant={copied ? "default" : "secondary"}
                      className={copied ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Usage Instructions */}
              <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                <p className="font-medium">How to use your API key:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Connect to <code className="text-xs bg-background px-1 py-0.5 rounded">ws://localhost:8000/ws/api/TICKER</code></li>
                  <li>Send auth message: <code className="text-xs bg-background px-1 py-0.5 rounded">{`{"type": "auth", "api_key": "your_key"}`}</code></li>
                  <li>Start trading without per-message authentication</li>
                </ol>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => handleClose(false)} className="w-full">
                {copied ? "Done" : "I've Saved My Key"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateApiKeyModal;

