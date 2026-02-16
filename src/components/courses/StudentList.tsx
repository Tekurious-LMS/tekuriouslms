import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCourseStudentsQuery } from "@/hooks/use-api";

interface StudentListProps {
  courseId: string | null;
}

export function StudentList({ courseId }: StudentListProps) {
  const { data: students, isLoading } = useCourseStudentsQuery(courseId);

  if (isLoading) {
    return (
      <div className="rounded-md border p-8">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 bg-muted animate-pulse rounded"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!students?.length) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No students enrolled in this course.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {student.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{student.name}</span>
              </TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${student.status === "Active" ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-950/50 dark:text-green-400" : "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950/50 dark:text-red-400"}`}
                >
                  {student.status ?? "Active"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
