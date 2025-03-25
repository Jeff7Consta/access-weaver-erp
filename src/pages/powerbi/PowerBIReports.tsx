
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
import { Plus, MoreVertical, Search, ExternalLink, Pencil, Trash } from "lucide-react";
import { PowerBIReport } from "@/lib/types";
import { getPowerBIReports, deletePowerBIReport } from "@/services/analyticsService";

export default function PowerBIReports() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<PowerBIReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<PowerBIReport[]>([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<PowerBIReport | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    if (filter) {
      setFilteredReports(
        reports.filter(
          (report) =>
            report.name.toLowerCase().includes(filter.toLowerCase()) ||
            (report.description && report.description.toLowerCase().includes(filter.toLowerCase()))
        )
      );
    } else {
      setFilteredReports(reports);
    }
  }, [reports, filter]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await getPowerBIReports();
      setReports(data);
    } catch (error) {
      console.error("Error loading reports:", error);
      toast({
        title: "Error",
        description: "Failed to load Power BI reports.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;

    try {
      await deletePowerBIReport(reportToDelete.id);
      setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
      toast({
        title: "Report deleted",
        description: "The Power BI report has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "Error",
        description: "Failed to delete the report.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Power BI Reports</h1>
        <Button onClick={() => navigate("/powerbi/reports/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>Browse and manage your Power BI embedded reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter reports..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <div className="py-8 text-center">Loading reports...</div>
          ) : filteredReports.length === 0 ? (
            <div className="py-8 text-center">
              {reports.length === 0
                ? "No reports found. Create your first report to get started."
                : "No reports match your filter."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>{report.report_id}</TableCell>
                    <TableCell>{report.description || "-"}</TableCell>
                    <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/powerbi/reports/${report.id}/view`)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Report
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/powerbi/reports/${report.id}/edit`)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setReportToDelete(report);
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
            <DialogTitle>Delete Power BI Report</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the report "{reportToDelete?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteReport}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
