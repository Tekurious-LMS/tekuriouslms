// import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  BookOpen,
  Users,
  Target,
  TrendingUp,
  Plus,
  // FileText,
  Upload,
  ClipboardList,
  BarChart3,
  // Cuboid,
  CheckCircle2,
  Clock,
  // ArrowRight,
  GraduationCap,
  FolderPlus,
} from "lucide-react";
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
  const session = await auth.api.getSession();

  if (
    !session ||
    (session.user as unknown as { role?: string }).role?.toLowerCase() !==
      "teacher"
  ) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Unauthorized access to Teacher Dashboard
      </div>
    );
  }

  // const userName = session.user.name || "Teacher";

  // Mock data - replace with actual API calls in backend integration
  const stats = {
    activeCourses: 3,
    totalStudents: 128,
    pendingReviews: 12,
    avgCompletion: 76,
  };

  const courses = [
    {
      id: 1,
      title: "Advanced Physics - Mechanics",
      subject: "Physics",
      class: "Grade 11",
      students: 45,
      status: "published",
      completion: 68,
    },
    {
      id: 2,
      title: "Introduction to Calculus",
      subject: "Mathematics",
      class: "Grade 12",
      students: 38,
      status: "published",
      completion: 82,
    },
    {
      id: 3,
      title: "Organic Chemistry Basics",
      subject: "Chemistry",
      class: "Grade 11",
      students: 45,
      status: "draft",
      completion: 0,
    },
  ];

  const assessments = [
    {
      id: 1,
      name: "Newton&apos;s Laws Quiz",
      course: "Advanced Physics",
      type: "MCQ",
      submissions: 42,
      total: 45,
      pending: 3,
    },
    {
      id: 2,
      name: "Derivatives Test",
      course: "Introduction to Calculus",
      type: "MCQ",
      submissions: 38,
      total: 38,
      pending: 0,
    },
    {
      id: 3,
      name: "Organic Compounds&apos; Quiz",
      course: "Organic Chemistry",
      type: "MCQ",
      submissions: 12,
      total: 45,
      pending: 33,
    },
  ];

  const arvrLessons = [
    {
      id: 1,
      title: "3D Molecular Structures",
      subject: "Chemistry",
      type: "AR Model",
    },
    {
      id: 2,
      title: "Physics Simulation Lab",
      subject: "Physics",
      type: "VR Experience",
    },
    {
      id: 3,
      title: "Mathematical Visualizations",
      subject: "Mathematics",
      type: "AR Interactive",
    },
  ];

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 1. TEACHING OVERVIEW SECTION */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome back, {session.user?.name ?? "there"}! 👋
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

          {/* Quick Stats Grid */}
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
                  <p className="text-2xl font-bold">{stats.activeCourses}</p>
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
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
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
                  <p className="text-2xl font-bold">{stats.pendingReviews}</p>
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
                  <p className="text-2xl font-bold">{stats.avgCompletion}%</p>
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
                      <Badge
                        variant={
                          course.status === "published"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {course.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{course.students} students</span>
                      </div>
                      {course.status === "published" && (
                        <span className="text-muted-foreground">
                          {course.completion}% avg
                        </span>
                      )}
                    </div>
                    <Button className="w-full" variant="outline" disabled>
                      Manage Course
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

        {/* 3. COURSE & LESSON MANAGEMENT SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Course & Lesson Management</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Create New Course */}
            <Card className="border-border opacity-70">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-xl bg-muted transition-colors">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-semibold transition-colors">
                      Create New Course
                    </h3>
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

            {/* Add Module/Lesson */}
            <Card className="border-border opacity-70">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-xl bg-muted transition-colors">
                  <FolderPlus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-semibold transition-colors">
                      Add Module/Lesson
                    </h3>
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

            {/* Upload Content */}
            <Card className="border-border opacity-70">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-xl bg-muted transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-semibold transition-colors">
                      Upload Content
                    </h3>
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

        {/* 4. ASSESSMENTS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Assessments</h2>
            <Button variant="ghost" size="sm" disabled>
              View All
            </Button>
          </div>

          {assessments.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {assessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-medium">{assessment.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {assessment.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-xs text-muted-foreground">
                              {assessment.course}
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className="h-3 w-3 text-primary" />
                              <span className="text-muted-foreground">
                                {assessment.submissions}/{assessment.total}{" "}
                                submitted
                              </span>
                            </div>
                            {assessment.pending > 0 && (
                              <div className="flex items-center gap-1 text-xs">
                                <Clock className="h-3 w-3 text-amber-600 dark:text-amber-500" />
                                <span className="text-amber-600 dark:text-amber-500">
                                  {assessment.pending} pending
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" disabled>
                          View Submissions
                        </Button>
                        <Button size="sm" disabled>
                          View Scores
                        </Button>
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
          )}
        </div>

        {/* 5. CLASS PROGRESS OVERVIEW SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Class Progress Overview</h2>

          {courses.filter((c) => c.status === "published").length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {courses
                .filter((c) => c.status === "published")
                .map((course) => (
                  <Card key={course.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>
                        {course.students} students enrolled
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Average Completion
                          </span>
                          <span className="font-semibold">
                            {course.completion}%
                          </span>
                        </div>
                        <Progress value={course.completion} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium">
                              {Math.floor(course.students * 0.7)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Active learners
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium">
                              {Math.floor(course.students * 0.85)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Assessments done
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
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
          )}
        </div>

        {/* 6. AR/VR LESSONS */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">AR/VR Lessons</h2>
          {arvrLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {arvrLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className="border-border hover:border-primary/50 transition-all"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{lesson.title}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {lesson.subject}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {lesson.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant="outline"
                      size="sm"
                      disabled
                    >
                      Open Lesson
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No AR/VR lessons yet. Create immersive content in the section
                  below.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 7. IMMERSIVE LEARNING & AI SUPPORT (PHASE-2) */}
        <div className="space-y-8">
          <ARCreationSection />
          <AIInsightsSection />
        </div>
      </div>
    </div>
  );
}
