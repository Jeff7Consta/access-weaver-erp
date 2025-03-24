
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Plus, Search, Shield, Trash } from "lucide-react";
import { AccessLevel } from "@/lib/types";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function AccessLevelsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: accessLevels = [], isLoading } = useQuery({
    queryKey: ["accessLevels"],
    queryFn: () => api.getAccessLevels(),
  });

  const filteredAccessLevels = accessLevels.filter((level) =>
    level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    level.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Access Levels</h1>
        <Button>
          <Shield className="mr-2 h-4 w-4" />
          Add New Access Level
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access Control Levels</CardTitle>
          <CardDescription>
            Manage access control levels and their permissions in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search access levels..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Level
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Parent Level</TableHead>
                    <TableHead>Assigned Groups</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccessLevels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No access levels found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAccessLevels.map((level) => (
                      <TableRow key={level.id}>
                        <TableCell className="font-medium">{level.name}</TableCell>
                        <TableCell>{level.description}</TableCell>
                        <TableCell>
                          {level.parentId ? "Has Parent" : "Top Level"}
                        </TableCell>
                        <TableCell>
                          {level.id === "1" ? "Administrators" : "Users"}
                        </TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
