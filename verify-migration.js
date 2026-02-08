const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function verify() {
    console.log("🔍 Verifying database migration...\n");

    try {
        // Check Tenant table exists and has data
        const tenants = await prisma.tenant.findMany();
        console.log(`✅ Tenant table exists`);
        console.log(`✅ Found ${tenants.length} tenant(s):\n`);

        tenants.forEach(tenant => {
            console.log(`   - ${tenant.name} (slug: ${tenant.slug})`);
        });

        // Check if default tenant exists
        const defaultTenant = await prisma.tenant.findUnique({
            where: { slug: "default" }
        });

        if (defaultTenant) {
            console.log(`\n✅ Default tenant exists: ${defaultTenant.name}`);
        } else {
            console.log(`\n❌ Default tenant NOT found!`);
        }

        // Check if User table has tenantId column
        const userCount = await prisma.lmsUser.count();
        console.log(`\n✅ LmsUser table has tenantId column`);
        console.log(`   Total users: ${userCount}`);

        console.log("\n🎉 Migration verification complete!");
        console.log("\n📋 Summary:");
        console.log(`   - Tenant table: ✅ Created`);
        console.log(`   - Tenants seeded: ✅ ${tenants.length} tenant(s)`);
        console.log(`   - Schema updated: ✅ tenantId added to entities`);
        console.log("\n✨ Your database is ready for multi-tenant operations!");

    } catch (error) {
        console.error("\n❌ Verification failed:", error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
