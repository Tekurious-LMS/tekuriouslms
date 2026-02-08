"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  GraduationCap,
  // BarChart3,
  Box,
  Glasses,
  PlayCircle,
  Activity,
  AlertCircle,
  // FileText,
  // Settings,
  Upload,
} from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";
import { courses } from "@/lib/mockData";
import { UserStats } from "@/components/users/UserStats";

type Role = "Admin" | "Teacher" | "Student" | "Parent";

export function RoleDashboard() {
  const [role, setRole] = useState<Role>("Student");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back,{" "}
            {role === "Admin"
              ? "Rajesh"
              : role === "Teacher"
                ? "Priya"
                : role === "Student"
                  ? "Aarav"
                  : "Vikram"}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
          {["Student", "Teacher", "Admin", "Parent"].map((r) => (
            <Button
              key={r}
              variant={role === r ? "default" : "ghost"}
              size="sm"
              onClick={() => setRole(r as Role)}
              className="text-xs"
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      {role === "Student" && <StudentView />}
      {role === "Teacher" && <TeacherView />}
      {role === "Admin" && <AdminView />}
      {role === "Parent" && <ParentView />}
    </div>
  );
}

function StudentView() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Courses Enrolled
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Grade</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">A-</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AR Modules</CardTitle>
            <Box className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">New available</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">My Courses</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.slice(0, 2).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Immersive Learning</h2>
            <Badge variant="outline" className="text-primary border-primary">
              Pre-Alpha
            </Badge>
          </div>
          <Card className="overflow-hidden relative group">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary to-accent" />
            <CardHeader>
              <Box className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Human Heart 3D</CardTitle>
              <CardDescription>Biology • Class 10</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative">
                <p className="text-muted-foreground text-xs">
                  3D Model Preview
                </p>
                <PlayCircle className="h-10 w-10 text-muted-foreground/50 absolute" />
              </div>
              <Button disabled className="w-full mt-4" variant="secondary">
                <Glasses className="mr-2 h-4 w-4" /> View in AR (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TeacherView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>
              Average scores across all active terms
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md">
            [Chart Placeholder: Performance Trends]
          </CardContent>
        </Card>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>AR Content Creator</CardTitle>
            <CardDescription>Upload 3D models for your class</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Drag 3D models here</p>
              <p className="text-xs text-muted-foreground">
                .obj, .fbx, .gltf supported
              </p>
            </div>
            <Button disabled>Upload Model (Disabled)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminView() {
  return (
    <div className="space-y-6">
      <UserStats />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Audit Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <p className="text-sm font-medium">
                      User Rajesh edited Course Math-101
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    2 hrs ago
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Server Up-time</span>
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                99.9%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Load</span>
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                Normal
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">AR Service</span>
              <Badge
                variant="outline"
                className="text-yellow-600 border-yellow-600"
              >
                Maintenance
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ParentView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
          A
        </div>
        <div>
          <h2 className="text-2xl font-bold">Aarav Singh</h2>
          <p className="text-muted-foreground">
            Class 10-A • Delhi Public School
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fee Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-600">Paid</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next PTM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">March 25th, 2024</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <AlertCircle className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-sm font-medium">Math Assignment Due</p>
                <p className="text-xs text-muted-foreground">
                  Aarav has a submission pending for Algebra due tomorrow.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
