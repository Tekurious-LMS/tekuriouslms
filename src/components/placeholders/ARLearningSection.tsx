"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cuboid, Lock } from "lucide-react";

export function ARLearningSection() {
  const arvrLessons = [
    {
      id: 1,
      title: "Explore the Solar System",
      subject: "Astronomy",
      type: "VR Experience",
      duration: "15 min",
    },
    {
      id: 2,
      title: "Human Heart Anatomy",
      subject: "Biology",
      type: "AR Model",
      duration: "10 min",
    },
    {
      id: 3,
      title: "Chemical Reactions Lab",
      subject: "Chemistry",
      type: "VR Lab",
      duration: "20 min",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">Immersive Learning (AR/VR)</h2>
          <Badge variant="secondary" className="text-xs">
            Coming Soon
          </Badge>
        </div>
      </div>

      <Card className="border-dashed border-2 bg-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Cuboid className="h-5 w-5" />
            AR/VR Learning Experiences
          </CardTitle>
          <CardDescription>
            Interactive AR/VR lessons will be available in a future release.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {arvrLessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="border-border/60 bg-card/50 opacity-80"
              >
                <CardContent className="p-4 space-y-4">
                  <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                    <Cuboid className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm line-clamp-1">
                      {lesson.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {lesson.subject}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        •
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {lesson.duration}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] mt-2 bg-muted/50 border-dashed"
                    >
                      {lesson.type}
                    </Badge>
                  </div>
                  <Button
                    disabled
                    variant="secondary"
                    className="w-full text-xs h-8"
                  >
                    <Lock className="mr-2 h-3 w-3" />
                    Launch AR Experience
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
