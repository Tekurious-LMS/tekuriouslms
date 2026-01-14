export type Role = "Admin" | "Teacher" | "Student" | "Parent";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  schoolId?: string; // Optional for Super Admins
  status: "Active" | "Inactive";
}

export interface School {
  id: string;
  name: string;
  board: "CBSE" | "ICSE" | "State" | "IB";
}

export interface Course {
  id: string;
  title: string;
  subject: string;
  gradeLevel: number;
  schoolId: string;
  teacherId: string;
  progress?: number; // For students
  code: string;
}

export const schools: School[] = [
  { id: "sch_1", name: "Delhi Public School, Bangalore", board: "CBSE" },
  { id: "sch_2", name: "National Public School, Indiranagar", board: "CBSE" },
  { id: "sch_3", name: "The Valley School", board: "ICSE" },
];

export const users: User[] = [
  { id: "u1", name: "Rajesh Kumar", email: "rajesh.admin@dps.edu", role: "Admin", schoolId: "sch_1", status: "Active" },
  { id: "u2", name: "Priya Sharma", email: "priya.math@dps.edu", role: "Teacher", schoolId: "sch_1", status: "Active" },
  { id: "u3", name: "Suresh Patil", email: "suresh.sci@dps.edu", role: "Teacher", schoolId: "sch_1", status: "Active" },
  { id: "u4", name: "Aarav Singh", email: "aarav.s@student.dps.edu", role: "Student", schoolId: "sch_1", status: "Active" },
  { id: "u5", name: "Ananya Gupta", email: "ananya.g@student.dps.edu", role: "Student", schoolId: "sch_1", status: "Active" },
  { id: "u6", name: "Vihaan Reddy", email: "vihaan.r@student.dps.edu", role: "Student", schoolId: "sch_1", status: "Active" },
  { id: "u7", name: "Ishaan Verma", email: "ishaan.v@student.dps.edu", role: "Student", schoolId: "sch_1", status: "Inactive" },
  { id: "u8", name: "Amitabh Bachchan", email: "amitabh.admin@nps.edu", role: "Admin", schoolId: "sch_2", status: "Active" },
  { id: "u9", name: "Vikram Malhotra", email: "vikram.parent@gmail.com", role: "Parent", schoolId: "sch_1", status: "Active" }, // Parent of Aarav
];

export const courses: Course[] = [
  { id: "c1", title: "Mathematics Class 10", subject: "Math", gradeLevel: 10, schoolId: "sch_1", teacherId: "u2", progress: 65, code: "MTH-101" },
  { id: "c2", title: "Physics Class 10", subject: "Science", gradeLevel: 10, schoolId: "sch_1", teacherId: "u3", progress: 40, code: "SCI-PHY-102" },
  { id: "c3", title: "Chemistry Class 10", subject: "Science", gradeLevel: 10, schoolId: "sch_1", teacherId: "u3", progress: 20, code: "SCI-CHEM-103" },
  { id: "c4", title: "Mathematics Class 9", subject: "Math", gradeLevel: 9, schoolId: "sch_1", teacherId: "u2", progress: 0, code: "MTH-901" },
];
