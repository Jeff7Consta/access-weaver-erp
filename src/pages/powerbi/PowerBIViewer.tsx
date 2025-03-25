
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { PowerBIReport } from "@/lib/types";
import { getPowerBIReportById, getPowerBIEmbedInfo } from "@/services/analyticsService";

export default function PowerBIViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [report, setReport] = useState<PowerBIReport | null>(null);
  const [embedInfo, setEmbedInfo] = useState<{ embedToken: string; embedUrl: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEmbed, setIsLoadingEmbed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const powerBIRef = useRef<any>(null);

  useEffect(() => {
    if (!id) return;
    
    const loadReport = async () => {
      setIsLoading(true);
      try {
        const data = await getPowerBIReportById(id);
        setReport(data);
        if (data) {
          loadEmbedInfo(data.report_id);
        }
      } catch (error) {
        console.error("Error loading report:", error);
        setError("Failed to load the report. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();

    // Load the Power BI JavaScript library
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/powerbi-client/2.19.1/powerbi.min.js";
    script.async = true;
    script.onload = () => {
      powerBIRef.current = window["powerbi"];
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [id]);

  const loadEmbedInfo = async (reportId: string) => {
    setIsLoadingEmbed(true);
    setError(null);
    try {
      const info = await getPowerBIEmbedInfo(reportId);
      setEmbedInfo(info);
    } catch (error) {
      console.error("Error loading embed info:", error);
      setError("Failed to load embed information for the report.");
    } finally {
      setIsLoadingEmbed(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current || !embedInfo || !powerBIRef.current) return;

    try {
      const { embedToken, embedUrl } = embedInfo;
      
      const reportLoadConfig = {
        type: "report",
        tokenType: powerBIRef.current.models.TokenType.Embed,
        accessToken: embedToken,
        embedUrl: embedUrl,
        settings: {
          panes: { filters: { visible: false }, pageNavigation: { visible: true } },
          layoutType: powerBIRef.current.models.LayoutType.FitToPage,
        },
      };

      powerBIRef.current.reset(containerRef.current);
      const reportInstance = powerBIRef.current.embed(containerRef.current, reportLoadConfig);

      reportInstance.on("loaded", () => console.log("Report loaded successfully."));
      reportInstance.on("error", (event: any) => {
        console.error("Error rendering report:", event.detail);
        setError("Error rendering the Power BI report. Please check the report configuration.");
      });

      return () => {
        if (powerBIRef.current && containerRef.current) {
          powerBIRef.current.reset(containerRef.current);
        }
      };
    } catch (error) {
      console.error("Error embedding report:", error);
      setError("Failed to embed the Power BI report. Please try again later.");
    }
  }, [embedInfo, containerRef.current, powerBIRef.current]);

  const handleRefresh = () => {
    if (!report) return;
    loadEmbedInfo(report.report_id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
        <Card>
          <CardContent className="p-0">
            <Skeleton className="h-[600px] w-full rounded-none" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!report) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          The requested report could not be found. <Button variant="link" onClick={() => navigate("/powerbi/reports")}>Return to reports</Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/powerbi/reports")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{report.name}</h1>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoadingEmbed}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0 h-[600px]">
          {isLoadingEmbed ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                <p className="mt-2">Loading report...</p>
              </div>
            </div>
          ) : (
            <div ref={containerRef} className="h-full w-full" id="report-container"></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
