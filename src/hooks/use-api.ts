import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

// Types for API responses
export interface UsersByRole {
  admins: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    roles?: string[];
  }>;
  teachers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    roles?: string[];
  }>;
  students: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    roles?: string[];
  }>;
  parents: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    roles?: string[];
  }>;
}

export interface AdminAnalytics {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  totalAssessments: number;
  averageCourseCompletion: number;
  averageAssessmentCompletion: number;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorRole: string;
  actionType: string;
  resourceType: string;
  resourceId: string | null;
  metadata: unknown;
  createdAt: string;
}

export interface AuditLogsResponse {
  logs: AuditLogEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TeacherAnalytics {
  courses: Array<{
    courseId: string;
    courseName: string;
    enrollmentCount: number;
    averageCompletionRate: number;
    totalLessons: number;
    assessmentCount: number;
    assessmentParticipation: number;
  }>;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  courses: Array<{
    courseId: string;
    courseName: string;
    totalLessons: number;
    completedLessons: number;
  }>;
  assessments: Array<{
    assessmentId: string;
    assessmentTitle: string;
    courseName: string;
    completed: boolean;
    score: number;
    totalQuestions: number;
    submittedAt: string;
  }>;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  teacherId: string;
  classId: string;
  subjectId: string;
  teacher?: { id: string; name: string };
  class?: { id: string; name: string };
  subject?: { id: string; name: string };
}

export interface CourseStudent {
  id: string;
  name: string;
  email: string;
  status?: string;
}

const queryKeys = {
  users: ["users"] as const,
  adminAnalytics: ["adminAnalytics"] as const,
  auditLogs: (page?: number) => ["auditLogs", page] as const,
  courses: ["courses"] as const,
  course: (id: string) => ["course", id] as const,
  courseStudents: (courseId: string) => ["courseStudents", courseId] as const,
  assessments: ["assessments"] as const,
  structure: ["structure"] as const,
  teacherAnalytics: ["teacherAnalytics"] as const,
  studentProgress: (studentId: string) =>
    ["studentProgress", studentId] as const,
  parentStudents: ["parentStudents"] as const,
};

export function useUsersQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiFetch<UsersByRole>("/api/admin/users"),
    enabled,
  });
}

export function useAdminAnalyticsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.adminAnalytics,
    queryFn: () => apiFetch<AdminAnalytics>("/api/analytics/admin"),
    enabled,
  });
}

export function useAuditLogsQuery(page = 1, enabled = true) {
  return useQuery({
    queryKey: queryKeys.auditLogs(page),
    queryFn: () =>
      apiFetch<AuditLogsResponse>(`/api/audit-logs?page=${page}&limit=10`),
    enabled,
  });
}

export function useCoursesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.courses,
    queryFn: () => apiFetch<Course[]>("/api/courses"),
    enabled,
  });
}

export function useCourseQuery(courseId: string | null, enabled = true) {
  return useQuery({
    queryKey: queryKeys.course(courseId ?? ""),
    queryFn: () =>
      apiFetch<Course & { modules?: unknown[]; lessons?: unknown[] }>(
        `/api/courses/${courseId}`,
      ),
    enabled: enabled && !!courseId,
  });
}

export function useCourseStudentsQuery(
  courseId: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.courseStudents(courseId ?? ""),
    queryFn: () =>
      apiFetch<CourseStudent[]>(`/api/courses/${courseId}/students`),
    enabled: enabled && !!courseId,
  });
}

export function useAssessmentsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.assessments,
    queryFn: () => apiFetch<unknown[]>("/api/assessments"),
    enabled,
  });
}

export interface StructureTree {
  classes: Array<{
    id: string;
    name: string;
    sections: Array<{ id: string; name: string }>;
    subjects: Array<{ id: string; name: string }>;
  }>;
  subjects: Array<{ id: string; name: string }>;
  mappings: Array<{ id: string; classId: string; subjectId: string }>;
}

export function useStructureQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.structure,
    queryFn: () => apiFetch<StructureTree>("/api/structure"),
    enabled,
  });
}

export function useTeacherAnalyticsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.teacherAnalytics,
    queryFn: () => apiFetch<TeacherAnalytics>("/api/analytics/teacher"),
    enabled,
  });
}

export function useStudentProgressQuery(
  studentId: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.studentProgress(studentId ?? ""),
    queryFn: () =>
      apiFetch<StudentProgress>(`/api/analytics/student/${studentId}`),
    enabled: enabled && !!studentId,
  });
}

export interface ParentStudent {
  id: string;
  name: string;
  studentProfile?: { class?: { name: string } };
}

export function useParentStudentsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.parentStudents,
    queryFn: () =>
      apiFetch<
        Array<ParentStudent & { student?: { id: string; name: string } }>
      >("/api/parents/students"),
    enabled,
  });
}

export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  return {
    invalidateUsers: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users }),
    invalidateAdminAnalytics: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.adminAnalytics }),
    invalidateAuditLogs: () =>
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] }),
    invalidateCourses: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.courses }),
    invalidateCourse: (id: string) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.course(id) }),
    invalidateCourseStudents: (courseId: string) =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.courseStudents(courseId),
      }),
    invalidateAssessments: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.assessments }),
    invalidateStructure: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.structure }),
  };
}
