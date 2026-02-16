import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Course } from "@/hooks/use-api";
import { BookOpen } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const teacherName = course.teacher?.name ?? "—";
  const subjectName = course.subject?.name ?? course.subjectId;
  const className = course.class?.name ?? "—";

  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <div className="h-32 bg-slate-100 dark:bg-slate-800 relative rounded-t-lg flex items-center justify-center">
          <BookOpen className="h-10 w-10 text-slate-400" />
          <Badge className="absolute top-2 right-2" variant="secondary">
            {subjectName}
          </Badge>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {className} • {subjectName}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{teacherName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {teacherName}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
