import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Key,
  Plus,
  Trash2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Clock,
  Shield,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ApiKeyService } from "@/services/apiKeys";
import { ApiKeyDTO } from "@/types/apiKeys";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";
import CreateApiKeyModal from "@/components/api-keys/CreateApiKeyModal";
import RevokeApiKeyDialog from "@/components/api-keys/RevokeApiKeyDialog";

const ApiKeys = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeyDTO[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKeyDTO | null>(null);
  const [copiedPrefix, setCopiedPrefix] = useState<string | null>(null);

  const { user, isLoading: authLoading } = useFirebaseAuth();

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const keys = await ApiKeyService.listApiKeys();
      setApiKeys(keys);
    } catch (err: any) {
      console.error("Error fetching API keys:", err);
      setError(err.response?.data?.detail || "Failed to load API keys. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      fetchApiKeys();
    }
  }, [user, authLoading]);

  const handleKeyCreated = (newKey: ApiKeyDTO) => {
    setApiKeys((prev) => [newKey, ...prev]);
  };

  const handleKeyRevoked = (revokedKeyId: number) => {
    setApiKeys((prev) =>
      prev.map((key) =>
        key.id === revokedKeyId ? { ...key, is_active: false } : key
      )
    );
    setKeyToRevoke(null);
  };

  const copyToClipboard = async (text: string, prefix: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrefix(prefix);
      setTimeout(() => setCopiedPrefix(null), 2000);
      toast({
        title: "Copied!",
        description: "Key prefix copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLastUsed = (dateString: string | null) => {
    if (!dateString) return "Never used";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    
    return formatDate(dateString);
  };

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-9 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">API Keys</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="link"
              className="p-0 h-auto ml-2"
              onClick={fetchApiKeys}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const activeKeys = apiKeys.filter((key) => key.is_active);
  const revokedKeys = apiKeys.filter((key) => !key.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">API Keys</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchApiKeys}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Key
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">About API Keys</p>
              <p className="mt-1 text-blue-700 dark:text-blue-300">
                API keys allow programmatic access to the QuantX trading platform. 
                Use them to connect trading bots, scripts, or external applications. 
                Keep your keys secure and never share them publicly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Your API Keys
          </CardTitle>
          <CardDescription>
            Manage your API keys for programmatic trading access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Key className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No API Keys Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Create an API key to connect trading bots, scripts, or external 
                applications to your QuantX account. Your first key is just a click away.
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First API Key
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Keys */}
              {activeKeys.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Active Keys ({activeKeys.length})
                  </h3>
                  {activeKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Key className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{apiKey.name}</span>
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              Active
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-3 mt-1 text-sm text-muted-foreground">
                            <button
                              onClick={() => copyToClipboard(apiKey.key_prefix, apiKey.key_prefix)}
                              className="font-mono flex items-center space-x-1 hover:text-foreground transition-colors"
                            >
                              <span>{apiKey.key_prefix}...</span>
                              {copiedPrefix === apiKey.key_prefix ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                            <span>•</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatLastUsed(apiKey.last_used_at)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Created {formatDate(apiKey.created_at)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setKeyToRevoke(apiKey)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Revoke
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Revoked Keys */}
              {revokedKeys.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Revoked Keys ({revokedKeys.length})
                  </h3>
                  {revokedKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center justify-between p-4 border rounded-lg opacity-60"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Key className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{apiKey.name}</span>
                            <Badge variant="secondary">Revoked</Badge>
                          </div>
                          <div className="flex items-center space-x-3 mt-1 text-sm text-muted-foreground">
                            <span className="font-mono">{apiKey.key_prefix}...</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Created {formatDate(apiKey.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create API Key Modal */}
      <CreateApiKeyModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onKeyCreated={handleKeyCreated}
      />

      {/* Revoke Confirmation Dialog */}
      <RevokeApiKeyDialog
        apiKey={keyToRevoke}
        onOpenChange={(open) => !open && setKeyToRevoke(null)}
        onKeyRevoked={handleKeyRevoked}
      />
    </div>
  );
};

export default ApiKeys;

