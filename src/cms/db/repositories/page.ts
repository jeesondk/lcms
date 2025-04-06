import { db } from '@/lib/db';
import { taxonomy, pages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TaxonomyItem } from '@/types/taxonomyItem';

export async function addPage(path: string) {
    try {
        // Split the path into parts
        const parts = path.split('/').filter(part => part.trim() !== '');

        // Find the parent taxonomy item based on the path
        const parent = await db.query.taxonomy.findFirst({
            where: eq(taxonomy.path, parts.slice(0, -1).join('/')),
        });

        if (!parent) {
            throw new Error('Parent taxonomy item not found');
        }

        // Create a new page in the database
        const newPage = await db.insert(pages).values({
            title: parts[parts.length - 1],
            taxonomyId: parent.id,
        }).returning();

        return newPage;
    } catch (error) {
        console.error('Error adding page:', error);
        throw error;
    }
}