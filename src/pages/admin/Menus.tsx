import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Menu, AccessLevel, Screen } from "@/lib/types";
import { PlusCircle, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { getMenus, createMenu, updateMenu, deleteMenu } from "@/services/menuService";
import { getAccessLevels } from "@/services/accessLevelService";
import { getScreens } from "@/services/screenService";
import * as LucideIcons from "lucide-react";

const menuFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  icon: z.string().optional(),
  route: z.string().optional(),
  externalUrl: z.string().optional(),
  parentId: z.string().optional().nullable(),
  screenId: z.string().optional().nullable(),
  requiresAuth: z.boolean().default(true),
  accessLevelId: z.string().optional().nullable(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

type MenuFormValues = z.infer<typeof menuFormSchema>;

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [flatMenus, setFlatMenus] = useState<Menu[]>([]);
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: "",
      icon: "",
      route: "",
      externalUrl: "",
      parentId: null,
      screenId: null,
      requiresAuth: true,
      accessLevelId: null,
      order: 0,
      isActive: true,
    },
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [menuData, accessLevelData, screenData] = await Promise.all([
        getMenus(),
        getAccessLevels(),
        getScreens(),
      ]);
      setMenus(menuData);
      
      const allMenus: Menu[] = [];
      const flattenMenus = (items: Menu[], level = 0) => {
        items.forEach(item => {
          allMenus.push({...item, name: '  '.repeat(level) + item.name});
          if (item.children && item.children.length > 0) {
            flattenMenus(item.children, level + 1);
          }
        });
      };
      flattenMenus(menuData);
      setFlatMenus(allMenus);
      
      setAccessLevels(accessLevelData);
      setScreens(screenData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load menus data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateMenu = () => {
    form.reset({
      name: "",
      icon: "",
      route: "",
      externalUrl: "",
      parentId: null,
      screenId: null,
      requiresAuth: true,
      accessLevelId: null,
      order: 0,
      isActive: true,
    });
    setEditingMenu(null);
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  const handleEditMenu = (menu: Menu) => {
    form.reset({
      id: menu.id,
      name: menu.name,
      icon: menu.icon || "",
      route: menu.route || "",
      externalUrl: menu.externalUrl || "",
      parentId: menu.parentId || null,
      screenId: menu.screenId || null,
      requiresAuth: menu.requiresAuth,
      accessLevelId: menu.accessLevelId || null,
      order: menu.order,
      isActive: menu.isActive,
    });
    setEditingMenu(menu);
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  const handleDeleteMenu = async (id: string) => {
    if (confirm("Are you sure you want to delete this menu? This will also delete any child menus.")) {
      try {
        await deleteMenu(id);
        toast({
          title: "Success",
          description: "Menu deleted successfully.",
        });
        loadData();
      } catch (error) {
        console.error("Error deleting menu:", error);
        toast({
          title: "Error",
          description: "Failed to delete menu.",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = async (data: MenuFormValues) => {
    try {
      if (isCreating) {
        await createMenu(data as Omit<Menu, "id" | "createdAt" | "updatedAt" | "children">);
        toast({
          title: "Success",
          description: "Menu created successfully.",
        });
      } else {
        await updateMenu(data.id!, data);
        toast({
          title: "Success",
          description: "Menu updated successfully.",
        });
      }
      setIsDialogOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving menu:", error);
      toast({
        title: "Error",
        description: "Failed to save menu.",
        variant: "destructive",
      });
    }
  };

  const toggleMenuExpand = (id: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderMenuIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (LucideIcons as Record<string, any>)[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  const renderMenuItems = (items: Menu[], level = 0) => {
    return items.map(menu => (
      <React.Fragment key={menu.id}>
        <TableRow className={level > 0 ? "bg-muted/50" : ""}>
          <TableCell style={{ paddingLeft: `${level * 1.5 + 1}rem` }} className="flex items-center">
            {menu.children && menu.children.length > 0 ? (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 mr-2" 
                onClick={() => toggleMenuExpand(menu.id)}
              >
                {expandedMenus[menu.id] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-8"></div>
            )}
            <div className="flex items-center">
              {renderMenuIcon(menu.icon)}
              <span className="ml-2">{menu.name}</span>
            </div>
          </TableCell>
          <TableCell className="flex items-center">
            {menu.route || menu.externalUrl || "-"}
          </TableCell>
          <TableCell>
            <span className={`inline-flex rounded-full px-2 py-1 text-xs ${menu.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {menu.isActive ? "Active" : "Inactive"}
            </span>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditMenu(menu)}
              >
                <Edit size={16} />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteMenu(menu.id)}
              >
                <Trash2 size={16} />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {menu.children && menu.children.length > 0 && expandedMenus[menu.id] && 
          renderMenuItems(menu.children, level + 1)
        }
      </React.Fragment>
    ));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const availableIcons = Object.keys(LucideIcons).filter(
    key => typeof LucideIcons[key as keyof typeof LucideIcons] === 'function'
  );

  return (
    <MainLayout requireAdmin>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <Button onClick={handleCreateMenu} className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Add Menu</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Menu List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menus.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No menus found
                      </TableCell>
                    </TableRow>
                  ) : (
                    renderMenuItems(menus)
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isCreating ? "Create Menu" : "Edit Menu"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select icon" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            <SelectItem value="">None</SelectItem>
                            {availableIcons.map((icon) => (
                              <SelectItem key={icon} value={icon}>
                                <div className="flex items-center space-x-2">
                                  {renderMenuIcon(icon)}
                                  <span>{icon}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="route"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route (Internal Path)</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="externalUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>External URL</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Menu</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="None (Root Menu)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None (Root Menu)</SelectItem>
                          {flatMenus
                            .filter(m => m.id !== form.getValues("id")) // Don't allow selecting itself as parent
                            .map((menu) => (
                              <SelectItem key={menu.id} value={menu.id}>
                                {menu.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="screenId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Linked Screen</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="None" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {screens.map((screen) => (
                              <SelectItem key={screen.id} value={screen.id}>
                                {screen.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accessLevelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="None" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {accessLevels.map((level) => (
                              <SelectItem key={level.id} value={level.id}>
                                {level.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="requiresAuth"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Requires Authentication</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Active</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" type="button" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
