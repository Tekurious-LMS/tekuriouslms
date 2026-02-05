
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking latest users...");
    try {
        const users = await prisma.domainUser.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                tenant: true
            }
        });

        if (users.length === 0) {
            console.log("No users found.");
        } else {
            users.forEach(u => {
                console.log(`User: ${u.name} (${u.email})`);
                console.log(`  ID: ${u.id}`);
                console.log(`  BetterAuthID: ${u.authUserId}`);
                console.log(`  Tenant: ${u.tenant.name}`);
                console.log(`  Role: ${u.role}`);
                console.log("-----------------------------------");
            });
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
