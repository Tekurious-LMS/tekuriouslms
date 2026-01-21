import { defineConfig } from '@prisma/client';

export default defineConfig({
    adapter: {
        provider: 'postgresql',
        url: process.env.DATABASE_URL!,
    },
    migrate: {
        url: process.env.DIRECT_URL!,
    },
});
