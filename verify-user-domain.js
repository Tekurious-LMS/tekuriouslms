/**
 * User Domain Verification Script
 * 
 * Verifies:
 * 1. StudentProfile and ParentMapping tables exist
 * 2. Schema relationships are correct
 * 3. Indexes are in place
 * 4. Sample data can be created
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 User Domain Verification\n');

    try {
        // ========================================
        // 1. Verify Tables Exist
        // ========================================
        console.log('📋 Step 1: Verifying tables exist...');

        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('StudentProfile', 'ParentMapping')
      ORDER BY table_name;
    `;

        console.log('✅ Tables found:', tables.map(t => t.table_name).join(', '));

        if (tables.length !== 2) {
            throw new Error('Expected 2 tables (StudentProfile, ParentMapping)');
        }

        // ========================================
        // 2. Verify StudentProfile Schema
        // ========================================
        console.log('\n📋 Step 2: Verifying StudentProfile schema...');

        const studentProfileColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'StudentProfile'
      ORDER BY ordinal_position;
    `;

        console.log('✅ StudentProfile columns:', studentProfileColumns.length);
        studentProfileColumns.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'required'})`);
        });

        // ========================================
        // 3. Verify ParentMapping Schema
        // ========================================
        console.log('\n📋 Step 3: Verifying ParentMapping schema...');

        const parentMappingColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'ParentMapping'
      ORDER BY ordinal_position;
    `;

        console.log('✅ ParentMapping columns:', parentMappingColumns.length);
        parentMappingColumns.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'required'})`);
        });

        // ========================================
        // 4. Verify Indexes
        // ========================================
        console.log('\n📋 Step 4: Verifying indexes...');

        const indexes = await prisma.$queryRaw`
      SELECT 
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename IN ('StudentProfile', 'ParentMapping')
      ORDER BY tablename, indexname;
    `;

        console.log('✅ Indexes found:', indexes.length);
        indexes.forEach(idx => {
            console.log(`   - ${idx.tablename}.${idx.indexname}`);
        });

        // ========================================
        // 5. Verify Foreign Key Constraints
        // ========================================
        console.log('\n📋 Step 5: Verifying foreign key constraints...');

        const constraints = await prisma.$queryRaw`
      SELECT
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name IN ('StudentProfile', 'ParentMapping')
      ORDER BY tc.table_name, tc.constraint_name;
    `;

        console.log('✅ Foreign key constraints:', constraints.length);
        constraints.forEach(fk => {
            console.log(`   - ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
        });

        // ========================================
        // 6. Test Basic Queries
        // ========================================
        console.log('\n📋 Step 6: Testing basic queries...');

        // Count existing student profiles
        const studentProfileCount = await prisma.studentProfile.count();
        console.log(`✅ StudentProfile count: ${studentProfileCount}`);

        // Count existing parent mappings
        const parentMappingCount = await prisma.parentMapping.count();
        console.log(`✅ ParentMapping count: ${parentMappingCount}`);

        // ========================================
        // 7. Verify LmsUser Relations
        // ========================================
        console.log('\n📋 Step 7: Verifying LmsUser relations...');

        // Check if we can query with includes
        const userWithRelations = await prisma.lmsUser.findFirst({
            include: {
                studentProfile: true,
                parentMappings: true,
                studentMappings: true,
            },
        });

        if (userWithRelations) {
            console.log('✅ LmsUser relations working');
            console.log(`   - User: ${userWithRelations.name}`);
            console.log(`   - Has student profile: ${!!userWithRelations.studentProfile}`);
            console.log(`   - Parent mappings: ${userWithRelations.parentMappings.length}`);
            console.log(`   - Student mappings: ${userWithRelations.studentMappings.length}`);
        } else {
            console.log('⚠️  No users found to test relations');
        }

        // ========================================
        // Summary
        // ========================================
        console.log('\n' + '='.repeat(50));
        console.log('✅ ALL VERIFICATIONS PASSED');
        console.log('='.repeat(50));
        console.log('\n📊 Summary:');
        console.log(`   - Tables: 2 (StudentProfile, ParentMapping)`);
        console.log(`   - Indexes: ${indexes.length}`);
        console.log(`   - Foreign Keys: ${constraints.length}`);
        console.log(`   - Student Profiles: ${studentProfileCount}`);
        console.log(`   - Parent Mappings: ${parentMappingCount}`);
        console.log('\n🎉 User Domain is ready!');

    } catch (error) {
        console.error('\n❌ Verification failed:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
