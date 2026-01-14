"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const permissions = [
    { id: "p1", name: "Manage Users", description: "Create, edit, delete users" },
    { id: "p2", name: "Manage Courses", description: "Create and assign courses" },
    { id: "p3", name: "View Analytics", description: "Access school-wide analytics" },
    { id: "p4", name: "Take Assessments", description: "Participate in quizzes/exams" },
    { id: "p5", name: "Grade Assessments", description: "Evaluate student submissions" },
];

const roles = ["Admin", "Teacher", "Student"];

// Mock permission matrix: role -> permissionId[]
const rolePermissions: Record<string, string[]> = {
    Admin: ["p1", "p2", "p3", "p5"],
    Teacher: ["p2", "p4", "p5"], // Teacher can arguably take assessments too (testing)
    Student: ["p4"],
};

export function RBACMatrix() {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Permission</TableHead>
                        {roles.map((role) => (
                            <TableHead key={role} className="text-center">
                                {role}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {permissions.map((perm) => (
                        <TableRow key={perm.id}>
                            <TableCell>
                                <div className="font-medium">{perm.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {perm.description}
                                </div>
                            </TableCell>
                            {roles.map((role) => (
                                <TableCell key={role} className="text-center">
                                    <Checkbox
                                        checked={rolePermissions[role]?.includes(perm.id)}
                                        disabled // Read-only for this view as requested
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
