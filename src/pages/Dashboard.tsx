
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 30 },
  { name: "Mar", value: 45 },
  { name: "Apr", value: 50 },
  { name: "May", value: 35 },
  { name: "Jun", value: 60 },
  { name: "Jul", value: 65 },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+5% from last hour</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Operational</div>
            <p className="text-xs text-muted-foreground">All systems normal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Access Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.role === "admin" ? "Administrator" : "Standard User"}</div>
            <p className="text-xs text-muted-foreground">{user?.role === "admin" ? "Full system access" : "Limited system access"}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>System usage over the last 7 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="text-sm font-medium">User Login</p>
                <p className="text-xs text-muted-foreground">John Smith logged in 5 minutes ago</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">Configuration Change</p>
                <p className="text-xs text-muted-foreground">System settings updated 15 minutes ago</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">New User Created</p>
                <p className="text-xs text-muted-foreground">Jane Doe added 30 minutes ago</p>
              </div>
              <div>
                <p className="text-sm font-medium">System Backup</p>
                <p className="text-xs text-muted-foreground">Automatic backup completed 2 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Permissions</CardTitle>
            <CardDescription>Access levels and capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user?.role === "admin" ? (
                <>
                  <div className="flex items-center justify-between border-b pb-2">
                    <p className="text-sm font-medium">User Management</p>
                    <div className="text-xs font-medium text-green-500">Full Access</div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <p className="text-sm font-medium">Group Management</p>
                    <div className="text-xs font-medium text-green-500">Full Access</div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <p className="text-sm font-medium">Menu Configuration</p>
                    <div className="text-xs font-medium text-green-500">Full Access</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">System Configuration</p>
                    <div className="text-xs font-medium text-green-500">Full Access</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b pb-2">
                    <p className="text-sm font-medium">Dashboard</p>
                    <div className="text-xs font-medium text-green-500">View</div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <p className="text-sm font-medium">Reports</p>
                    <div className="text-xs font-medium text-green-500">View</div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <p className="text-sm font-medium">User Management</p>
                    <div className="text-xs font-medium text-red-500">No Access</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">System Configuration</p>
                    <div className="text-xs font-medium text-red-500">No Access</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Users className="h-6 w-6" />
                <span className="text-xs">Users</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Settings className="h-6 w-6" />
                <span className="text-xs">Settings</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <FileText className="h-6 w-6" />
                <span className="text-xs">Reports</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <HelpCircle className="h-6 w-6" />
                <span className="text-xs">Help</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { FileText, HelpCircle, Settings, Users } from "lucide-react";
