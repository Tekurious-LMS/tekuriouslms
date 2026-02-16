import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cuboid, Upload } from "lucide-react";

export function ARCreationSection() {
  const templates = [
    { id: 1, title: "3D Model Viewer", desc: "Visualize static assets" },
    {
      id: 2,
      title: "Virtual Lab Builder",
      desc: "Create interactive experiments",
    },
    { id: 3, title: "360° Field Trip", desc: "Immersive photo tours" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">
            Create Immersive Lessons (AR/VR)
          </h2>
          <Badge variant="secondary" className="text-xs">
            Coming Soon
          </Badge>
        </div>
      </div>

      <Card className="border-dashed border-2 bg-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Cuboid className="h-5 w-5" />
            AR/VR Content Studio
          </CardTitle>
          <CardDescription>
            AR/VR lesson creation will be enabled in a future update.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-4 rounded-lg border border-dashed bg-background/50 flex flex-col items-center text-center space-y-2 opacity-70"
              >
                <div className="p-2 rounded-full bg-muted">
                  <Cuboid className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{template.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {template.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button disabled variant="outline" className="w-full sm:w-auto">
              <Cuboid className="mr-2 h-4 w-4" />
              Create AR Lesson
            </Button>
            <Button disabled variant="outline" className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Upload 3D Model
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
