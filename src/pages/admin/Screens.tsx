
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Monitor, Plus, Search, Trash } from "lucide-react";

export default function ScreensPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock screens data
  const screens = [
    {
      id: "1",
      name: "Dashboard",
      description: "Main system dashboard screen",
      contentType: "component",
      accessLevelId: "2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "User Report",
      description: "User activity report screen",
      contentType: "html",
      accessLevelId: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "External API Monitor",
      description: "External system monitoring",
      contentType: "iframe",
      accessLevelId: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const filteredScreens = screens.filter((screen) =>
    screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    screen.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "component":
        return "React Component";
      case "html":
        return "HTML Content";
      case "iframe":
        return "External iFrame";
      default:
        return type;
    }
  };

  const getAccessLevelName = (id: string | null) => {
    if (!id) return "Public";
    return id === "1" ? "Administrator" : "Basic User";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Screens Management</h1>
        <Button>
          <Monitor className="mr-2 h-4 w-4" />
          Add New Screen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Screens</CardTitle>
          <CardDescription>
            Manage content screens that can be loaded in the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search screens..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Screen
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Content Type</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScreens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No screens found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredScreens.map((screen) => (
                    <TableRow key={screen.id}>
                      <TableCell className="font-medium">{screen.name}</TableCell>
                      <TableCell>{screen.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getContentTypeLabel(screen.contentType)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getAccessLevelName(screen.accessLevelId)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
