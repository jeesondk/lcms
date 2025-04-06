import { db } from '@/lib/db';
import { pages } from '@/db/schema';

export async function addPage(taxonomyId: number, iso_language: string) {
    try {
        const newPage = await db.insert(pages).values({
            id: taxonomyId,
            iso_language,
            content: [],
          }).returning();

        return newPage;
    } catch (error) {
        console.error('Error adding page:', error);
        throw error;
    }
}