import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  date: string;
  description: string;
  summary: string;
  attended: boolean;
  reward: number;
}

const Meetings = () => {
  const upcomingMeeting = {
    title: "Advanced Options Strategies Workshop",
    date: "2024-01-15",
    time: "7:00 PM",
    location: "Business School Room 201",
    description: "Deep dive into complex options strategies including iron condors, butterflies, and calendar spreads. Guest speaker from Goldman Sachs trading desk."
  };

  const pastMeetings: Meeting[] = [
    {
      id: "1",
      title: "Introduction to Futures Trading",
      date: "2024-01-08",
      description: "Basic concepts of futures contracts, margin requirements, and risk management fundamentals.",
      summary: "Covered futures basics, discussed margin calls, practiced with paper trading platform. 45 members attended.",
      attended: true,
      reward: 100
    },
    {
      id: "2", 
      title: "Market Microstructure Analysis",
      date: "2024-01-01",
      description: "Understanding order flow, bid-ask spreads, and market making principles.",
      summary: "Analyzed real market data, discussed HFT impact, reviewed order book dynamics. Interactive Q&A session.",
      attended: true,
      reward: 100
    },
    {
      id: "3",
      title: "Risk Management in Trading",
      date: "2023-12-18",
      description: "Portfolio risk metrics, VaR calculations, and position sizing strategies.",
      summary: "Calculated VaR for sample portfolios, discussed Kelly criterion, reviewed risk-adjusted returns.",
      attended: false,
      reward: 0
    },
    {
      id: "4",
      title: "Algorithmic Trading Basics",
      date: "2023-12-11", 
      description: "Introduction to automated trading systems and backtesting methodologies.",
      summary: "Built simple momentum strategy, discussed backtesting pitfalls, reviewed performance metrics.",
      attended: true,
      reward: 100
    }
  ];

  const totalRewards = pastMeetings.reduce((sum, meeting) => sum + meeting.reward, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meetings</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Total Rewards: {totalRewards} Credits
        </Badge>
      </div>

      {/* Next Meeting */}
      <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Next Meeting</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{upcomingMeeting.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(upcomingMeeting.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{upcomingMeeting.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{upcomingMeeting.location}</span>
              </div>
            </div>
            <p className="text-muted-foreground">{upcomingMeeting.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Past Meetings */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Meeting History</h2>
        <div className="grid gap-4">
          {pastMeetings.map((meeting) => (
            <Card key={meeting.id} className={meeting.attended ? "border-success/50" : "border-muted"}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{meeting.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={meeting.attended ? "default" : "secondary"}>
                      {meeting.attended ? "Attended" : "Missed"}
                    </Badge>
                    {meeting.attended && (
                      <Badge variant="outline" className="text-success border-success">
                        +{meeting.reward} Credits
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(meeting.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">{meeting.description}</p>
                  </div>
                  {meeting.attended && (
                    <div>
                      <h4 className="font-medium mb-1">Summary</h4>
                      <p className="text-sm text-muted-foreground">{meeting.summary}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Meetings;