
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Download, Filter } from "lucide-react";
import { AnalyticsQuery, AnalyticsQueryResult } from "@/lib/types";
import { getAnalyticsQueryById, executeAnalyticsQuery } from "@/services/analyticsService";

export default function AnalyticsQueryRunner() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState<AnalyticsQuery | null>(null);
  const [sqlQuery, setSqlQuery] = useState("");
  const [queryResult, setQueryResult] = useState<AnalyticsQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("data");
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    
    const loadQuery = async () => {
      setIsLoading(true);
      try {
        const data = await getAnalyticsQueryById(id);
        setQuery(data);
        setSqlQuery(data.sql_query);
      } catch (error) {
        console.error("Error loading query:", error);
        setError("Failed to load the query. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuery();
  }, [id]);

  const handleRunQuery = async () => {
    setIsRunning(true);
    setError(null);
    
    try {
      const result = await executeAnalyticsQuery(sqlQuery);
      setQueryResult(result);
      setActiveTab("data");
      
      toast({
        title: "Query executed successfully",
        description: `Retrieved ${result.data.length} rows.`,
      });
    } catch (error) {
      console.error("Error executing query:", error);
      setError(typeof error === 'string' ? error : error.message || "An error occurred while executing the query.");
      
      toast({
        title: "Query execution failed",
        description: "Please check the SQL syntax and try again.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const downloadCSV = () => {
    if (!queryResult || !queryResult.data.length) return;
    
    // Get all columns
    const columns = queryResult.columns;
    
    // Create CSV header row
    let csv = columns.join(',') + '\n';
    
    // Create data rows
    queryResult.data.forEach(row => {
      const dataRow = columns.map(col => {
        const value = row[col];
        // Handle values that might contain commas, quotes, etc.
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csv += dataRow.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${query?.name || 'query-result'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterChange = (column: string, value: string) => {
    setFilters({
      ...filters,
      [column]: value
    });
  };

  const getFilteredData = () => {
    if (!queryResult) return [];
    
    return queryResult.data.filter(row => {
      return Object.entries(filters).every(([column, filterValue]) => {
        if (!filterValue.trim()) return true;
        
        const cellValue = row[column];
        if (cellValue === null || cellValue === undefined) return false;
        
        return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  };

  const filteredData = getFilteredData();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading query...</p>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          The requested query could not be found. 
          <Button variant="link" onClick={() => navigate("/analytics/queries")}>
            Return to queries
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/analytics/queries")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{query.name}</h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={downloadCSV} 
            disabled={!queryResult || queryResult.data.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          
          <Button 
            onClick={handleRunQuery} 
            disabled={isRunning}
          >
            <Play className="mr-2 h-4 w-4" />
            {isRunning ? "Running..." : "Run Query"}
          </Button>
        </div>
      </div>

      {query.description && (
        <p className="text-muted-foreground">{query.description}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>SQL Query</CardTitle>
          <CardDescription>Review or modify the SQL query below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full h-32 p-2 border rounded-md font-mono text-sm"
              placeholder="Enter SQL query..."
            />
          </div>
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
            <div className="flex justify-between items-center">
              <CardTitle>Query Results</CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList>
                  <TabsTrigger value="data">Data</TabsTrigger>
                  <TabsTrigger value="filters">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>
              {filteredData.length} rows returned {filteredData.length !== queryResult.data.length && 
                `(filtered from ${queryResult.data.length})`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="filters" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {queryResult.columns.map((column) => (
                  <div key={column} className="space-y-2">
                    <Label htmlFor={`filter-${column}`}>{column}</Label>
                    <Input
                      id={`filter-${column}`}
                      placeholder={`Filter by ${column}...`}
                      value={filters[column] || ''}
                      onChange={(e) => handleFilterChange(column, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="data" className="p-0">
              <div className="border rounded-md overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {queryResult.columns.map((column) => (
                        <TableHead key={column}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={queryResult.columns.length} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {queryResult.columns.map((column) => (
                            <TableCell key={`${rowIndex}-${column}`}>
                              {row[column] !== null && row[column] !== undefined 
                                ? String(row[column]) 
                                : <span className="text-muted-foreground">null</span>}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
