
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking latest users...");
    const users = await prisma.lmsUser.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            roles: {
                include: {
                    role: true
                }
            }
        }
    });

    if (users.length === 0) {
        console.log("No users found.");
    } else {
        users.forEach(u => {
            console.log(`User: ${u.name} (${u.email})`);
            console.log(`  ID: ${u.id}`);
            console.log(`  BetterAuthID: ${u.betterAuthUserId}`);
            console.log(`  Roles: ${u.roles.map(r => r.role.roleName).join(', ')}`);
            console.log("-----------------------------------");
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
