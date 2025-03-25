
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, ArrowLeft, Play } from "lucide-react";
import { AnalyticsQuery, AnalyticsQueryResult } from "@/lib/types";
import { getAnalyticsQueryById, executeAnalyticsQuery } from "@/services/analyticsService";

export default function AnalyticsQueryRunner() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState<AnalyticsQuery | null>(null);
  const [queryResult, setQueryResult] = useState<AnalyticsQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!id) return;
    
    const loadQuery = async () => {
      setIsLoading(true);
      try {
        const data = await getAnalyticsQueryById(id);
        setQuery(data);
      } catch (error) {
        console.error("Error loading query:", error);
        setError("Failed to load the query. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuery();
  }, [id]);

  const executeQuery = async () => {
    if (!query) return;
    
    setIsExecuting(true);
    setError(null);

    try {
      // In a real app, this would execute the SQL query
      const result = await executeAnalyticsQuery(query.sql_query);
      setQueryResult(result);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error executing query:", error);
      setError("Failed to execute the query. Please check the SQL syntax and try again.");
      setQueryResult(null);
    } finally {
      setIsExecuting(false);
    }
  };

  const downloadCsv = () => {
    if (!queryResult) return;

    const { data, columns } = queryResult;
    const header = columns.join(",");
    const rows = data.map(row => 
      columns.map(col => {
        const value = row[col];
        // Handle values that might contain commas or quotes
        return typeof value === "string" 
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(",")
    );
    
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${query?.name || "query"}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate pagination
  const totalPages = queryResult ? Math.ceil(queryResult.data.length / itemsPerPage) : 0;
  const paginatedData = queryResult 
    ? queryResult.data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  if (isLoading) {
    return <div className="py-8 text-center">Loading query...</div>;
  }

  if (!query) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          The requested query could not be found. <Button variant="link" onClick={() => navigate("/analytics/queries")}>Return to queries</Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/analytics/queries")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{query.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={executeQuery} disabled={isExecuting}>
            <Play className="mr-2 h-4 w-4" />
            {isExecuting ? "Executing..." : "Run Query"}
          </Button>
          {queryResult && (
            <Button variant="outline" onClick={downloadCsv}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {query.description && (
        <Card>
          <CardContent className="pt-6">
            <p>{query.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>SQL Query</CardTitle>
          <CardDescription>This SQL query will be executed on your database</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{query.sql_query}</code>
          </pre>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {queryResult && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Showing {paginatedData.length} of {queryResult.data.length} rows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {queryResult.columns.map((column) => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {queryResult.columns.map((column) => (
                        <TableCell key={column}>
                          {row[column] !== null && row[column] !== undefined 
                            ? String(row[column]) 
                            : "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === totalPages || 
                        Math.abs(page - currentPage) <= 1
                      )
                      .map((page, i, array) => {
                        // Add ellipsis
                        if (i > 0 && page > array[i - 1] + 1) {
                          return (
                            <React.Fragment key={`ellipsis-${page}`}>
                              <PaginationItem>
                                <span className="px-2">...</span>
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationLink
                                  isActive={page === currentPage}
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          );
                        }
                        
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={page === currentPage}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
