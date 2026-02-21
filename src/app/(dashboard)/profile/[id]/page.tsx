"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Calendar } from "lucide-react";
import { PaymentHistory } from "@/components/profile/PaymentHistory";
import {
  useUserDetailQuery,
  useStudentProgressQuery,
  usePaymentsQuery,
} from "@/hooks/use-api";

export default function StudentProfilePage() {
  const params = useParams();
  const userId = params?.id as string | undefined;
  const { data: user, isLoading } = useUserDetailQuery(userId ?? null, !!userId);
  const isStudent = !!user?.studentProfile;
  const { data: progress } = useStudentProgressQuery(
    isStudent ? userId ?? null : null,
    !!userId && isStudent,
  );
  const { data: payments } = usePaymentsQuery(!!userId);

  const completion = useMemo(() => {
    const courses = progress?.courses ?? [];
    if (courses.length === 0) return 0;
    const done = courses.reduce((sum, c) => sum + c.completedLessons, 0);
    const total = courses.reduce((sum, c) => sum + c.totalLessons, 0);
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [progress?.courses]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!user) return <div>User not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
          <AvatarImage src={user.avatar || undefined} alt={user.name} />
          <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-2 flex-1">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {(user.roles ?? []).map((r) => (
                <Badge key={r} variant="outline">
                  {r}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" /> {user.email}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Joined{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Academic History</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progress?.courses.length ?? 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progress?.assessments.length ?? 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completion}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Class</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {user.studentProfile?.className ?? "N/A"}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-3">
            {(progress?.assessments ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No assessment attempts available.
              </p>
            ) : (
              (progress?.assessments ?? []).map((attempt) => (
                <Card key={`${attempt.assessmentId}-${attempt.submittedAt}`}>
                  <CardContent className="py-4">
                    <p className="font-medium">{attempt.assessmentTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {attempt.courseName} • {attempt.score}/{attempt.totalQuestions}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <PaymentHistory payments={payments ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

