/**
 * Tenant Onboarding Bootstrap Script
 * 
 * Creates a new tenant with initial admin user
 * 
 * Usage: npm run onboard:tenant
 */

import { prisma } from "../src/lib/prisma";
import { Role } from "../src/lib/rbac-types";
import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function onboardTenant() {
    console.log("🏫 Tekurious LMS - Tenant Onboarding\n");

    // Collect tenant information
    const tenantName = await question("Tenant Name (e.g., 'Example School'): ");
    const tenantDomain = await question(
        "Tenant Domain (e.g., 'example-school'): "
    );

    // Collect admin information
    const adminEmail = await question("Admin Email: ");
    const adminName = await question("Admin Name: ");

    console.log("\n📋 Summary:");
    console.log(`Tenant: ${tenantName} (${tenantDomain})`);
    console.log(`Admin: ${adminName} (${adminEmail})\n`);

    const confirm = await question("Proceed with onboarding? (yes/no): ");

    if (confirm.toLowerCase() !== "yes") {
        console.log("❌ Onboarding cancelled");
        rl.close();
        return;
    }

    try {
        // 1. Create tenant
        console.log("\n1️⃣ Creating tenant...");
        const tenant = await prisma.tenant.create({
            data: {
                name: tenantName,
                domain: tenantDomain,
            },
        });
        console.log(`✅ Tenant created: ${tenant.id}`);

        // 2. Create admin user
        console.log("\n2️⃣ Creating admin user...");
        const adminUser = await prisma.lmsUser.create({
            data: {
                email: adminEmail,
                name: adminName,
                tenantId: tenant.id,
            },
        });
        console.log(`✅ Admin user created: ${adminUser.id}`);

        // 3. Assign admin role
        console.log("\n3️⃣ Assigning admin role...");
        await prisma.userRole.create({
            data: {
                userId: adminUser.id,
                role: Role.ADMIN,
                tenantId: tenant.id,
            },
        });
        console.log(`✅ Admin role assigned`);

        console.log("\n🎉 Tenant onboarding complete!");
        console.log("\n📝 Next steps:");
        console.log(`1. Admin should sign up at: ${process.env.BETTER_AUTH_URL}/signup`);
        console.log(`2. Use email: ${adminEmail}`);
        console.log(`3. After signup, admin can:`);
        console.log(`   - Create academic structure (classes, subjects)`);
        console.log(`   - Invite teachers`);
        console.log(`   - Manage users`);

        console.log("\n⚠️  Important:");
        console.log("- No demo data has been created");
        console.log("- Academic structure starts empty");
        console.log("- Admin must set up classes and subjects manually");
    } catch (error) {
        console.error("\n❌ Onboarding failed:", error);
        throw error;
    } finally {
        rl.close();
        await prisma.$disconnect();
    }
}

// Run onboarding
onboardTenant().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
