import {
  Users,
  GraduationCap,
  Building2,
  Activity,
  Settings,
  UserPlus,
  Shield,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { requireServerRBAC } from "@/lib/server-rbac";
import { Role } from "@/lib/rbac-types";
import { getAdminAnalytics } from "@/lib/progress-repository";
import { getAuditLogs, type AuditLogEntry } from "@/lib/audit-log-repository";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ARAnalyticsSection } from "@/components/placeholders/ARAnalyticsSection";
import { AIInsightsSection } from "@/components/placeholders/AIInsightsSection";
import { formatDistanceToNow } from "date-fns";
import { normalizeRoleForUI } from "@/lib/role-mapping";

function StatsGrid({
  analytics,
}: {
  analytics: Awaited<ReturnType<typeof getAdminAnalytics>>;
}) {
  const adoptionRate = Math.round(
    (analytics.activeStudents / Math.max(analytics.totalStudents, 1)) * 100,
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Students
            </p>
            <p className="text-2xl font-bold">{analytics.totalStudents}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Active Students
            </p>
            <p className="text-2xl font-bold">{analytics.activeStudents}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Active Courses
            </p>
            <p className="text-2xl font-bold">{analytics.totalCourses}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Adoption Rate
            </p>
            <p className="text-2xl font-bold">{adoptionRate}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AuditLogTable({ logs }: { logs: AuditLogEntry[] }) {
  const actionLabels: Record<string, string> = {
    CLASS_CREATED: "Created new class",
    CLASS_UPDATED: "Updated class",
    SUBJECT_CREATED: "Created new subject",
    SUBJECT_UPDATED: "Updated subject",
    SUBJECT_MAPPED: "Mapped subject to class",
    USER_INVITED: "Invited user",
    COURSE_CREATED: "Created course",
    LESSON_CREATED: "Created lesson",
    ASSESSMENT_CREATED: "Created assessment",
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Action</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={3}
              className="text-center text-muted-foreground py-8"
            >
              No audit logs yet
            </TableCell>
          </TableRow>
        ) : (
          logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">
                {actionLabels[log.actionType] ?? log.actionType}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {normalizeRoleForUI(log.actorRole) ?? log.actorRole}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDistanceToNow(new Date(log.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default async function AdminDashboardPage() {
  let context: Awaited<ReturnType<typeof requireServerRBAC>>;
  let analytics: Awaited<ReturnType<typeof getAdminAnalytics>>;
  let auditResult: Awaited<ReturnType<typeof getAuditLogs>>;

  try {
    context = await requireServerRBAC([Role.ADMIN]);
    [analytics, auditResult] = await Promise.all([
      getAdminAnalytics(context),
      getAuditLogs(context, 1, 10),
    ]);
  } catch {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Unauthorized access to Admin Dashboard
      </div>
    );
  }

  const adoptionMetrics = [
    {
      label: "Student Enrollment",
      value: Math.round(
        (analytics.activeStudents / Math.max(analytics.totalStudents, 1)) * 100,
      ),
    },
    {
      label: "Lesson Completion",
      value: analytics.averageCourseCompletion,
    },
    {
      label: "Assessment Participation",
      value: analytics.averageAssessmentCompletion,
    },
  ];

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Admin Console
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Overview of organization health, users, and system settings.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" disabled>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Link href="/users">
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
            </div>
          </div>

          <StatsGrid analytics={analytics} />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">User Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/users">
              <Card className="border-border hover:bg-muted/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-xl bg-muted transition-colors">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">View Directory</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage roles and user status
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Card className="border-border opacity-70 h-full">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-xl bg-muted">
                  <UserPlus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-semibold">Invite Users</h3>
                    <Badge variant="outline" className="text-[10px]">
                      Soon
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add new students, teachers, or staff
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border opacity-70 h-full">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-xl bg-muted">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-semibold">Access Control</h3>
                    <Badge variant="outline" className="text-[10px]">
                      Soon
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Review permissions and requests
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Academic Structure</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Class Configuration</CardTitle>
              <CardDescription>
                Manage grades, subjects, and curriculum mapping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/structure" className="block">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-medium">Manage Structure</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Platform Adoption</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adoptionMetrics.map((metric, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{metric.value}%</div>
                  <Progress value={metric.value} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Audit Logs</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <AuditLogTable logs={auditResult.logs} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ARAnalyticsSection />
          <AIInsightsSection />
        </div>
      </div>
    </div>
  );
}
