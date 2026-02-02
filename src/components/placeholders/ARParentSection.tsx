"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cuboid, TrendingUp } from "lucide-react";

export function ARParentSection() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold">Immersive Learning</h2>
                    <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
            </div>

            <Card className="border-dashed border-2 bg-muted/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-muted-foreground">
                        <Cuboid className="h-5 w-5" />
                        AR/VR Experience Preview
                    </CardTitle>
                    <CardDescription>
                        Soon you'll be able to see what your child is experiencing in their immersive learning sessions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground opacity-60">
                    <div className="p-4 rounded-full bg-muted mb-4">
                        <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <div className="space-y-2 max-w-md">
                        <p className="text-sm">
                            View session replays, 3D model interactions, and engagement metrics from your child's AR and VR lessons.
                        </p>
                    </div>
                    <Button disabled variant="outline" className="mt-6">
                        Explore Demo
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
