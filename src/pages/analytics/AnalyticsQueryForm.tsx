
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnalyticsQuery } from "@/lib/types";
import { createAnalyticsQuery, updateAnalyticsQuery } from "@/services/analyticsService";

interface AnalyticsQueryFormProps {
  initialData?: AnalyticsQuery;
}

export function AnalyticsQueryForm({ initialData }: AnalyticsQueryFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<AnalyticsQuery>>(
    initialData || {
      name: "",
      description: "",
      sql_query: "",
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
        await updateAnalyticsQuery(initialData.id, formData);
        toast({
          title: "Query updated",
          description: "The analytics query has been updated successfully.",
        });
      } else {
        await createAnalyticsQuery(formData as Omit<AnalyticsQuery, "id" | "created_at" | "updated_at">);
        toast({
          title: "Query created",
          description: "The new analytics query has been created successfully.",
        });
      }
      navigate("/analytics/queries");
    } catch (error) {
      console.error("Error saving query:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the query.",
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
          <CardTitle>{initialData ? "Edit Analytics Query" : "Create Analytics Query"}</CardTitle>
          <CardDescription>Configure your SQL query for analytics data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Query Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter a name for this query"
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
            <Label htmlFor="sql_query">SQL Query</Label>
            <Textarea
              id="sql_query"
              name="sql_query"
              placeholder="Enter your SQL query"
              value={formData.sql_query || ""}
              onChange={handleChange}
              className="font-mono"
              rows={8}
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter a valid SQL query that will be used to fetch data.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate("/analytics/queries")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update Query" : "Create Query"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
