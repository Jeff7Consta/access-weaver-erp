
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PowerBIReport } from "@/lib/types";
import { createPowerBIReport, updatePowerBIReport } from "@/services/analyticsService";

interface PowerBIReportFormProps {
  initialData?: PowerBIReport;
}

export function PowerBIReportForm({ initialData }: PowerBIReportFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PowerBIReport>>(
    initialData || {
      name: "",
      description: "",
      report_id: "",
      workspace_id: "",
      embed_url: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initialData?.id) {
        await updatePowerBIReport(initialData.id, formData);
        toast({
          title: "Report updated",
          description: "The Power BI report has been updated successfully.",
        });
      } else {
        await createPowerBIReport(formData as Omit<PowerBIReport, "id" | "created_at" | "updated_at">);
        toast({
          title: "Report created",
          description: "The new Power BI report has been created successfully.",
        });
      }
      navigate("/powerbi/reports");
    } catch (error) {
      console.error("Error saving report:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the report.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{initialData ? "Edit Power BI Report" : "Create Power BI Report"}</CardTitle>
          <CardDescription>Configure your Power BI embedded report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Report Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter a name for this report"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter an optional description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report_id">Report ID</Label>
            <Input
              id="report_id"
              name="report_id"
              placeholder="Enter the Power BI Report ID"
              value={formData.report_id || ""}
              onChange={handleChange}
              required
            />
            <p className="text-sm text-muted-foreground">
              This is the unique identifier for your Power BI report (e.g., 63ef6b50-6a42-434d-8d3d-aed697cc710b).
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workspace_id">Workspace ID (Optional)</Label>
            <Input
              id="workspace_id"
              name="workspace_id"
              placeholder="Enter the Power BI Workspace ID"
              value={formData.workspace_id || ""}
              onChange={handleChange}
            />
            <p className="text-sm text-muted-foreground">
              The workspace ID where the report is located.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="embed_url">Embed URL (Optional)</Label>
            <Input
              id="embed_url"
              name="embed_url"
              placeholder="Enter the Power BI Embed URL"
              value={formData.embed_url || ""}
              onChange={handleChange}
            />
            <p className="text-sm text-muted-foreground">
              If left blank, the embed URL will be generated automatically using the Report ID.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate("/powerbi/reports")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update Report" : "Create Report"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
