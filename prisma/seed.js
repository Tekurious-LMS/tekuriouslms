const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database with tenant data...");

    // Check if default tenant exists
    const existingTenant = await prisma.tenant.findUnique({
        where: { slug: "default" },
    });

    if (existingTenant) {
        console.log("✅ Default tenant already exists:", existingTenant.name);
    } else {
        // Create default tenant
        const defaultTenant = await prisma.tenant.create({
            data: {
                name: "Default Organization",
                slug: "default",
            },
        });
        console.log("✅ Created default tenant:", defaultTenant.name);
    }

    // Create additional test tenants
    const testTenants = [
        { name: "School A", slug: "school-a" },
        { name: "School B", slug: "school-b" },
    ];

    for (const tenantData of testTenants) {
        const existing = await prisma.tenant.findUnique({
            where: { slug: tenantData.slug },
        });

        if (existing) {
            console.log(`✅ Tenant already exists: ${existing.name}`);
        } else {
            const tenant = await prisma.tenant.create({
                data: tenantData,
            });
            console.log(`✅ Created tenant: ${tenant.name} (${tenant.slug})`);
        }
    }

    console.log("\n🎉 Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
