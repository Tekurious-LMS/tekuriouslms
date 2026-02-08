import { PrismaClient } from "@prisma/client";
import { requireTenantContext } from "./tenant-context";

/**
 * Extended Prisma Client with tenant-aware query methods
 * This wrapper automatically injects tenantId into all queries
 */
export class TenantPrismaClient {
    constructor(private prisma: PrismaClient) { }

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
            findMany: (args?: any) =>
                this.prisma.lmsUser.findMany({
                    ...args,
                    where: { ...args?.where, tenantId },
                }),
            findUnique: (args: any) =>
                this.prisma.lmsUser.findUnique({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            findFirst: (args?: any) =>
                this.prisma.lmsUser.findFirst({
                    ...args,
                    where: { ...args?.where, tenantId },
                }),
            create: (args: any) =>
                this.prisma.lmsUser.create({
                    ...args,
                    data: { ...args.data, tenantId },
                }),
            update: (args: any) =>
                this.prisma.lmsUser.update({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            delete: (args: any) =>
                this.prisma.lmsUser.delete({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            count: (args?: any) =>
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
            findMany: (args?: any) =>
                this.prisma.class.findMany({
                    ...args,
                    where: { ...args?.where, tenantId },
                }),
            findUnique: (args: any) =>
                this.prisma.class.findUnique({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            findFirst: (args?: any) =>
                this.prisma.class.findFirst({
                    ...args,
                    where: { ...args?.where, tenantId },
                }),
            create: (args: any) =>
                this.prisma.class.create({
                    ...args,
                    data: { ...args.data, tenantId },
                }),
            update: (args: any) =>
                this.prisma.class.update({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            delete: (args: any) =>
                this.prisma.class.delete({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            count: (args?: any) =>
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
            findMany: (args?: any) =>
                this.prisma.subject.findMany({
                    ...args,
                    where: { ...args?.where, tenantId },
                }),
            findUnique: (args: any) =>
                this.prisma.subject.findUnique({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            findFirst: (args?: any) =>
                this.prisma.subject.findFirst({
                    ...args,
                    where: { ...args?.where, tenantId },
                }),
            create: (args: any) =>
                this.prisma.subject.create({
                    ...args,
                    data: { ...args.data, tenantId },
                }),
            update: (args: any) =>
                this.prisma.subject.update({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            delete: (args: any) =>
                this.prisma.subject.delete({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            count: (args?: any) =>
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
            findMany: (args?: any) =>
                this.prisma.course.findMany({
                    ...args,
                    where: { ...args?.where, tenantId },
                }),
            findUnique: (args: any) =>
                this.prisma.course.findUnique({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            findFirst: (args?: any) =>
                this.prisma.course.findFirst({
                    ...args,
                    where: { ...args?.where, tenantId },
                }),
            create: (args: any) =>
                this.prisma.course.create({
                    ...args,
                    data: { ...args.data, tenantId },
                }),
            update: (args: any) =>
                this.prisma.course.update({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            delete: (args: any) =>
                this.prisma.course.delete({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            count: (args?: any) =>
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
            findMany: (args?: any) =>
                this.prisma.enrollment.findMany({
                    ...args,
                    where: { ...args?.where, tenantId },
                }),
            findUnique: (args: any) =>
                this.prisma.enrollment.findUnique({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            findFirst: (args?: any) =>
                this.prisma.enrollment.findFirst({
                    ...args,
                    where: { ...args?.where, tenantId },
                }),
            create: (args: any) =>
                this.prisma.enrollment.create({
                    ...args,
                    data: { ...args.data, tenantId },
                }),
            update: (args: any) =>
                this.prisma.enrollment.update({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            delete: (args: any) =>
                this.prisma.enrollment.delete({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            count: (args?: any) =>
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
