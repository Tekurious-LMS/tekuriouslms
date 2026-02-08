// import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  BookOpen,
  Target,
  TrendingUp,
  ArrowRight,
  // Cuboid,
  Clock,
  CheckCircle2,
  PlayCircle,
  Calendar,
  Award,
  // GraduationCap,
} from "lucide-react";
// import Link from "next/link";
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
import { ARLearningSection } from "@/components/placeholders/ARLearningSection";

export default async function StudentDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    !session ||
    (session.user as unknown as { role?: string }).role?.toLowerCase() !==
      "student"
  ) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Unauthorized access to Student Dashboard
      </div>
    );
  }

  // const userName = session.user.name || "Student";
  const userOrganization =
    (session.user as unknown as { schoolName?: string }).schoolName ||
    "Tekurious Academy";

  // Mock data - replace with actual API calls in backend integration
  const stats = {
    enrolledCourses: 4,
    completedLessons: 12,
    pendingAssessments: 3,
    completionRate: 65,
  };

  const courses = [
    {
      id: 1,
      title: "Physics - Mechanics",
      subject: "Physics",
      class: "Grade 10",
      progress: 75,
      totalLessons: 20,
      completedLessons: 15,
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      subject: "Mathematics",
      class: "Grade 10",
      progress: 60,
      totalLessons: 25,
      completedLessons: 15,
    },
    {
      id: 3,
      title: "Cell Biology",
      subject: "Biology",
      class: "Grade 10",
      progress: 45,
      totalLessons: 18,
      completedLessons: 8,
    },
    {
      id: 4,
      title: "World History",
      subject: "History",
      class: "Grade 10",
      progress: 30,
      totalLessons: 22,
      completedLessons: 7,
    },
  ];

  const lastLesson = {
    title: "Newton&apos;s Third Law of Motion",
    course: "Physics - Mechanics",
    progress: 65,
    timeLeft: "15 min remaining",
  };

  const upcomingAssessments = [
    {
      id: 1,
      name: "Algebra Fundamentals Quiz",
      course: "Advanced Mathematics",
      dueDate: "Tomorrow",
      status: "pending",
    },
    {
      id: 2,
      name: "Cell Structure Assignment",
      course: "Cell Biology",
      dueDate: "In 3 days",
      status: "pending",
    },
    {
      id: 3,
      name: "Newton&apos;s Laws Test",
      course: "Physics - Mechanics",
      dueDate: "Next week",
      status: "pending",
    },
  ];

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 1. WELCOME / OVERVIEW SECTION */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome back, {session.user.name}! 👋
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                {userOrganization} • Ready to continue your learning journey?
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Enrolled Courses
                  </p>
                  <p className="text-2xl font-bold">{stats.enrolledCourses}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed Lessons
                  </p>
                  <p className="text-2xl font-bold">{stats.completedLessons}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Assessments
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.pendingAssessments}
                  </p>
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
                    Completion Rate
                  </p>
                  <p className="text-2xl font-bold">{stats.completionRate}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 2. MY COURSES SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My Courses</h2>
            <Button variant="ghost" size="sm" disabled>
              View All
            </Button>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="border-border hover:border-primary/50 transition-all hover:shadow-md group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {course.subject}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.class}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {course.completedLessons} of {course.totalLessons}{" "}
                        lessons completed
                      </p>
                    </div>
                    <Button className="w-full" disabled>
                      Continue Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
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
                  No courses assigned yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Your courses will appear here once your teacher assigns them
                  to you.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 3. CONTINUE LEARNING SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Continue Learning</h2>

          {lastLesson ? (
            <Card className="border-primary/20 bg-primary/5 hover:border-primary/50 transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <PlayCircle className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">
                        {lastLesson.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {lastLesson.course}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Lesson Progress
                          </span>
                          <span className="font-semibold">
                            {lastLesson.progress}%
                          </span>
                        </div>
                        <Progress value={lastLesson.progress} className="h-2" />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {lastLesson.timeLeft}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button size="lg" disabled>
                    Resume Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <PlayCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No recent activity
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Start a lesson from your courses to see your progress here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 4. PROGRESS OVERVIEW SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Progress Overview</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Course Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Completion</CardTitle>
                <CardDescription>
                  Your progress across all enrolled courses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.slice(0, 3).map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate">
                        {course.title}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        {course.progress}%
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Assessment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assessment Status</CardTitle>
                <CardDescription>
                  Track your quiz and assignment completion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Completed</p>
                      <p className="text-xs text-muted-foreground">
                        This month
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Pending</p>
                      <p className="text-xs text-muted-foreground">Due soon</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold">
                    {stats.pendingAssessments}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 5. UPCOMING ASSESSMENTS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Upcoming Assessments</h2>
            <Button variant="ghost" size="sm" disabled>
              View All
            </Button>
          </div>

          {upcomingAssessments.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {upcomingAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{assessment.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-muted-foreground">
                              {assessment.course}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {assessment.dueDate}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            assessment.status === "pending"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {assessment.status === "pending"
                            ? "Pending"
                            : "Completed"}
                        </Badge>
                        {assessment.status === "pending" && (
                          <Button size="sm" disabled>
                            Attempt
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No upcoming assessments
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  You&apos;re all caught up! New assessments will appear here
                  when assigned.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 6. IMMERSIVE LEARNING (AR/VR) - PLACEHOLDER SECTION */}
        <ARLearningSection />
      </div>
    </div>
  );
}
