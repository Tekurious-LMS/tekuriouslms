const { PrismaClient } = require("@prisma/client");

async function comprehensiveVerification() {
    const prisma = new PrismaClient();

    console.log("🔍 Starting Comprehensive System Verification\n");
    console.log("=".repeat(60));

    const results = {
        passed: 0,
        failed: 0,
        warnings: 0,
    };

    try {
        // ========================================
        // 1. DATABASE SCHEMA VERIFICATION
        // ========================================
        console.log("\n📊 1. DATABASE SCHEMA VERIFICATION");
        console.log("-".repeat(60));

        try {
            // Check Tenant table
            const tenantCount = await prisma.tenant.count();
            console.log(`✅ Tenant table exists (${tenantCount} tenants)`);
            results.passed++;

            // Check default tenant
            const defaultTenant = await prisma.tenant.findUnique({
                where: { slug: "default" },
            });
            if (defaultTenant) {
                console.log(`✅ Default tenant exists: ${defaultTenant.name}`);
                results.passed++;
            } else {
                console.log(`❌ Default tenant NOT found`);
                results.failed++;
            }

            // List all tenants
            const allTenants = await prisma.tenant.findMany();
            console.log(`\n   Tenants in database:`);
            allTenants.forEach(t => {
                console.log(`   - ${t.name} (slug: ${t.slug})`);
            });

        } catch (error) {
            console.log(`❌ Database schema error: ${error.message}`);
            results.failed++;
        }

        // ========================================
        // 2. TENANT-SCOPED ENTITIES
        // ========================================
        console.log("\n\n🔗 2. TENANT-SCOPED ENTITIES VERIFICATION");
        console.log("-".repeat(60));

        const entities = [
            { name: "LmsUser", model: prisma.lmsUser },
            { name: "Board", model: prisma.board },
            { name: "School", model: prisma.school },
            { name: "Class", model: prisma.class },
            { name: "Subject", model: prisma.subject },
            { name: "Course", model: prisma.course },
            { name: "Enrollment", model: prisma.enrollment },
        ];

        for (const entity of entities) {
            try {
                const count = await entity.model.count();
                console.log(`✅ ${entity.name} table accessible (${count} records)`);
                results.passed++;
            } catch (error) {
                console.log(`❌ ${entity.name} table error: ${error.message}`);
                results.failed++;
            }
        }

        // ========================================
        // 3. DATA INTEGRITY
        // ========================================
        console.log("\n\n🔒 3. DATA INTEGRITY VERIFICATION");
        console.log("-".repeat(60));

        try {
            // Check if any users exist without tenantId
            const usersWithoutTenant = await prisma.lmsUser.count({
                where: { tenantId: null },
            });

            if (usersWithoutTenant === 0) {
                console.log(`✅ All users have tenantId assigned`);
                results.passed++;
            } else {
                console.log(`⚠️  ${usersWithoutTenant} users without tenantId`);
                results.warnings++;
            }
        } catch (error) {
            console.log(`⚠️  Could not verify user tenantId: ${error.message}`);
            results.warnings++;
        }

        // ========================================
        // 4. AUTHENTICATION SYSTEM
        // ========================================
        console.log("\n\n🔐 4. AUTHENTICATION SYSTEM");
        console.log("-".repeat(60));

        try {
            const betterAuthUsers = await prisma.user.count();
            console.log(`✅ Better Auth user table accessible (${betterAuthUsers} users)`);
            results.passed++;

            const sessions = await prisma.session.count();
            console.log(`✅ Session table accessible (${sessions} sessions)`);
            results.passed++;
        } catch (error) {
            console.log(`❌ Auth system error: ${error.message}`);
            results.failed++;
        }

        // ========================================
        // 5. SUMMARY
        // ========================================
        console.log("\n\n" + "=".repeat(60));
        console.log("📋 VERIFICATION SUMMARY");
        console.log("=".repeat(60));
        console.log(`✅ Passed: ${results.passed}`);
        console.log(`❌ Failed: ${results.failed}`);
        console.log(`⚠️  Warnings: ${results.warnings}`);

        const total = results.passed + results.failed + results.warnings;
        const successRate = ((results.passed / total) * 100).toFixed(1);
        console.log(`\n📊 Success Rate: ${successRate}%`);

        if (results.failed === 0) {
            console.log("\n🎉 All critical checks passed!");
            console.log("✨ System is ready for development");
        } else {
            console.log("\n⚠️  Some checks failed. Review errors above.");
        }

    } catch (error) {
        console.error("\n❌ Fatal error during verification:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

comprehensiveVerification();
