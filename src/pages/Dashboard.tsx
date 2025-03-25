
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CircleUser, Database, GanttChart, LayoutDashboard, 
  Menu as MenuIcon, MonitorCheck, BarChart, PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type StatItem = {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
};

export default function Dashboard() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Fetch counts from Supabase tables
      const [
        { count: usersCount, error: usersError },
        { count: groupsCount, error: groupsError },
        { count: accessLevelsCount, error: accessLevelsError },
        { count: menusCount, error: menusError },
        { count: screensCount, error: screensError },
        { count: analyticsQueriesCount, error: analyticsQueriesError },
        { count: powerbiReportsCount, error: powerbiReportsError },
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('groups').select('*', { count: 'exact', head: true }),
        supabase.from('access_levels').select('*', { count: 'exact', head: true }),
        supabase.from('menus').select('*', { count: 'exact', head: true }),
        supabase.from('screens').select('*', { count: 'exact', head: true }),
        supabase.from('analytics_queries').select('*', { count: 'exact', head: true }),
        supabase.from('powerbi_reports').select('*', { count: 'exact', head: true }),
      ]);

      if (usersError || groupsError || accessLevelsError || menusError || 
          screensError || analyticsQueriesError || powerbiReportsError) {
        throw new Error("Failed to fetch statistics");
      }

      const newStats: StatItem[] = [
        {
          title: "Users",
          value: usersCount || 0,
          icon: <CircleUser className="h-8 w-8 text-blue-500" />,
          description: "Total system users"
        },
        {
          title: "Groups",
          value: groupsCount || 0,
          icon: <Database className="h-8 w-8 text-green-500" />,
          description: "User groups"
        },
        {
          title: "Access Levels",
          value: accessLevelsCount || 0,
          icon: <GanttChart className="h-8 w-8 text-purple-500" />,
          description: "Permission levels"
        },
        {
          title: "Menus",
          value: menusCount || 0,
          icon: <MenuIcon className="h-8 w-8 text-amber-500" />,
          description: "Navigation items"
        },
        {
          title: "Screens",
          value: screensCount || 0,
          icon: <MonitorCheck className="h-8 w-8 text-red-500" />,
          description: "Content screens"
        },
        {
          title: "SQL Queries",
          value: analyticsQueriesCount || 0,
          icon: <BarChart className="h-8 w-8 text-cyan-500" />,
          description: "Analytics queries"
        },
        {
          title: "PowerBI Reports",
          value: powerbiReportsCount || 0,
          icon: <PieChart className="h-8 w-8 text-indigo-500" />,
          description: "Embedded reports"
        },
      ];

      setStats(newStats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(7)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-20 bg-muted/50"></CardHeader>
              <CardContent className="p-6">
                <div className="h-4 w-1/2 bg-muted rounded"></div>
                <div className="h-8 w-1/3 bg-muted rounded mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-primary/5 flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
