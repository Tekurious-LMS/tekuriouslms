import {
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { requireServerRBAC } from "@/lib/server-rbac";
import { Role } from "@/lib/rbac-types";
import { getStudentProgress } from "@/lib/progress-repository";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ARLearningSection } from "@/components/placeholders/ARLearningSection";

export default async function StudentDashboard() {
  let context: Awaited<ReturnType<typeof requireServerRBAC>>;
  let progress: Awaited<ReturnType<typeof getStudentProgress>>;

  try {
    context = await requireServerRBAC([Role.STUDENT]);
    progress = await getStudentProgress(context, context.userId);
  } catch {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Unauthorized access to Student Dashboard
      </div>
    );
  }

  const courses = progress.courses;
  const assessments = progress.assessments;
  const enrolledCount = courses.length;
  const completedLessons = courses.reduce(
    (sum, c) => sum + c.completedLessons,
    0,
  );
  const pendingAssessments = assessments.filter((a) => !a.completed).length;
  const completionRate =
    courses.length > 0
      ? Math.round(
          (courses.reduce((s, c) => s + c.completedLessons, 0) /
            courses.reduce((s, c) => s + c.totalLessons, 0)) *
            100,
        )
      : 0;

  return (
      <div className="w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome back, {context.userName ?? "there"}! 👋
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Continue your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Courses Enrolled
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{enrolledCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Lessons
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{completedLessons}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Assessments
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{pendingAssessments}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold">My Courses</h2>
              {courses.length === 0 ? (
                <p className="text-muted-foreground">No courses enrolled.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {courses.slice(0, 4).map((course) => {
                    const pct =
                      course.totalLessons > 0
                        ? Math.round(
                            (course.completedLessons / course.totalLessons) *
                              100,
                          )
                        : 0;
                    return (
                      <Card key={course.courseId}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            <Link href={`/courses/${course.courseId}`}>
                              {course.courseName}
                            </Link>
                          </CardTitle>
                          <CardDescription>
                            {course.completedLessons}/{course.totalLessons}{" "}
                            lessons
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Progress value={pct} className="h-2" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <ARLearningSection />
        </div>
      </div>
    );
}
