import { db } from "@/lib/db";
import { content } from "../schema";
import { eq, and } from 'drizzle-orm';


export async function getPageContent(pageId: number) {
    const result = await db
        .select()
        .from(content)
        .where(eq(content.pageId, pageId))
        .execute();
    return result;
}

export async function getContentById(contentId: number) {
    const result = await db
        .select()
        .from(content)
        .where(eq(content.id, contentId))
        .execute();
    return result[0];
}

export async function saveContent(contentId: number, contentData: string) {
    try{
        const result = await db
        .update(content)
        .set({
            value: contentData,
        })
        .where(eq(content.id, contentId))
        .returning()
        .execute();
    return result[0];
    } catch (error) {
        console.error('Error saving content:', error);
        throw error;
    }
    
}