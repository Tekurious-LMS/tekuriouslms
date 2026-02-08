import type { PrismaClient, Prisma } from ".prisma/client";
import { requireTenantContext } from "./tenant-context";

/**
 * Extended Prisma Client with tenant-aware query methods
 * This wrapper automatically injects tenantId into all queries
 */
export class TenantPrismaClient {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get the current tenant ID from context
   */
  private getTenantId(): string {
    const context = requireTenantContext();
    return context.tenantId;
  }

  /**
   * Tenant-aware query methods
   * These automatically inject tenantId into where clauses
   */

  // LmsUser queries
  get lmsUser() {
    const tenantId = this.getTenantId();
    return {
      findMany: (args?: Prisma.LmsUserFindManyArgs) =>
        this.prisma.lmsUser.findMany({
          ...args,
          where: { ...args?.where, tenantId },
        }),
      findUnique: (args: Prisma.LmsUserFindUniqueArgs) =>
        this.prisma.lmsUser.findUnique({
          ...args,
          where: { ...args.where, tenantId },
        }),
      findFirst: (args?: Prisma.LmsUserFindFirstArgs) =>
        this.prisma.lmsUser.findFirst({
          ...args,
          where: { ...args?.where, tenantId },
        }),
      create: (args: Prisma.LmsUserCreateArgs) => {
        const { tenantId: _tenantId, ...data } =
          args.data as Prisma.LmsUserCreateInput & { tenantId?: string };
        void _tenantId;
        return this.prisma.lmsUser.create({
          ...args,
          data: { ...data, tenant: { connect: { id: tenantId } } },
        });
      },
      update: (args: Prisma.LmsUserUpdateArgs) =>
        this.prisma.lmsUser.update({
          ...args,
          where: { ...args.where, tenantId },
        }),
      delete: (args: Prisma.LmsUserDeleteArgs) =>
        this.prisma.lmsUser.delete({
          ...args,
          where: { ...args.where, tenantId },
        }),
      count: (args?: Prisma.LmsUserCountArgs) =>
        this.prisma.lmsUser.count({
          ...args,
          where: { ...args?.where, tenantId },
        }),
    };
  }

  // Class queries
  get class() {
    const tenantId = this.getTenantId();
    return {
      findMany: (args?: Prisma.ClassFindManyArgs) =>
        this.prisma.class.findMany({
          ...args,
          where: { ...args?.where, tenantId },
        }),
      findUnique: (args: Prisma.ClassFindUniqueArgs) =>
        this.prisma.class.findUnique({
          ...args,
          where: { ...args.where, tenantId },
        }),
      findFirst: (args?: Prisma.ClassFindFirstArgs) =>
        this.prisma.class.findFirst({
          ...args,
          where: { ...args?.where, tenantId },
        }),
      create: (args: Prisma.ClassCreateArgs) => {
        const { tenantId: _tenantId, ...data } =
          args.data as Prisma.ClassCreateInput & { tenantId?: string };
        void _tenantId;
        return this.prisma.class.create({
          ...args,
          data: { ...data, tenant: { connect: { id: tenantId } } },
        });
      },
      update: (args: Prisma.ClassUpdateArgs) =>
        this.prisma.class.update({
          ...args,
          where: { ...args.where, tenantId },
        }),
      delete: (args: Prisma.ClassDeleteArgs) =>
        this.prisma.class.delete({
          ...args,
          where: { ...args.where, tenantId },
        }),
      count: (args?: Prisma.ClassCountArgs) =>
        this.prisma.class.count({
          ...args,
          where: { ...args?.where, tenantId },
        }),
    };
  }

  // Subject queries
  get subject() {
    const tenantId = this.getTenantId();
    return {
      findMany: (args?: Prisma.SubjectFindManyArgs) =>
        this.prisma.subject.findMany({
          ...args,
          where: { ...args?.where, tenantId },
        }),
      findUnique: (args: Prisma.SubjectFindUniqueArgs) =>
        this.prisma.subject.findUnique({
          ...args,
          where: { ...args.where, tenantId },
        }),
      findFirst: (args?: Prisma.SubjectFindFirstArgs) =>
        this.prisma.subject.findFirst({
          ...args,
          where: { ...args?.where, tenantId },
        }),
      create: (args: Prisma.SubjectCreateArgs) => {
        const { tenantId: _tenantId, ...data } =
          args.data as Prisma.SubjectCreateInput & { tenantId?: string };
        void _tenantId;
        return this.prisma.subject.create({
          ...args,
          data: { ...data, tenant: { connect: { id: tenantId } } },
        });
      },
      update: (args: Prisma.SubjectUpdateArgs) =>
        this.prisma.subject.update({
          ...args,
          where: { ...args.where, tenantId },
        }),
      delete: (args: Prisma.SubjectDeleteArgs) =>
        this.prisma.subject.delete({
          ...args,
          where: { ...args.where, tenantId },
        }),
      count: (args?: Prisma.SubjectCountArgs) =>
        this.prisma.subject.count({
          ...args,
          where: { ...args?.where, tenantId },
        }),
    };
  }

  // Course queries
  get course() {
    const tenantId = this.getTenantId();
    return {
      findMany: (args?: Prisma.CourseFindManyArgs) =>
        this.prisma.course.findMany({
          ...args,
          where: { ...args?.where, tenantId },
        }),
      findUnique: (args: Prisma.CourseFindUniqueArgs) =>
        this.prisma.course.findUnique({
          ...args,
          where: { ...args.where, tenantId },
        }),
      findFirst: (args?: Prisma.CourseFindFirstArgs) =>
        this.prisma.course.findFirst({
          ...args,
          where: { ...args?.where, tenantId },
        }),
      create: (args: Prisma.CourseCreateArgs) => {
        const { tenantId: _tenantId, ...data } =
          args.data as Prisma.CourseCreateInput & { tenantId?: string };
        void _tenantId;
        return this.prisma.course.create({
          ...args,
          data: { ...data, tenant: { connect: { id: tenantId } } },
        });
      },
      update: (args: Prisma.CourseUpdateArgs) =>
        this.prisma.course.update({
          ...args,
          where: { ...args.where, tenantId },
        }),
      delete: (args: Prisma.CourseDeleteArgs) =>
        this.prisma.course.delete({
          ...args,
          where: { ...args.where, tenantId },
        }),
      count: (args?: Prisma.CourseCountArgs) =>
        this.prisma.course.count({
          ...args,
          where: { ...args?.where, tenantId },
        }),
    };
  }

  // Enrollment queries
  get enrollment() {
    const tenantId = this.getTenantId();
    return {
      findMany: (args?: Prisma.EnrollmentFindManyArgs) =>
        this.prisma.enrollment.findMany({
          ...args,
          where: { ...args?.where, tenantId },
        }),
      findUnique: (args: Prisma.EnrollmentFindUniqueArgs) =>
        this.prisma.enrollment.findUnique({
          ...args,
          where: { ...args.where, tenantId },
        }),
      findFirst: (args?: Prisma.EnrollmentFindFirstArgs) =>
        this.prisma.enrollment.findFirst({
          ...args,
          where: { ...args?.where, tenantId },
        }),
      create: (args: Prisma.EnrollmentCreateArgs) => {
        const { tenantId: _tenantId, ...data } =
          args.data as Prisma.EnrollmentCreateInput & { tenantId?: string };
        void _tenantId;
        return this.prisma.enrollment.create({
          ...args,
          data: { ...data, tenant: { connect: { id: tenantId } } },
        });
      },
      update: (args: Prisma.EnrollmentUpdateArgs) =>
        this.prisma.enrollment.update({
          ...args,
          where: { ...args.where, tenantId },
        }),
      delete: (args: Prisma.EnrollmentDeleteArgs) =>
        this.prisma.enrollment.delete({
          ...args,
          where: { ...args.where, tenantId },
        }),
      count: (args?: Prisma.EnrollmentCountArgs) =>
        this.prisma.enrollment.count({
          ...args,
          where: { ...args?.where, tenantId },
        }),
    };
  }

  // Access to raw Prisma client for non-tenant-scoped operations
  // (e.g., Tenant table itself, Better Auth tables)
  get raw() {
    return this.prisma;
  }
}

/**
 * Get tenant-aware Prisma client
 * This should be used instead of the raw Prisma client for all tenant-scoped queries
 */
export function getTenantPrisma(prisma: PrismaClient): TenantPrismaClient {
  return new TenantPrismaClient(prisma);
}
