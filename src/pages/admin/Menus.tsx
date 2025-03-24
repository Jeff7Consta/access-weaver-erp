
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Edit, ExternalLink, Menu as MenuIcon, Plus, Search, Trash } from "lucide-react";
import { Menu } from "@/lib/types";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export default function MenusPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: menus = [], isLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: () => api.getMenus(),
  });

  // Create a flat list of all menus including children for searching
  const flattenMenus = (menuItems: Menu[]): Menu[] => {
    return menuItems.reduce((acc: Menu[], menu) => {
      if (menu.children && menu.children.length > 0) {
        return [...acc, menu, ...flattenMenus(menu.children)];
      }
      return [...acc, menu];
    }, []);
  };

  const allMenus = flattenMenus(menus);
  
  const filteredMenus = allMenus.filter((menu) =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMenuType = (menu: Menu) => {
    if (menu.externalUrl) return "External Link";
    if (menu.children && menu.children.length > 0) return "Parent Menu";
    if (menu.route) return "Internal Page";
    return "Unknown";
  };

  const getParentName = (menu: Menu) => {
    if (!menu.parentId) return "None";
    const parent = allMenus.find((m) => m.id === menu.parentId);
    return parent ? parent.name : "Unknown";
  };

  const getAccessLevelName = (menu: Menu) => {
    if (!menu.accessLevelId) return "Public";
    return menu.accessLevelId === "1" ? "Administrator" : "Basic User";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Menus Management</h1>
        <Button>
          <MenuIcon className="mr-2 h-4 w-4" />
          Add New Menu
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Navigation Menus</CardTitle>
          <CardDescription>
            Configure the system's navigation menu structure and access permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menus..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Menu
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
                    <TableHead>Type</TableHead>
                    <TableHead>Parent Menu</TableHead>
                    <TableHead>Access Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMenus.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No menus found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMenus.map((menu) => (
                      <TableRow key={menu.id}>
                        <TableCell>
                          <div className="flex items-center">
                            {menu.parentId && (
                              <ChevronRight className="mr-1 h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={cn("font-medium", menu.parentId && "ml-2")}>
                              {menu.name}
                            </span>
                            {menu.externalUrl && (
                              <ExternalLink className="ml-1 h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getMenuType(menu)}</TableCell>
                        <TableCell>{getParentName(menu)}</TableCell>
                        <TableCell>{getAccessLevelName(menu)}</TableCell>
                        <TableCell>
                          <Badge variant={menu.isActive ? "success" : "secondary"}>
                            {menu.isActive ? "Active" : "Inactive"}
                          </Badge>
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
