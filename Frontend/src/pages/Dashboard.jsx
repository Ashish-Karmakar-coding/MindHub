import { StatsCard } from "@/components/StatsCard";
import { FileText, Link2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalLinks: 0,
  });

  useEffect(() => {
    // Placeholder for API call to fetch stats
    // Replace with actual API call later
    const fetchStats = async () => {
      // Simulated data
      setStats({
        totalNotes: 12,
        totalLinks: 8,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Notes"
          value={stats.totalNotes}
          icon={FileText}
          description="Notes created by you"
        />
        <StatsCard
          title="Total Links"
          value={stats.totalLinks}
          icon={Link2}
          description="Links saved by you"
        />
        <StatsCard
          title="Total Items"
          value={stats.totalNotes + stats.totalLinks}
          icon={TrendingUp}
          description="Combined notes and links"
        />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-muted-foreground">
          Your recent notes and links will appear here.
        </p>
      </div>
    </div>
  );
}
