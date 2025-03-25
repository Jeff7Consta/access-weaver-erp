
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MoreVertical, Search, Play, Pencil, Trash } from "lucide-react";
import { AnalyticsQuery } from "@/lib/types";
import { getAnalyticsQueries, deleteAnalyticsQuery } from "@/services/analyticsService";

export default function AnalyticsQueries() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [queries, setQueries] = useState<AnalyticsQuery[]>([]);
  const [filteredQueries, setFilteredQueries] = useState<AnalyticsQuery[]>([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState<AnalyticsQuery | null>(null);

  useEffect(() => {
    loadQueries();
  }, []);

  useEffect(() => {
    if (filter) {
      setFilteredQueries(
        queries.filter(
          (query) =>
            query.name.toLowerCase().includes(filter.toLowerCase()) ||
            (query.description && query.description.toLowerCase().includes(filter.toLowerCase()))
        )
      );
    } else {
      setFilteredQueries(queries);
    }
  }, [queries, filter]);

  const loadQueries = async () => {
    setIsLoading(true);
    try {
      const data = await getAnalyticsQueries();
      setQueries(data);
    } catch (error) {
      console.error("Error loading queries:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics queries.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuery = async () => {
    if (!queryToDelete) return;

    try {
      await deleteAnalyticsQuery(queryToDelete.id);
      setQueries((prev) => prev.filter((q) => q.id !== queryToDelete.id));
      toast({
        title: "Query deleted",
        description: "The analytics query has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting query:", error);
      toast({
        title: "Error",
        description: "Failed to delete the query.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setQueryToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Queries</h1>
        <Button onClick={() => navigate("/analytics/queries/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Query
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queries</CardTitle>
          <CardDescription>Browse and manage your analytics queries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter queries..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <div className="py-8 text-center">Loading queries...</div>
          ) : filteredQueries.length === 0 ? (
            <div className="py-8 text-center">
              {queries.length === 0
                ? "No queries found. Create your first query to get started."
                : "No queries match your filter."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueries.map((query) => (
                  <TableRow key={query.id}>
                    <TableCell className="font-medium">{query.name}</TableCell>
                    <TableCell>{query.description || "-"}</TableCell>
                    <TableCell>{new Date(query.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(query.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/analytics/queries/${query.id}/run`)}>
                            <Play className="mr-2 h-4 w-4" />
                            Run Query
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/analytics/queries/${query.id}/edit`)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setQueryToDelete(query);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Analytics Query</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the query "{queryToDelete?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuery}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
