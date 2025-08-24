import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, Coins } from "lucide-react";

const QRCode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [meetingDetails, setMeetingDetails] = useState<{
    title: string;
    date: string;
    reward: number;
  } | null>(null);

  useEffect(() => {
    // Simulate API call to validate QR code
    const validateQRCode = async () => {
      setTimeout(() => {
        // Mock validation logic - consider valid if id length > 5
        if (id && id.length > 5) {
          setStatus("success");
          setMeetingDetails({
            title: "Advanced Options Strategies Workshop",
            date: new Date().toLocaleDateString(),
            reward: 100
          });
        } else {
          setStatus("error");
        }
      }, 2000);
    };

    validateQRCode();
  }, [id]);

  const handleContinue = () => {
    navigate("/portfolio");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <h2 className="text-xl font-semibold">Validating QR Code</h2>
              <p className="text-muted-foreground">Please wait while we verify your attendance...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <XCircle className="h-6 w-6" />
              <span>Invalid QR Code</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                This QR code is invalid or has already been used.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Possible reasons:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside text-left space-y-1">
                  <li>QR code has expired</li>
                  <li>You have already scanned this code</li>
                  <li>This is not a valid meeting QR code</li>
                </ul>
              </div>
            </div>
            <div className="space-y-2">
              <Button onClick={handleContinue} className="w-full">
                Continue to Portfolio
              </Button>
              <Button variant="outline" onClick={() => navigate("/meetings")} className="w-full">
                View Meetings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-success">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-success">
            <CheckCircle className="h-6 w-6" />
            <span>Attendance Confirmed!</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <Coins className="h-10 w-10 text-success" />
            </div>
            
            {meetingDetails && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{meetingDetails.title}</h3>
                  <p className="text-sm text-muted-foreground">{meetingDetails.date}</p>
                </div>
                
                <Badge variant="outline" className="text-lg px-4 py-2 border-success text-success">
                  +{meetingDetails.reward} Credits Earned
                </Badge>
                
                <p className="text-muted-foreground text-sm">
                  Your attendance has been recorded and credits have been added to your account.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button onClick={handleContinue} className="w-full">
              View Portfolio
            </Button>
            <Button variant="outline" onClick={() => navigate("/meetings")} className="w-full">
              Back to Meetings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCode;