/**
 * Phase 1 LMS - Comprehensive Seed
 * Seeds dummy data for proof of work across all SOP entities.
 * Idempotent: safe to run multiple times.
 */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const ROLES = [
  "Platform Admin",
  "School Admin",
  "Teacher",
  "Student",
  "Parent",
];

async function main() {
  console.log("🌱 Phase 1 LMS Seed - Starting...\n");

  // 1. Tenant
  const defaultTenant = await prisma.tenant.upsert({
    where: { slug: "default" },
    update: {},
    create: { name: "Default Organization", slug: "default" },
  });
  const tenantId = defaultTenant.id;
  console.log("✅ Tenant:", defaultTenant.name);

  // 2. Roles (SOP: Platform Admin, School Admin, Teacher, Student)
  const roles = {};
  for (const name of ROLES) {
    const existing = await prisma.role.findFirst({ where: { roleName: name } });
    if (!existing) {
      const created = await prisma.role.create({ data: { roleName: name } });
      roles[name] = created.id;
    } else {
      roles[name] = existing.id;
    }
  }
  console.log("✅ Roles:", Object.keys(roles).join(", "));

  // 3. Board & School
  let board = await prisma.board.findFirst({ where: { tenantId } });
  if (!board) {
    board = await prisma.board.create({ data: { name: "CBSE", tenantId } });
  }
  const boardId = board.id;

  const school =
    (await prisma.school.findFirst({ where: { tenantId } })) ||
    (await prisma.school.create({
      data: { name: "Tekurious Academy", tenantId, boardId },
    }));
  console.log("✅ Board:", board?.name, "| School:", school.name);

  // 4. Classes & Subjects
  const classes = await Promise.all(
    ["Class 9", "Class 10", "Class 11"].map(async (name) => {
      const c = await prisma.class.findFirst({
        where: { name, tenantId },
      });
      return (
        c ||
        prisma.class.create({
          data: { name, tenantId, schoolId: school.id },
        })
      );
    }),
  );

  const subjects = await Promise.all(
    ["Mathematics", "Physics", "Chemistry", "English"].map(async (name) => {
      const s = await prisma.subject.findFirst({
        where: { name, tenantId },
      });
      return s || prisma.subject.create({ data: { name, tenantId } });
    }),
  );
  console.log("✅ Classes:", classes.length, "| Subjects:", subjects.length);

  // 5. Chapters & Topics (per subject)
  for (const subject of subjects) {
    const ch = await prisma.chapter.findFirst({
      where: { subjectId: subject.id, tenantId },
    });
    if (!ch) {
      const chapter = await prisma.chapter.create({
        data: {
          name: `${subject.name} - Chapter 1`,
          subjectId: subject.id,
          tenantId,
          orderIndex: 1,
        },
      });
      await prisma.topic.createMany({
        data: [
          { name: "Topic 1.1", chapterId: chapter.id, tenantId, orderIndex: 1 },
          { name: "Topic 1.2", chapterId: chapter.id, tenantId, orderIndex: 2 },
        ],
      });
    }
  }
  console.log("✅ Chapters & Topics created");

  // 6. Class-Subject mapping
  for (const c of classes) {
    for (const s of subjects.slice(0, 2)) {
      const exists = await prisma.classSubject.findFirst({
        where: { classId: c.id, subjectId: s.id, tenantId },
      });
      if (!exists) {
        await prisma.classSubject.create({
          data: { classId: c.id, subjectId: s.id, tenantId },
        });
      }
    }
  }
  console.log("✅ Class-Subject mappings");

  // 7. Users with roles
  const teacherRoleId = roles["Teacher"] || Object.values(roles)[0];
  const studentRoleId = roles["Student"] || Object.values(roles)[1];
  const adminRoleId =
    roles["Platform Admin"] || roles["School Admin"] || Object.values(roles)[0];

  const teacher =
    (await prisma.lmsUser.findFirst({
      where: { email: "teacher@tekurious.demo", tenantId },
    })) ||
    (await prisma.lmsUser.create({
      data: {
        name: "Demo Teacher",
        email: "teacher@tekurious.demo",
        phone: "+91 9876543210",
        tenantId,
      },
    }));

  const students = await Promise.all(
    ["Alice", "Bob", "Charlie", "Diana", "Eve"].map(async (name, i) => {
      const email = `student${i + 1}@tekurious.demo`;
      const u = await prisma.lmsUser.findFirst({
        where: { email, tenantId },
      });
      return (
        u ||
        prisma.lmsUser.create({
          data: { name, email, tenantId },
        })
      );
    }),
  );

  const adminUser =
    (await prisma.lmsUser.findFirst({
      where: { email: "admin@tekurious.demo", tenantId },
    })) ||
    (await prisma.lmsUser.create({
      data: {
        name: "Platform Admin",
        email: "admin@tekurious.demo",
        tenantId,
      },
    }));

  // Assign roles
  const assignRole = async (userId, roleId) => {
    const exists = await prisma.userRole.findFirst({
      where: { userId, roleId },
    });
    if (!exists) {
      await prisma.userRole.create({ data: { userId, roleId } });
    }
  };
  await assignRole(teacher.id, teacherRoleId);
  await assignRole(adminUser.id, adminRoleId);
  for (const s of students) {
    await assignRole(s.id, studentRoleId);
  }
  console.log("✅ Users: 1 admin, 1 teacher, 5 students");

  // 8. Student profiles
  for (const s of students.slice(0, 4)) {
    const exists = await prisma.studentProfile.findFirst({
      where: { userId: s.id },
    });
    if (!exists) {
      await prisma.studentProfile.create({
        data: {
          userId: s.id,
          classId: classes[0].id,
          tenantId,
          academicHistory: { previousSchool: "Demo School", grade: "A" },
          engagementScore: 75 + Math.floor(Math.random() * 20),
        },
      });
    }
  }
  console.log("✅ Student profiles");

  // 9. Courses
  const course =
    (await prisma.course.findFirst({
      where: { tenantId, teacherId: teacher.id },
    })) ||
    (await prisma.course.create({
      data: {
        title: "Mathematics - Class 9",
        description: "Complete mathematics curriculum for Class 9",
        teacherId: teacher.id,
        classId: classes[0].id,
        subjectId: subjects[0].id,
        tenantId,
      },
    }));

  const module1 =
    (await prisma.module.findFirst({
      where: { courseId: course.id },
    })) ||
    (await prisma.module.create({
      data: {
        title: "Module 1: Algebra",
        orderIndex: 1,
        courseId: course.id,
        tenantId,
      },
    }));

  const lessons = await prisma.lesson.findMany({
    where: { courseId: course.id },
  });
  if (lessons.length === 0) {
    await prisma.lesson.createMany({
      data: [
        {
          title: "Introduction to Algebra",
          contentType: "TEXT",
          content: "Algebra is the branch of mathematics...",
          duration: 30,
          moduleId: module1.id,
          courseId: course.id,
          tenantId,
        },
        {
          title: "Linear Equations",
          contentType: "VIDEO",
          content: "Video content URL",
          duration: 45,
          moduleId: module1.id,
          courseId: course.id,
          tenantId,
        },
      ],
    });
  }
  console.log("✅ Course, modules, lessons");

  // 10. Enrollments
  for (const s of students) {
    const exists = await prisma.enrollment.findFirst({
      where: { userId: s.id, courseId: course.id },
    });
    if (!exists) {
      await prisma.enrollment.create({
        data: {
          userId: s.id,
          courseId: course.id,
          tenantId,
          progress: Math.random() * 100,
          status: "ACTIVE",
        },
      });
    }
  }
  console.log("✅ Enrollments");

  // 11. Assessment with questions
  const assessment =
    (await prisma.assessment.findFirst({
      where: { courseId: course.id },
    })) ||
    (await prisma.assessment.create({
      data: {
        title: "Algebra Quiz 1",
        type: "MCQ",
        totalMarks: 100,
        courseId: course.id,
        tenantId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }));

  const qCount = await prisma.assessmentQuestion.count({
    where: { assessmentId: assessment.id },
  });
  if (qCount === 0) {
    await prisma.assessmentQuestion.createMany({
      data: [
        {
          assessmentId: assessment.id,
          questionText: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctOptionIndex: 1,
          tenantId,
        },
        {
          assessmentId: assessment.id,
          questionText: "Solve: x + 5 = 10",
          options: ["3", "5", "10", "15"],
          correctOptionIndex: 1,
          tenantId,
        },
      ],
    });
  }
  console.log("✅ Assessment with questions");

  // 12. Submissions (attempts)
  for (const s of students.slice(0, 3)) {
    const count = await prisma.submission.count({
      where: { studentId: s.id, assessmentId: assessment.id },
    });
    if (count === 0) {
      await prisma.submission.create({
        data: {
          assessmentId: assessment.id,
          studentId: s.id,
          tenantId,
          attemptNumber: 1,
          answers: [1, 1],
          score: 70 + Math.floor(Math.random() * 25),
          status: "COMPLETED",
        },
      });
    }
  }
  console.log("✅ Submissions (attempts)");

  // 13. Progress
  const lessonList = await prisma.lesson.findMany({
    where: { courseId: course.id },
    take: 1,
  });
  if (lessonList.length > 0) {
    for (const s of students.slice(0, 2)) {
      const exists = await prisma.progress.findFirst({
        where: {
          studentId: s.id,
          lessonId: lessonList[0].id,
          tenantId,
        },
      });
      if (!exists) {
        await prisma.progress.create({
          data: {
            studentId: s.id,
            lessonId: lessonList[0].id,
            courseId: course.id,
            tenantId,
            status: "COMPLETED",
          },
        });
      }
    }
  }
  console.log("✅ Progress records");

  // 14. Student Analytics & Rankings
  for (const s of students.slice(0, 3)) {
    const exists = await prisma.studentAnalytics.findFirst({
      where: { userId: s.id },
    });
    if (!exists) {
      await prisma.studentAnalytics.create({
        data: {
          userId: s.id,
          tenantId,
          avgScore: 72 + Math.random() * 20,
          weakTopics: "Quadratic Equations, Trigonometry",
        },
      });
    }
  }

  const rankScopes = ["class-level", "school-level", "global-level"];
  for (let i = 0; i < Math.min(3, students.length); i++) {
    const exists = await prisma.ranking.findFirst({
      where: { userId: students[i].id, scope: rankScopes[0] },
    });
    if (!exists) {
      await prisma.ranking.create({
        data: {
          userId: students[i].id,
          tenantId,
          scope: rankScopes[0],
          rank: i + 1,
        },
      });
    }
  }
  console.log("✅ Analytics & Rankings");

  // 15. Subscription & Payment
  const sub =
    (await prisma.subscription.findFirst({
      where: { schoolId: school.id },
    })) ||
    (await prisma.subscription.create({
      data: {
        planName: "Premium",
        status: "active",
        schoolId: school.id,
        tenantId,
      },
    }));

  const payCount = await prisma.payment.count({
    where: { subscriptionId: sub.id },
  });
  if (payCount === 0) {
    await prisma.payment.create({
      data: {
        amount: 9999,
        status: "completed",
        subscriptionId: sub.id,
        tenantId,
      },
    });
  }
  console.log("✅ Subscription & Payment");

  // 16. Notices
  const notice = await prisma.notice.findFirst({
    where: { tenantId },
  });
  if (!notice) {
    await prisma.notice.create({
      data: {
        title: "Welcome to Tekurious LMS",
        content:
          "This is a sample notice. All students are requested to complete their assignments on time.",
        category: "GENERAL",
        targetRoles: ["Student", "Teacher"],
        tenantId,
        createdBy: adminUser.id,
        publishedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log("✅ Notices");

  // 17. Notifications
  const notifCount = await prisma.notification.count({
    where: { tenantId },
  });
  if (notifCount === 0) {
    await prisma.notification.createMany({
      data: students.slice(0, 2).map((s) => ({
        userId: s.id,
        title: "New assessment available",
        body: "Algebra Quiz 1 has been assigned. Due in 7 days.",
        type: "assessment",
        tenantId,
      })),
    });
  }
  console.log("✅ Notifications");

  // 18. Scheduled Class & Session
  const schedClass = await prisma.scheduledClass.findFirst({
    where: { tenantId },
  });
  if (!schedClass) {
    const sc = await prisma.scheduledClass.create({
      data: {
        courseId: course.id,
        teacherId: teacher.id,
        tenantId,
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: "SCHEDULED",
      },
    });
    const session = await prisma.classSession.create({
      data: {
        scheduledClassId: sc.id,
        tenantId,
        startedAt: new Date(),
      },
    });
    for (const s of students.slice(0, 3)) {
      await prisma.attendance.create({
        data: {
          classSessionId: session.id,
          userId: s.id,
          tenantId,
          present: true,
        },
      });
    }
  }
  console.log("✅ Scheduled classes & attendance");

  // 19. Usage Logs
  const logCount = await prisma.usageLog.count({ where: { tenantId } });
  if (logCount === 0) {
    await prisma.usageLog.createMany({
      data: [
        {
          userId: students[0].id,
          type: "LOGIN",
          tenantId,
        },
        {
          userId: students[0].id,
          type: "CONTENT_ACCESS",
          resourceId: course.id,
          metadata: { durationMinutes: 15 },
          tenantId,
        },
        {
          userId: students[0].id,
          type: "ASSESSMENT_ATTEMPT",
          resourceId: assessment.id,
          metadata: { score: 85 },
          tenantId,
        },
      ],
    });
  }
  console.log("✅ Usage logs");

  console.log("\n🎉 Phase 1 LMS Seed complete! Proof of work ready.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
