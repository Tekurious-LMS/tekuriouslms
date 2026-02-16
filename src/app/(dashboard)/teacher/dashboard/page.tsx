import {
  BookOpen,
  Users,
  ClipboardList,
  TrendingUp,
  Plus,
  GraduationCap,
  Upload,
  FolderPlus,
  Target,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { requireServerRBAC } from "@/lib/server-rbac";
import { Role } from "@/lib/rbac-types";
import { getTeacherAnalytics } from "@/lib/progress-repository";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ARCreationSection } from "@/components/placeholders/ARCreationSection";
import { AIInsightsSection } from "@/components/placeholders/AIInsightsSection";

export default async function TeacherDashboard() {
  try {
    const context = await requireServerRBAC([Role.TEACHER]);
    const analytics = await getTeacherAnalytics(context);

    const courses = analytics.courses;
    const totalStudents = courses.reduce(
      (sum, c) => sum + c.enrollmentCount,
      0,
    );
    const avgCompletion =
      courses.length > 0
        ? Math.round(
            courses.reduce((sum, c) => sum + c.averageCompletionRate, 0) /
              courses.length,
          )
        : 0;
    const pendingReviews = courses.reduce(
      (sum, c) =>
        sum +
        Math.max(
          0,
          c.enrollmentCount -
            Math.round(
              c.enrollmentCount * (c.assessmentParticipation / 100 || 0),
            ),
        ),
      0,
    );

    return (
      <div className="w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Welcome back, {context.userName ?? "there"}! 👋
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Manage your courses, assessments, and track student progress.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" disabled>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  New Assessment
                </Button>
                <Button disabled>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Courses
                    </p>
                    <p className="text-2xl font-bold">{courses.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold">{totalStudents}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending Reviews
                    </p>
                    <p className="text-2xl font-bold">{pendingReviews}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Avg. Completion
                    </p>
                    <p className="text-2xl font-bold">{avgCompletion}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Courses</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/courses">View All</Link>
              </Button>
            </div>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Card
                    key={course.courseId}
                    className="border-border hover:border-primary/50 transition-all hover:shadow-md group"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        <Link href={`/courses/${course.courseId}`}>
                          {course.courseName}
                        </Link>
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {course.enrollmentCount} students
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(course.averageCompletionRate)}% avg
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href={`/courses/${course.courseId}`}>
                          Manage Course
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No courses created yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-4">
                    Start creating your first course to share knowledge with
                    students.
                  </p>
                  <Button disabled>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Course
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Course & Lesson Management
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-border opacity-70">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-xl bg-muted transition-colors">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="font-semibold">Create New Course</h3>
                      <Badge variant="outline" className="text-[10px]">
                        Soon
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Start a new course with modules and lessons
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border opacity-70">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-xl bg-muted transition-colors">
                    <FolderPlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="font-semibold">Add Module/Lesson</h3>
                      <Badge variant="outline" className="text-[10px]">
                        Soon
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add content to your existing courses
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border opacity-70">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-xl bg-muted transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="font-semibold">Upload Content</h3>
                      <Badge variant="outline" className="text-[10px]">
                        Soon
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add PDFs, videos, and other materials
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Assessments</h2>
              <Button variant="ghost" size="sm" disabled>
                View All
              </Button>
            </div>
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No assessments created yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                  Create MCQ-based assessments to evaluate student
                  understanding.
                </p>
                <Button disabled>
                  <Plus className="mr-2 h-4 w-4" />
                  Create MCQ Assessment
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Class Progress Overview
            </h2>
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No published courses yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Publish your courses to start tracking student progress.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">AR/VR Lessons</h2>
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No AR/VR lessons yet. Create immersive content in the section
                  below.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <ARCreationSection />
            <AIInsightsSection />
          </div>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Unauthorized access to Teacher Dashboard
      </div>
    );
  }
}
