import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertCircle, Lightbulb } from "lucide-react";

export function AIInsightsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">AI Learning Insights</h2>
          <Badge variant="secondary" className="text-xs">
            Coming Soon
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-dashed border-2 bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              Weak Concept Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground opacity-70">
              AI-powered insights will appear once enabled.
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Lightbulb className="h-4 w-4" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8 text-center">
            <div className="flex flex-col items-center gap-2 opacity-70">
              <Sparkles className="h-6 w-6 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Smart suggestions for content and catch-up lessons.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
